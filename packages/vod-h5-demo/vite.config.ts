import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import postCssPxToRem from 'postcss-pxtorem';
import autoprefixer from 'autoprefixer';
import svgr from 'vite-plugin-svgr';
import basicSsl from '@vitejs/plugin-basic-ssl';

const isProd = process.env.NODE_ENV === 'production';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    // basicSsl({
    //   /** name of certification */
    //   name: 'test',
    //   /** custom trust domains */
    //   domains: ['*.custom.com'],
    //   /** custom certification directory */
    //   certDir: '/Users/bytedance/tool/cert/vite-cert',
    // }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.ts', '.tsx', '.js'],
  },
  define: {
    __API_BASE_URL__: isProd
      ? JSON.stringify('http://vod-sdk-playground-test.byted.org')
      : JSON.stringify('/proxy-api'),
    __AuthorId__: JSON.stringify('frank_drama_test_5'),
    __PLAY_DOMAIN__: isProd
      ? JSON.stringify('https://volcengineapi-boe-stable.byted.org')
      : JSON.stringify('100.81.56.85:5173/video-api/'),
  },
  base: isProd ? '//veplayer-h5.gf-boe.bytedance.net/veplayer-h5' : '',
  build: {
    outDir: path.resolve(__dirname, 'output'),
  },
  server: {
    port: 5173,
    // https: true,
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
          // 自动添加前缀 的浏览器
          overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ie >= 8', 'last 2 versions'],
          grid: true,
        }),
      ],
    },
  },
});
