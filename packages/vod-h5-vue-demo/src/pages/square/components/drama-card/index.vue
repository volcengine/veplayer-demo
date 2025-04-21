<template>
  <div class="card" @click="handleClick">
    <div class="content">
      <div class="main">
        <Viewer
          class="img"
          layout="responsive"
          objectFit="cover"
          objectPosition="center"
          placeholder="skeleton"
          :src="props.coverUrl"
          :imageSizes="imageSizes"
          :loader="imageLoader"
        />
        <div class="mask" />
        <div class="play_count">
          <PlayIcon />
          <span>{{ playCount }}w</span>
        </div>
      </div>
      <div class="foot">
        <div class="title">
          <div class="ellipsis">{{ dramaTitle }}</div>
        </div>
        <div class="des">{{ desText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */

import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUpdate } from '@/hooks';
// @ts-ignore
import { Viewer } from '@volcengine/imagex-vue3';
import PlayIcon from '@/assets/svg/play.svg';

// 定义props
const props = defineProps<{
  dramaId: string;
  dramaTitle: string;
  coverUrl: string;
  totalEpisodeNumber: number;
  latestEpisodeNumber: number;
}>();

// 图片尺寸列表（用于响应式加载）
const imageSizes = [120, 200, 300, 400];

// 获取router实例
const router = useRouter();

// 创建更新函数
const update = useUpdate();

// 随机播放数
const numRef = ref('');
const playCount = computed(() => numRef.value);

// 描述文本
const desText = computed(() => {
  return props.latestEpisodeNumber === props.totalEpisodeNumber
    ? `全${props.totalEpisodeNumber}集`
    : `更新至${props.latestEpisodeNumber}集`;
});

// 图片加载处理函数
const imageLoader = ({ src, format, width }: { src: string; format: string; width: number }) => {
  const path = src.split('/');
  const finalPath = path.splice(1).join('/');
  return `${__IMAGEX_DOMAIN__}/${finalPath}~${__IMAGEX_TEMPLATE__}:${width}:q75.${format || 'webp'}`;
};

// 处理点击事件
const handleClick = () => {
  router.push(`/playlet/theater/?id=${props.dramaId}`);
};

// 组件挂载后生成随机播放数
onMounted(() => {
  numRef.value = (Math.random() * 50 + 10).toFixed(1);
  update();
});
</script>

<style scoped lang="less">
.card {
  position: relative;
  width: 100%;
  padding-top: 187%;
  cursor: pointer;

  .content {
    position: absolute;
    inset: 0;
    width: 100%;

    .main {
      position: relative;
      width: 100%;
      height: calc(100% - 48px);
      border-radius: 8px;

      .img {
        width: 100%;
        height: 100%;
        position: relative;
        border-radius: 8px;
        object-fit: cover;
      }

      .mask {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 40px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
      }

      .play_count {
        position: absolute;
        bottom: 6px;
        left: 6px;
        display: flex;
        align-items: center;

        .play {
          width: 14px;
          height: 14px;
          margin-right: 4px;
          color: rgba(255, 255, 255, 0.9);
        }

        span {
          font-size: 12px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
          color: rgb(255 255 255 / 90%);
          text-shadow: 0 1px 1px rgb(0 0 0 / 15%);
        }
      }
    }

    .foot {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;

      .title {
        margin-top: 8px;
        font-size: 15px;
        font-weight: 500;
        line-height: 21px;
        color: rgba(22, 24, 35, 1);

        .ellipsis {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .des {
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        color: rgb(22 24 35 / 50%);
      }
    }
  }
}
</style>
