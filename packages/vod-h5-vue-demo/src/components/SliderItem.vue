<template>
  <div class="wrapper">
    <template v-if="shouldRenderContent">
      <div class="poster">
        <img v-if="coverUrl" :src="coverUrl" alt="poster" />
      </div>
      <div :id="`swiper-video-container-${index}`" class="video-container">
        <div class="veplayer-cus-gradient-wrapper" />
        <slot />
      </div>
      <div class="right" @click="stopPropagation">
        <div class="btn-item" @click="toggleLike">
          <LikeActiveIcon v-if="isLike" class="icon" />
          <LikeIcon v-else class="icon" />
          <div class="num">{{ likeNum }}w</div>
        </div>
        <div class="btn-item" @click="toggleFav">
          <FavActiveIcon v-if="isFav" class="icon" />
          <FavIcon v-else class="icon" />
          <div class="num">{{ favNum }}w</div>
        </div>
      </div>
      <div class="bottom" @click="stopPropagation">
        <div class="title">
          {{ dramaTitle }}
        </div>
        <div class="des">
          <template v-if="isRecommend && episodeNumber">
            {{ `第${episodeNumber}集` }}
            <span class="split" />
            {{ episodeDesc }}
          </template>
          <template v-else>
            {{ episodeDesc }}
          </template>
        </div>
        <div v-if="isRecommend" class="info">
          <div class="text">
            <DIcon class="icon" />
            <div>{{ bottomText }}</div>
          </div>
          <div class="btn" @click="onBottomBtnClick">连续看</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */
import { computed, ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import type { IVideoDataWithModel } from '@/typings';

import LikeIcon from '@/assets/svg/like.svg';
import LikeActiveIcon from '@/assets/svg/like-active.svg';
import FavIcon from '@/assets/svg/fav.svg';
import FavActiveIcon from '@/assets/svg/fav-active.svg';
import DIcon from '@/assets/svg/d.svg';

const props = defineProps({
  data: {
    type: Object as () => IVideoDataWithModel,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  activeIndex: {
    type: Number,
    required: true,
  },
  isRecommend: {
    type: Boolean,
    default: false,
  },
  playNextStatus: {
    type: String,
    default: '',
  },
  getCurrentTime: {
    type: Function,
    default: () => 0,
  },
});

const router = useRouter();
const isLike = ref(false);
const isFav = ref(false);
const favNum = ref('0');
const likeNum = ref('0');

// 模拟点赞收藏数据
const mockFavLikeData = () => Math.floor(Math.random() * 5000 + 5000).toString();

// 属性
const coverUrl = props.data?.videoModel?.PosterUrl ?? props.data?.coverUrl;
const episodeDesc = props.data?.episodeDetail?.episodeDesc;
const dramaTitle = props.data?.episodeDetail?.dramaInfo?.dramaTitle;
const totalEpisodeNumber = props.data?.episodeDetail?.dramaInfo?.totalEpisodeNumber;
const episodeNumber = props.data?.episodeDetail?.episodeNumber;
const bottomText = computed(() => `观看完整短剧 · 全${totalEpisodeNumber}集`);

// 是否需要渲染内容（距离当前显示项两个项内才渲染）
const shouldRenderContent = computed(() => Math.abs(props.activeIndex - props.index) <= 2);

// 方法
const stopPropagation = (e: Event) => {
  e.stopPropagation();
};

const toggleLike = (e: Event) => {
  e.stopPropagation();
  isLike.value = !isLike.value;
};

const toggleFav = (e: Event) => {
  e.stopPropagation();
  isFav.value = !isFav.value;
};

const onBottomBtnClick = (e: Event) => {
  e.stopPropagation();
  const dramaId = props.data?.episodeDetail?.dramaInfo?.dramaId;
  const startTime = props.getCurrentTime();
  if (dramaId) {
    router.push(`/playlet/theater/?id=${dramaId}&startTime=${startTime}`);
  }
};

onBeforeMount(() => {
  favNum.value = mockFavLikeData();
  likeNum.value = mockFavLikeData();
});
</script>

<style scoped lang="less">
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  font-family:
    'PingFang SC',
    PingFang SC,
    Helvetica Neue,
    Helvetica,
    STHeiTi,
    Microsoft YaHei,
    WenQuanYi Micro Hei,
    sans-serif;
  transform: translate3d(0, 0, 0);

  .poster {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translate3d(0, 0, 0);

    img {
      height: auto;
      width: 100%;
    }
  }

  .video-container {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    opacity: 1;
  }

  :deep(.veplayer-cus-gradient-wrapper) {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 280px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.34) 97.36%);
    pointer-events: none;
    mix-blend-mode: normal;
    z-index: 1;
    transform: translate3d(0, 0, 0);
  }

  .right {
    position: absolute;
    right: calc(14px + env(safe-area-inset-right));
    bottom: 10px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transform: translate3d(0, 0, 0);

    .btn-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-bottom: 14px;
      color: #fff;
      text-align: center;
      cursor: pointer;

      .icon {
        width: 36px;
        height: 36px;
      }

      .num {
        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        color: #fff;
        text-align: center;
        text-shadow:
          0 0 4px rgb(0 0 0 / 20%),
          0 1px 1px rgb(0 0 0 / 15%);
      }
    }
  }

  .bottom {
    position: absolute;
    z-index: 2;
    right: 70px;
    bottom: 12px;
    left: calc(12px + env(safe-area-inset-left));
    transform: translate3d(0, 0, 0);
    text-align: justify;

    .title {
      margin-bottom: 5px;
      font-size: 17px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      color: #fff;
      user-select: none;
      font-family:
        'PingFang SC',
        PingFang SC,
        Helvetica Neue,
        Helvetica,
        STHeiTi,
        Microsoft YaHei,
        WenQuanYi Micro Hei,
        sans-serif;
    }

    .des {
      width: 100%;
      margin-bottom: 12px;
      font-size: 15px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      color: #fff;
      user-select: none;

      .split {
        display: inline-block;
        width: 1px;
        height: 13px;
        background-color: rgba(255, 255, 255, 0.5);
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.3);
        margin: 0 8px;
        vertical-align: middle;
      }
    }

    .info {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 48px;
      padding: 0 12px;
      line-height: 48px;
      background: rgb(41 41 41 / 34%);
      border-radius: 8px;

      .text {
        position: relative;
        width: fit-content;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-style: normal;
        font-weight: 500;
        line-height: 48px;
        color: #fff;
        text-align: left;
        font-family:
          'PingFang SC',
          PingFang SC,
          Helvetica Neue,
          Helvetica,
          STHeiTi,
          Microsoft YaHei,
          WenQuanYi Micro Hei,
          sans-serif;

        .icon {
          width: 12px;
          height: 12px;
          margin-right: 7px;
        }
      }

      .btn {
        height: 28px;
        padding: 0 12px;
        margin: 10px 0 10px 18px;
        font-size: 12px;
        font-weight: 600;
        line-height: 28px;
        color: #fff;
        text-align: center;
        text-shadow: 0 1px 1px rgb(0 0 0 / 15%);
        background: rgb(255 255 255 / 15%);
        backdrop-filter: blur(17px);
        border-radius: 6px;
        cursor: pointer;
      }
    }
  }
}
</style>
