/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { NavBar } from 'vant';
import App from './App.vue';
import router from './router';
import VePlayer from './player';
import flexible from './utils/flexible';
// 导入组件
import Loading from './components/Loading.vue';
import 'vant/lib/index.css'; // 引入 Vant 样式

import './index.less';

// 初始化响应式布局
flexible(window, document);

// 创建Vue应用
const app = createApp(App);

// 全局注册组件
app.component('loading', Loading);

// 初始化视频播放器，确保与React版本一致
VePlayer.prepare({
  appId: 597335, // 从视频点播控制台-点播SDK-应用管理 获取
  strategies: {
    preload: true,
    adaptRange: true,
  },
  // 使用任意类型绕过类型检查，确保功能一致
  // @ts-ignore 类型定义与实际接受的参数不一致
  httpRetry: {
    maxCount: 3, // 最大重试次数
    intervalMs: 1000, // 重试间隔
    baseIntervalMs: 1000, // 基础重试间隔
  },
  // @ts-ignore 类型定义与实际接受的参数不一致
  fallback: {
    fromAlternate: true, // 尝试使用备用地址播放
    fromMSEToNative: true, // 从MSE降级到原生播放
  },
});

// 使用插件
app.use(createPinia());
app.use(NavBar);
app.use(router);

// 挂载应用
app.mount('#app'); 