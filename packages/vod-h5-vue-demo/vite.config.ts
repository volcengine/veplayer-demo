import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
// import basicSsl from '@vitejs/plugin-basic-ssl';
// import mkcert from 'vite-plugin-mkcert';
import path from 'path';
import autoprefixer from 'autoprefixer';
import postcssPluginPx2rem from 'postcss-plugin-px2rem';
import postcssPxtorem from 'postcss-pxtorem';
import babel from '@rollup/plugin-babel';
import svgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader({
      defaultImport: 'component', // or 'raw'
      svgo: false, // 启用 SVGO
      svgoConfig: {
        plugins: [
          { name: 'removeViewBox', active: false }, // 允许保留 viewBox
          // { name: 'removeDimensions', active: false }, // 移除 width 和 height，让 viewBox 生效
        ],
      },
    }) as any,
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    // 如果需要ssl环境调试，则使用下列插件
    // basicSsl(),
    // mkcert(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 5176,
    // https: true,
    proxy: {
      '/api': {
        target: 'https://vevod-demo-server.volcvod.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        babel({
          babelHelpers: 'runtime',
          exclude: /node_modules/,
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: 3,
              },
            ],
          ],
          plugins: [
            '@babel/plugin-transform-runtime',
            '@babel/plugin-transform-block-scoping',
            '@babel/plugin-proposal-nullish-coalescing-operator',
          ],
        }),
      ],
    },
    target: ['chrome51'],
    assetsInlineLimit: 10240,
    cssCodeSplit: true,
    sourcemap: true,
    manifest: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    include: ['@volcengine/veplayer'],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
    postcss: {
      plugins: [
        autoprefixer,
        postcssPluginPx2rem({
          rootValue: 100,
          unitPrecision: 5,
          propWhiteList: [],
          propBlackList: [],
          exclude: /(node_module)/,
          selectorBlackList: [],
          ignoreIdentifier: false,
          replace: true,
          mediaQuery: false,
          minPixelValue: 0,
        }),
        postcssPxtorem({
          rootValue: 100,
          propList: ['*'],
          minPixelValue: 2,
        }),
      ],
    },
  },
  define: {
    __AuthorId__: JSON.stringify('mini-drama-video'),
    __API_BASE_URL__: JSON.stringify('https://vevod-demo-server.volcvod.com'),
    __IMAGEX_DOMAIN__: JSON.stringify('https://imagex-vod-drama.byte-test.com'),
    __IMAGEX_TEMPLATE__: JSON.stringify('tplv-6susrskwwa-resize'),
  },
});
