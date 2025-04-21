<template>
  <div class="card">
    <div class="content">
      <div class="main skeleton-box"></div>
      <div class="foot-skelet">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */
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
    }

    .foot-skelet {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 48px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
}

.skeleton-box {
  background: linear-gradient(
    90deg,
    rgba(190, 190, 190, 0.2) 25%,
    rgba(129, 129, 129, 0.24) 37%,
    rgba(190, 190, 190, 0.2) 63%
  );
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;
}

.skeleton-line {
  height: 16px;
  border-radius: 8px;
  width: 100%;
  background: linear-gradient(
    90deg,
    rgba(190, 190, 190, 0.2) 25%,
    rgba(129, 129, 129, 0.24) 37%,
    rgba(190, 190, 190, 0.2) 63%
  );
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;
}

.skeleton-line.short {
  width: 60%;
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style> 