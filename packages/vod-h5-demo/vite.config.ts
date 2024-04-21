import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import postCssPxToRem from 'postcss-pxtorem';
import autoprefixer from 'autoprefixer';
import svgr from 'vite-plugin-svgr';
import basicSsl from '@vitejs/plugin-basic-ssl';

// 环境说明
// isOnline => 用于线上正式发布及线上小流量
// !isOnline && isProd => 线下boe环境
// !isOnline && !isProd => 本地测试

const isProd = process.env.NODE_ENV === 'production';
/**
 * 环境变量 BUILD_TYPE 值由scm提供，offline对应线下版本（boe） test对应测试版本 private对应私有版本
 * - online对应线上版本
 * - offline对应线下版本（boe）
 * - test对应测试版本
 * - private对应私有版本
 */
const isOnline = process.env.BUILD_TYPE === 'online';

// 是否使用https开发调试
const useHttps = process.env.USE_HTTTPS === '1';

console.log('path', path.resolve(__dirname, 'src'));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    ...(useHttps
      ? [
          basicSsl({
            /** name of certification */
            name: 'test',
            /** custom trust domains */
            domains: ['*.custom.com'],
            /** custom certification directory */
            certDir: '/Users/bytedance/tool/cert/vite-cert',
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.less'],
  },
  define: {
    __API_BASE_URL__: isOnline
      ? JSON.stringify('https://vevod-demo-server.volcvod.com')
      : isProd
        ? JSON.stringify('http://vod-sdk-playground-test.byted.org')
        : JSON.stringify('/proxy-api'),
    __AuthorId__: isOnline ? JSON.stringify('mini-drama-video') : JSON.stringify('frank_drama_test_5'),
    __PLAY_DOMAIN__: isOnline
      ? JSON.stringify('')
      : isProd
        ? JSON.stringify('https://volcengineapi-boe-stable.byted.org')
        : JSON.stringify('http://localhost:5173/video-api/'),

    __BASE__PATH__: isOnline
      ? JSON.stringify('/common/veplayer/h5')
      : isProd
        ? JSON.stringify('/common/veplayer-h5')
        : JSON.stringify(''),
    __IMAGEX_DOMAIN__: isOnline
      ? JSON.stringify('//imagex-vod-drama.byte-test.com')
      : JSON.stringify('//vod-demo-cover.volcimagex.cn'),
    __IMAGEX_TEMPLATE__: isOnline ? JSON.stringify('tplv-6susrskwwa-resize') : JSON.stringify('tplv-j8hmcvvxia-resize'),
  },
  base: isOnline
    ? '//demo.volcvideo.com/common/veplayer/h5'
    : isProd
      ? '//veplayer-h5.gf.bytedance.net/veplayer-h5'
      : '',
  build: {
    outDir: path.resolve(__dirname, 'output'),
    cssTarget: 'chrome61',
  },
  server: {
    port: 5173,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    https: useHttps,
    proxy: {
      '^/proxy-api/.*': {
        target: 'http://vod-sdk-playground-test.byted.org',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/proxy-api/, ''),
      },
      '^/video-api/.*': {
        target: 'https://volcengineapi-boe-stable.byted.org',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/video-api/, ''),
      },
    },
  },
  css: {
    modules: {
      generateScopedName: '[local]-[hash:8]',
      localsConvention: 'camelCase',
    },
    postcss: {
      plugins: [
        postCssPxToRem({
          rootValue: 100,
          propList: ['*'], //可以从px转换为rem的属性，匹配正则
          exclude: /(node_module)|(src\/index.less)/,
          mediaQuery: false,
          minPixelValue: 3, //设置要替换的最小像素值(3px会被转rem)。 默认 0
        }),
        autoprefixer({
          // 自动添加前缀的浏览器
          overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ie >= 8', 'last 2 versions'],
          grid: true,
        }),
      ],
    },
  },
});
