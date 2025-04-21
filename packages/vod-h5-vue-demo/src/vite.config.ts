import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import legacy from '@vitejs/plugin-legacy';
import basicSsl from '@vitejs/plugin-basic-ssl';
import mkcert from 'vite-plugin-mkcert';
import path from 'path';
import autoprefixer from 'autoprefixer';
import postcssPluginPx2rem from 'postcss-plugin-px2rem';
import postcssPxtorem from 'postcss-pxtorem';
import babel from '@rollup/plugin-babel';

const projectRootDir = path.resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(projectRootDir, 'src/assets/svg')],
      symbolId: 'icon-[dir]-[name]',
    }),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    basicSsl(),
    mkcert(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    // https: true,
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
          rootValue: 37.5,
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
          rootValue: 37.5,
          propList: ['*'],
          minPixelValue: 2,
        }),
      ],
    },
  },
  define: {
    __AuthorId__: JSON.stringify('your-author-id-here'),
    __IMAGEX_DOMAIN__: JSON.stringify('https://your-imagex-domain.com'),
    __IMAGEX_TEMPLATE__: JSON.stringify('your-template-id'),
  },
});
