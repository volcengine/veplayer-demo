<template>
  <div class="main">
    <img class="bg" :src="bgImg" alt="bg" />
    <div class="content">
      <div class="title">
        <div class="title_main">视频点播</div>
        <div class="title_sub">体验一站式视频解决方案</div>
      </div>
      <SceneCard
        v-for="item in featureList"
        :key="item.key"
        :icon="item.icon"
        :name="item.name"
        :jump="item.jump"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */
import { onMounted } from 'vue';
import { API_PATH } from '@/api';
import { featureList } from '@/router';
import request from '@/utils/request';
import { useMainStore } from '@/stores';
import SceneCard from './scene_card/index.vue';
import bgImg from '@/assets/img/bg.png';


// 获取存储
const store = useMainStore();

// 获取数据
onMounted(async () => {
  try {
    store.setLoading(true);
    
    // 获取短剧列表
    console.log('Sending ListDrama request...');
    const dramaResult:any = await request.post(API_PATH.ListDrama, {
      authorId: __AuthorId__,
      offset: 0,
      pageSize: 50,
    });
    
    console.log('ListDrama response:', dramaResult);
    if (dramaResult && dramaResult.result) {
      console.log('Drama list data structure:', dramaResult.result);
      store.setDramaList(dramaResult.result || []);
    } else {
      console.error('Invalid drama result structure:', dramaResult);
    }

    // 获取视频流
    const episodeResult:any = await request.post(API_PATH.GetEpisodeFeedStreamWithVideoModel, {
      authorId: __AuthorId__,
      needSsl: true,
      offset: 0,
      pageSize: 50,
    });
    
    console.log('Episode response:', episodeResult);
    if (episodeResult && episodeResult.result) {
      console.log('Feed list data structure:', episodeResult.result);
      store.setEpisodeList(episodeResult.result || []);
    } else {
      console.error('Invalid episode result structure:', episodeResult);
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
  } finally {
    store.setLoading(false);
  }
});
</script>
<style scoped lang="less">
@import './index.module.less';
</style>
<style scoped lang="less">

.main {
  position: relative;
  width: 100%;

  .bg {
    width: 100%;
    height: 100%;
  }

  .fbg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .content {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;

    .title {
      box-sizing: border-box;
      width: 100%;
      padding-right: 20px;
      padding-left: 20px;
      margin-top: 100px;
      margin-bottom: 68px;

      .title_main {
        font-size: 24px;
        font-style: normal;
        font-weight: 600;
        line-height: 24px;
        color: #111214;
      }

      .title_sub {
        margin-top: 10px;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        color: #3e3f43;
      }
    }
  }
}
</style> 