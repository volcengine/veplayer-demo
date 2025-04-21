<template>
  <!-- 这是一个无渲染组件，仅用于预加载数据 -->
</template>

<script setup lang="ts">
/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */
import { onMounted } from 'vue';
import axios from 'axios';
import { API_PATH } from '@/api';

// 定义props
const props = defineProps<{
  dramaId: string;
}>();

// 组件挂载后触发预加载
onMounted(() => {
  axios({
    url: API_PATH.GetDramaEpisodeWithVideoModel,
    method: 'POST',
    data: {
      authorId: __AuthorId__,
      needSsl: true,
      dramaId: props.dramaId,
      offset: 0,
      pageSize: 50,
    },
    params: {
      useCache: true,
    }
  });
});
</script> 