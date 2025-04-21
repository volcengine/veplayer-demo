<template>
  <div class="wrap">
    <van-nav-bar class="head" left-arrow @click-left="back" :left-text="episodeNumber ? `第${episodeNumber}集` : ''">
      <template #left-arrow>
        <BackIcon />
      </template>
    </van-nav-bar>

    <div class="main">
      <VideoSwiper
        v-if="list.length"
        :video-data-list="list"
        :start-time="startTime"
        :is-recommend="false"
        @change="setActiveIndex"
      >
        <template #default="{}"> </template>
      </VideoSwiper>
    </div>

    <LoadingMask v-if="loading" />
  </div>
</template>

<script setup lang="ts">
/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */
import { ref, computed, onMounted, watchEffect, defineComponent, h, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showToast } from 'vant';
import axios from 'axios';
import { API_PATH } from '@/api';
import VideoSwiper from '@/components/VideoSwiper.vue';
import { parseModel } from '@/utils';
import BackIcon from '@/assets/svg/back_v3.svg';

import type { IVideoDataWithModel, IVideoModel } from '@/typings';

// 路由
const router = useRouter();
const route = useRoute();
const dramaId = computed(() => route.query.id as string);
const startTime = computed(() => Number(route.query.startTime || 0));

// 状态
const { data, loading } = useAxios({
  url: API_PATH.GetDramaEpisodeWithVideoModel,
  method: 'POST',
  data: {
    authorId: __AuthorId__,
    needSsl: true,
    dramaId: dramaId.value,
    offset: 0,
    pageSize: 50,
  },
});

const activeIndex = ref(0);
const toastRef = ref<any>(null);

// 计算属性
const list = computed<IVideoDataWithModel[]>(() => {
  return ((data.value?.result || []) as any[]).map(item => ({
    ...item,
    videoModel: parseModel(item.videoModel) as IVideoModel,
  }));
});

const current = computed(() => list.value?.[activeIndex.value]);
const episodeNumber = computed(() => current.value?.episodeDetail?.episodeNumber);

// 方法
const back = () => router.push('/playlet/square/');
const setActiveIndex = (index: number) => {
  activeIndex.value = index;
};

// 自定义加载中组件
const LoadingMask = defineComponent({
  setup() {
    return () => h('div', { class: 'loadingMask' });
  },
});

// 检查loading和current状态，显示或关闭Toast
watchEffect(() => {
  if (current.value) {
    toastRef.value?.close?.();
  } else if (loading.value) {
    toastRef.value = showToast({
      type: 'loading',
      message: '加载中...',
      forbidClick: true,
      duration: 0,
    });
  }
});

// axios-hooks实现
function useAxios(config: any) {
  const data = ref<any>({});
  const loading = ref(true);
  const error = ref(null);

  onMounted(async () => {
    try {
      const response = await axios(config);
      data.value = response.data;
    } catch (err: any) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  });

  return { data, loading, error };
}

// 滚动到顶部
// onMounted(() => {
//   const scrollFn = () => {
//     console.log(2222222,'scroll')
//     window.scrollTo({ left: 0, top: 0 });
//   };
//   window.addEventListener('scrollend', scrollFn);

//   return () => {
//     window.removeEventListener('scrollend', scrollFn);
//   };
// });
const scrollFn = () => {
  window.scrollTo({ left: 0, top: 0 });
};

onMounted(() => {
  window.addEventListener('scrollend', scrollFn);
});

onUnmounted(() => {
  window.removeEventListener('scrollend', scrollFn);
});
</script>

<style scoped lang="less">
.wrap {
  position: relative;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  background-color: #000;
  font-family:
    'PingFang SC',
    PingFang SC,
    Helvetica Neue,
    Helvetica,
    STHeiTi,
    Microsoft YaHei,
    WenQuanYi Micro Hei,
    sans-serif;

  :deep(.van-nav-bar) {
    height: 44px;
    background: transparent;
    --van-nav-bar-title-text-color: #fff;
    --van-nav-bar-title-font-size: 17px;
    --van-nav-bar-text-color: #fff;
    --van-nav-bar-icon-color: #fff;
    --van-nav-bar-arrow-size: 20px;
  }

  :deep(.van-nav-bar__left) {
    align-items: center;
  }

  :deep(.van-nav-bar__text) {
    font-size: 14px;
    text-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);
  }

  .head {
    position: fixed;
    z-index: 200;
    color: #fff;
    word-break: keep-all;
  }

  .main {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;

    :deep(.veplayer-container) {
      width: 100%;
      height: 100%;
    }
  }
}

.loadingMask {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  background-color: #000;
}
</style>
