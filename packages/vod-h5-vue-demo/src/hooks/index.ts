/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */
import { ref, nextTick, onBeforeUnmount } from 'vue';

/**
 * 创建更新函数，强制组件刷新
 */
export function useUpdate() {
  const updated = ref<number>(0);
  return () => {
    updated.value += 1;
    return updated.value;
  };
}

/**
 * URL状态管理钩子
 */
export function useUrlState() {
  // 从URL获取状态
  const getStateFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const state: Record<string, string> = {};

    for (const [key, value] of params.entries()) {
      state[key] = value;
    }

    return state;
  };

  // 状态引用
  const urlState = ref(getStateFromUrl());

  // 更新状态到URL
  const setUrlState = (newState: Record<string, string>) => {
    const params = new URLSearchParams();

    // 合并现有状态和新状态
    const combinedState = { ...urlState.value, ...newState };

    // 设置URL参数
    for (const [key, value] of Object.entries(combinedState)) {
      if (value) {
        params.set(key, value);
      }
    }

    // 更新URL，不刷新页面
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);

    // 更新状态
    urlState.value = combinedState;
  };

  // 监听popstate事件
  const handlePopState = () => {
    nextTick(() => {
      urlState.value = getStateFromUrl();
    });
  };

  // 添加事件监听
  window.addEventListener('popstate', handlePopState);

  // 组件销毁前移除事件监听
  onBeforeUnmount(() => {
    window.removeEventListener('popstate', handlePopState);
  });

  return [urlState, setUrlState];
}
