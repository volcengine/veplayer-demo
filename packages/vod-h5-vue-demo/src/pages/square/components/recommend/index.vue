<template>
  <div v-if="recLoading" class="loading-mask"></div>
  <div v-else class="wrap">
    <VideoSwiper
      :startTime="startTime"
      :isRecommendActive="isRecommendActive"
      :isRecommend="isRecommend"
      :videoDataList="list"
      :isSliderMoving="isSliderMoving"
      @change="setActiveIndex"
      @progressDrag="onProgressDrag"
      @progressDragend="onProgressDragend"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */
import { ref, computed, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { showToast, closeToast } from 'vant';
import type { IVideoDataWithModel } from '@/typings';
import VideoSwiper from '@/components/VideoSwiper.vue';
import { parseModel } from '@/utils';

const props = defineProps({
  isRecommend: {
    type: Boolean,
    required: true,
  },
  isRecommendActive: {
    type: Boolean,
    required: true,
  },
  isSliderMoving: {
    type: Boolean,
    required: true,
  },
  recData: {
    type: Object,
    default: () => ({}),
  },
  recLoading: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['progressDrag', 'progressDragend']);

const route = useRoute();
const startTime = Number(route.query.startTime || 0);
const toastRef = ref<any>(null);
const activeIndex = ref(0);

// 处理数据
const list = computed<IVideoDataWithModel[]>(() =>
  (props.recData?.result || [])
    .map((item: any) => {
      const model: IVideoDataWithModel = {
        ...item,
        videoModel: parseModel(item.videoModel),
      };
      return model;
    })
    .filter((item: IVideoDataWithModel) => item?.videoModel?.PlayInfoList?.[0]?.MainPlayUrl),
);

const current = computed<IVideoDataWithModel | null>(() => list.value?.[activeIndex.value] || null);

// 设置当前索引
const setActiveIndex = (index: number) => {
  activeIndex.value = index;
};

// 进度条拖动事件
const onProgressDrag = () => {
  emit('progressDrag');
};

// 进度条拖动结束事件
const onProgressDragend = () => {
  emit('progressDragend');
};

// 监听当前视频变化
watch([() => props.isRecommend, () => current.value], ([isRecommend, currentVideo]) => {
  if (isRecommend) {
    return;
  }
  if (currentVideo) {
    if (toastRef.value) {
      closeToast();
      toastRef.value = null;
    }
  } else {
    toastRef.value = showToast({
      type: 'loading',
      message: '加载中…',
      duration: 0,
    });
  }
});

// 组件卸载时关闭toast
onUnmounted(() => {
  if (toastRef.value) {
    closeToast();
  }
});
</script>

<style scoped>
.wrap {
  position: relative;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  background-color: #000;
}

.loading-mask {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: #000;
}
</style>
