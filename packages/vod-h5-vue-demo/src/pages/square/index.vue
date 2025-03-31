<template>
  <div :class="['main', isRecommendActive ? 'recommend-active' : 'recommend-inactive']">
    <!-- 顶部导航栏 -->
    <div class="head">
      <div class="navbar">
        <div class="navbar-back" @click="back">
          <component :is="isRecommendActive ? BackV3Icon : BackGrayIcon" />
        </div>
        <div class="navbar-title">
          <!-- vant Tabs -->
          <van-tabs
            v-model:active="activeTabKey"
            @change="handleTabChange"
            :line-width="22"
            title-active-color="currentColor"
            :shrink="true"
          >
            <van-tab v-for="tab in tabs" :key="tab.key" :name="tab.key" :title="tab.title" />
          </van-tabs>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <swiper
      :allowed-slide-next="activeIndex !== 1"
      :allowed-slide-prev=" activeIndex === 1 && !isProgressDragging"
      @swiper="setSwiperRef"
      @active-index-change="onSwiperChange"
      @slider-move="handleSliderMove"
      @transition-end="handleTransitionEnd"
    >
      <swiper-slide>
        <div>
          <!-- 剧场列表 -->
          <div class="content">
            <div class="grid">
              <template v-if="loading">
                <div class="grid-item" v-for="(_, index) in 9" :key="index">
                  <SkeletonCard />
                </div>
              </template>
              <template v-else>
                <div class="grid-item" v-for="(item, index) in list" :key="index">
                  <PreloadDramaId v-if="index < 9" :dramaId="item.dramaId" />
                  <DramaCard
                    :dramaId="item.dramaId"
                    :dramaTitle="item.dramaTitle"
                    :coverUrl="item.coverUrl"
                    :totalEpisodeNumber="item.totalEpisodeNumber"
                    :latestEpisodeNumber="item.latestEpisodeNumber"
                  />
                </div>
              </template>
            </div>
          </div>
          <div v-if="showFoot" class="foot">已展示全部资源</div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="recommend">
          <Recommend
            :isRecommend="true"
            :recData="recData"
            :recLoading="recLoading"
            :isRecommendActive="isRecommendActive"
            :isSliderMoving="isSliderMoving"
            :onProgressDrag="handleProgressDrag"
            :onProgressDragend="handleProgressDragend"
          />
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { Swiper, SwiperSlide } from 'swiper/vue';
import type { Swiper as SwiperType } from 'swiper';
import { Tab as VanTab, Tabs as VanTabs } from 'vant';
import axios from 'axios';
import VePlayer from '@/player';
import { API_PATH } from '@/api';
import DramaCard from './components/drama-card/index.vue';
import SkeletonCard from './components/drama-card/skeleton-card.vue';
import Recommend from './components/recommend/index.vue';
import PreloadDramaId from './components/PreloadDramaId.vue';
import { formatPreloadStreamList, hasScrollbar, parseModel, canSupportPreload } from '../../utils';
import type { IDramaInfo, IVideoDataWithModel } from '../../typings';
import BackV3Icon from '@/assets/svg/back_v3.svg';
import BackGrayIcon from '@/assets/svg/back_gray.svg';

import 'swiper/css';

// 常量定义
const TheaterKey = 'square';
const RecommendKey = 'recommend';

// 标签页数据
const tabs = [
  {
    title: '剧场',
    key: TheaterKey,
  },
  {
    title: '推荐',
    key: RecommendKey,
  },
];

// 路由
const router = useRouter();
const back = () => router.push('/');

// 状态
const dramaData = ref<{ result?: IDramaInfo[] }>({});
const loading = ref(true);
const recData = ref<{ result?: any[] }>({});
const recLoading = ref(true);
const activeIndex = ref(0);
const activeTabKey = ref(TheaterKey);
const isSliderMoving = ref(false);
const isProgressDragging = ref(false);
const showFoot = ref(false);
const swiperRef = ref<SwiperType | null>(null);
const preloadOnceRef = ref(false);

// 计算属性
const list = computed<IDramaInfo[]>(() => dramaData.value?.result || []);
const isRecommendActive = computed(() => activeIndex.value === 1);

// 事件处理
const setSwiperRef = (swiper: SwiperType) => {
  swiperRef.value = swiper;
};

const onSwiperChange = (swiper: SwiperType) => {
  activeIndex.value = swiper.activeIndex;
  activeTabKey.value = tabs[swiper.activeIndex].key;
  if (swiper.activeIndex === 1) {
    window.scrollTo({ left: 0, top: 0 });
  }
};

