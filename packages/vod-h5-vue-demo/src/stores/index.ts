/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */

import { defineStore } from 'pinia';

// 定义状态接口
interface State {
  isLoading: boolean;
  dramaList: any[];
  episodeList: any[];
}

// 定义并导出存储
export const useMainStore = defineStore('main', {
  // 状态
  state: (): State => ({
    isLoading: false,
    dramaList: [],
    episodeList: [],
  }),

  // getters
  getters: {
    hasDrama: state => state.dramaList.length > 0,
    hasEpisode: state => state.episodeList.length > 0,
  },

  // actions
  actions: {
    setLoading(status: boolean) {
      this.isLoading = status;
    },

    setDramaList(list: any[]) {
      this.dramaList = list;
    },

    setEpisodeList(list: any[]) {
      this.episodeList = list;
    },

    clearData() {
      this.dramaList = [];
      this.episodeList = [];
    },
  },
});
