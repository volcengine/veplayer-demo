import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import postCssPxToRem from 'postcss-pxtorem';
import autoprefixer from 'autoprefixer';
import svgr from 'vite-plugin-svgr';
import legacy from '@vitejs/plugin-legacy';
import babel from '@rollup/plugin-babel';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    babel({
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
    __API_BASE_URL__: JSON.stringify('https://vevod-demo-server.volcvod.com'),
    __AuthorId__: JSON.stringify('mini-drama-video'),
    __IMAGEX_DOMAIN__: JSON.stringify('https://imagex-vod-drama.byte-test.com'),
    __IMAGEX_TEMPLATE__: JSON.stringify('tplv-6susrskwwa-resize'),
  },
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
