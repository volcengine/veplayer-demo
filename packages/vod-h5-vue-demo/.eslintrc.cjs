// .eslintrc.cjs
module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    // 'plugin:vue/vue3-essential'
  ],
  plugins: ['vue'],
  rules: {
    // 其他规则...
  },
  globals: {
    // Vite 注入的全局变量
    __APP_VERSION__: "readonly",
    __AuthorId__: "readonly",
    __IMAGEX_DOMAIN__: "readonly",
    __IMAGEX_TEMPLATE__: "readonly",
    __API_BASE_URL__: "readonly",
  }
};
