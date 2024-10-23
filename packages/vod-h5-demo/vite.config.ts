import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import postCssPxToRem from 'postcss-pxtorem';
import autoprefixer from 'autoprefixer';
import svgr from 'vite-plugin-svgr';
import basicSsl from '@vitejs/plugin-basic-ssl';
import slardar from '@vcloud-lux/vite-plugin-slardar';
import legacy from '@vitejs/plugin-legacy';
import babel from '@rollup/plugin-babel';

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

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    slardar({ runtime: { name: '@veplayer/vod-h5-demo' } }),
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
    babel({
      babelHelpers: 'bundled',
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              ie: '11',
            },
            corejs: 3,
            useBuiltIns: 'usage',
          },
        ],
      ],
      extensions: ['.ts', '.js', '.jsx', '.tsx', '.es6', '.es', '.mjs'],
      include: ['src/**'],
    }),
    legacy({
      additionalLegacyPolyfills: ['regenerator-runtime/runtime', 'abortcontroller-polyfill'], // 添加额外的 polyfill
      renderLegacyChunks: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.less'],
  },
  define: {
    'process.env': {},
    __API_BASE_URL__: isOnline
      ? JSON.stringify('https://vevod-demo-server.volcvod.com')
      : isProd
        ? JSON.stringify('https://vevod-demo-server.volcvod.com')
        : JSON.stringify('/proxy-api'),
    __AuthorId__: isOnline
      ? JSON.stringify('mini-drama-video')
      : isProd
        ? JSON.stringify('mini-drama-video')
        : JSON.stringify('frank_drama_test_5'),
    __PLAY_DOMAIN__: isOnline
      ? JSON.stringify('')
      : isProd
        ? JSON.stringify('')
        : JSON.stringify('http://localhost:5173/video-api/'),

    __BASE__PATH__: isOnline
      ? JSON.stringify('/common/veplayer/h5')
      : isProd
        ? JSON.stringify('/veplayer-h5')
        : JSON.stringify(''),
    __IMAGEX_DOMAIN__: isOnline
      ? JSON.stringify('//imagex-vod-drama.byte-test.com')
      : isProd
        ? JSON.stringify('//imagex-vod-drama.byte-test.com')
        : JSON.stringify('//vod-demo-cover.volcimagex.cn'),
    __IMAGEX_TEMPLATE__: isOnline
      ? JSON.stringify('tplv-6susrskwwa-resize')
      : isProd
        ? JSON.stringify('tplv-6susrskwwa-resize')
        : JSON.stringify('tplv-j8hmcvvxia-resize'),
  },
  base: isOnline
    ? '//demo.volcvideo.com/common/veplayer/h5'
    : isProd
      ? '//veplayer-h5.gf-boe.bytedance.net/veplayer-h5'
      : '',
  build: {
    outDir: path.resolve(__dirname, 'output'),
    cssTarget: 'chrome61',
    rollupOptions: {
      output: {
        generatedCode: 'es5',
      },
    },
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
          overrideBrowserslist: ['Android > 4.1', 'iOS >= 10', 'Chrome > 49', 'last 2 versions'],
          grid: 'autoplace',
        }),
      ],
    },
  },
});
