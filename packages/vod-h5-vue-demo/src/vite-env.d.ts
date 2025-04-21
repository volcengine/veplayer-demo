/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}

declare module 'virtual:svg-icons-register';

declare const __AuthorId__: string;
declare const __IMAGEX_DOMAIN__: string;
declare const __IMAGEX_TEMPLATE__: string;
declare const __API_BASE_URL__: string;
declare module 'postcss-plugin-px2rem' {
  const content: any;
  export = content;
}
