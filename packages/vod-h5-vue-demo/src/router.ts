/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */

import { createRouter, createWebHistory } from 'vue-router';
import type { Component } from 'vue';

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./pages/home/index.vue'),
  },
  {
    path: '/playlet/square',
    name: 'Square',
    component: () => import('./pages/square/index.vue'),
  },
  {
    path: '/playlet/theater',
    name: 'Theater',
    component: () => import('./pages/theater/index.vue'),
  },
];

// 创建路由
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

// 特性列表的类型和数据定义
export interface IChild {
  path: string;
  key: string;
  component: Component;
}

export interface IFeat {
  name: string;
  icon: string;
  key: string;
  path: string;
  jump: string;
  pages?: IChild[];
}

export const featureList: IFeat[] = [
  {
    name: '短剧',
    icon: 'playlet',
    key: 'playlet',
    path: 'playlet',
    jump: '/playlet/square',
    pages: [
      {
        path: 'square',
        key: 'square',
        component: () => import('./pages/square/index.vue'),
      },
      {
        path: 'theater',
        key: 'theater',
        component: () => import('./pages/theater/index.vue'),
      },
    ],
  },
];
