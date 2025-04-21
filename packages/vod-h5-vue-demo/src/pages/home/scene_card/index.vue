<template>
  <div :class="$style.card">
    <div :class="$style.content" @click="handleClick">
      <div :class="$style.info">
        <component :is="iconComponent" :class="$style.icon" />
        <div :class="$style.title">
          {{ name }}
        </div>
      </div>
      <div :class="$style.jump">
        <component :is="ArrowSvg" :class="$style.jump" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */
import { useRouter } from 'vue-router';
import { computed } from 'vue';
// 使用vite-svg-loader导入SVG作为Vue组件
import ArrowSvg from '@/assets/svg/arrow.svg';
import PlayletSvg from '@/assets/svg/playlet.svg';
// 可以根据需要添加更多SVG导入

const router = useRouter();

// 定义props
const props = defineProps<{
  icon: string;
  name: string;
  jump: string;
}>();

// 根据icon名称决定使用哪个SVG组件
const iconComponent = computed(() => {
  // 根据icon字符串返回对应的组件
  const iconMap: Record<string, any> = {
    playlet: PlayletSvg,
    // 可以添加更多图标映射
  };

  return iconMap[props.icon] || PlayletSvg; // 默认使用PlayletSvg
});

// 点击处理
const handleClick = () => {
  router.push(props.jump);
};
</script>

<style module lang="less">
@import './index.module.less';
</style>
