<template>
  <div class="btn" :class="{ active: isActive }" @click="handleClick">
    {{ index + 1 }}
    <div v-if="isActive" class="icon" />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['click']);
/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */
const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },
  index: {
    type: Number,
    required: true,
  },
});

const handleClick = () => {
  emit('click', props.index);
};
</script>

<style scoped lang="less">
.btn {
  position: relative;
  align-items: center;
  width: 48px;
  height: 48px;
  box-sizing: border-box;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 48px;
  color: #000;
  text-align: center;
  cursor: pointer;
  background: #f5f5f5;
  border: 1.5px solid transparent;
  border-radius: 8px;

  &.active {
    color: #1664ff;
    border: 1.5px solid #1664ff;
  }
}

.icon {
  position: absolute;
  right: 3px;
  bottom: 26px;
  width: 11px;
  height: 11px;
  // background-image: url('@/assets/lottie/flow.gif');
  background-size: cover;
}
</style>