const handleTabChange = (name: string) => {
  const index = tabs.findIndex(item => item.key === name);
  activeIndex.value = index;
  swiperRef.value?.slideTo(index);
};

const handleSliderMove = () => {
  isSliderMoving.value = true;
};

const handleTransitionEnd = () => {
  isSliderMoving.value = false;
};

const handleProgressDrag = () => {
  isProgressDragging.value = true;
};

const handleProgressDragend = () => {
  isProgressDragging.value = false;
};

// 获取数据
onMounted(async () => {
  // 获取剧集列表
  try {
    loading.value = true;
    const { data } = await axios({
      url: API_PATH.ListDrama,
      method: 'POST',
      data: {
        authorId: __AuthorId__,
        offset: 0,
        pageSize: 50,
      },
    });
    dramaData.value = data;
  } catch (error) {
    console.error('Failed to fetch drama list:', error);
  } finally {
    loading.value = false;
  }

  // 获取推荐列表
  try {
    const { data } = await axios({
      url: API_PATH.GetEpisodeFeedStreamWithVideoModel,
      method: 'POST',
      data: {
        authorId: __AuthorId__,
        needSsl: true,
        offset: 0,
        pageSize: 50,
      },
    });
    recData.value = data;
  } catch (error) {
    console.error('Failed to fetch recommended data:', error);
  } finally {
    recLoading.value = false;
  }
});

// 监听加载状态变化
watch([loading, list], async ([isLoading, dataList]) => {
  await nextTick();
  if (isLoading) {
    showFoot.value = false;
  } else {
    if (dataList.length) {
      showFoot.value = hasScrollbar();
    } else {
      showFoot.value = false;
    }
  }
});

// 处理预加载
watch([recLoading, recData, activeIndex], ([isRecLoading, data, index]) => {
  // PC&Android开启预加载
  if (!isRecLoading && data?.result && canSupportPreload && !preloadOnceRef.value && index === 0) {
    // 预加载前6个视频第一集
    const preloadList: IVideoDataWithModel[] = (data.result || [])
      .map((item: any) => ({
        ...item,
        videoModel: parseModel(item.videoModel),
      }))
      .filter((item: IVideoDataWithModel) => item?.videoModel?.PlayInfoList?.[0]?.MainPlayUrl);

    VePlayer.preloader?.clearPreloadList(); // 切换模式前清空预加载列表
    VePlayer.setPreloadScene(0); // 更新为手动模式
    VePlayer.setPreloadList(formatPreloadStreamList(preloadList.slice(0, 6))); // 设置手动模式待预加载列表
    preloadOnceRef.value = true;
  }
});
</script>

<style scoped lang="less">
.main {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;

  .head {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 999;
    box-sizing: border-box;

    @media screen and (min-width: 500px) {
      & {
        width: var(--pc-max-width);
      }
    }

    .navbar {
      display: flex;
      align-items: center;
      height: 44px;
      padding: 0 8px;

      .navbar-back {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .navbar-title {
        flex: 1;
        display: flex;
        justify-content: center;
      }
    }
  }

  .content {
    padding: 60px 16px;

    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px 16px;

      .grid-item {
        width: 100%;
      }
    }
  }

  .foot {
    color: rgba(22, 24, 35, 0.75);
    text-align: center;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 36px 0 28px;
  }

  .recommend {
    position: fixed;
    top: 0;
    width: 100%;
    height: calc(var(--vh, 1vh) * 100);
  }
}

// 推荐状态
.recommend-active {
  background-color: transparent;
  color: #ffffff;

  .head {
    color: rgba(255, 255, 255, 0.6);

    :deep(.van-tabs__nav) {
      background-color: transparent;
    }

    :deep(.van-tab) {
      color: rgba(255, 255, 255, 0.6);
    }

    :deep(.van-tab--active) {
      color: #fff;
    }

    :deep(.van-tabs__line) {
      background-color: #fff;
    }
  }
}

// 非推荐状态
.recommend-inactive {
  background-color: #fff;
  color: #000000;

  .head {
    background-color: #ffffff;

    :deep(.van-tabs__nav) {
      background-color: transparent;
    }

    :deep(.van-tab) {
      color: rgb(22 24 35 / 60%);
    }

    :deep(.van-tab--active) {
      color: #161823;
    }

    :deep(.van-tabs__line) {
      background-color: #161823;
    }
  }
}
</style>
