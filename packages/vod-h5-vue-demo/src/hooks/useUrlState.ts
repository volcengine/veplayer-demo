/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */

import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 模拟React的useUrlState hook功能
export default function useUrlState<T extends Record<string, any>>(initialState: T = {} as T) {
  const route = useRoute();
  const router = useRouter();

  // 初始化状态，结合URL参数和初始状态
  const initialStateWithQuery = { ...initialState } as Record<string, any>;
  // 从route.query中获取参数
  Object.keys(route.query).forEach(key => {
    const value = route.query[key];
    if (value !== undefined) {
      try {
        // 尝试解析JSON
        initialStateWithQuery[key] = JSON.parse(value as string);
      } catch (e) {
        // 如果不是有效的JSON，就直接使用原值
        initialStateWithQuery[key] = value;
      }
    }
  });

  const state = ref(initialStateWithQuery as T);

  // 更新URL状态
  const setState = (newState: Partial<T>) => {
    const updatedState = { ...state.value, ...newState };
    state.value = updatedState;

    // 更新URL
    const query = { ...route.query };
    Object.keys(newState).forEach(key => {
      const value = newState[key as keyof typeof newState];
      if (value === undefined || value === null) {
        delete query[key];
      } else if (typeof value === 'object') {
        query[key] = JSON.stringify(value);
      } else {
        query[key] = String(value);
      }
    });

    router.replace({ query });
  };

  return [state, setState] as const;
}
