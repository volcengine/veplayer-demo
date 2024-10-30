/*
 * Copyright 2024 Beijing Volcano Engine Technology Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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