<template>
  <div ref="playerContainerRef" class="player-container">
    <div ref="playerRef" class="player-wrapper" />
    <div v-if="!autoPlay && !isPlaying" class="controls">
      <div class="play-button" @click="startPlay">
        <PlayIcon />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import VePlayer from '@/player';
import { parseModel } from '@/utils';
import type { IVideoModel } from '@/typings';
import PlayIcon from '@/assets/svg/play.svg';

// 定义Props
const props = defineProps({
  vid: {
    type: String,
    default: '',
  },
  videoModel: {
    type: [String, Object],
    default: '',
  },
  playAuthToken: {
    type: String,
    default: '',
  },
  coverUrl: {
    type: String,
    default: '',
  },
  autoPlay: {
    type: Boolean,
    default: false,
  },
  loop: {
    type: Boolean,
    default: false,
  },
});

// 定义事件
const emit = defineEmits(['play', 'pause', 'ended', 'error', 'timeupdate']);

// 状态
const isPlaying = ref(false);
const playerRef = ref<HTMLElement | null>(null);
const playerContainerRef = ref<HTMLElement | null>(null);
const playerInstance = ref<any>(null);

// 播放器初始化
const initPlayer = () => {
  if (!playerRef.value) return;

  // 解析视频模型
  const model = typeof props.videoModel === 'string' ? parseModel(props.videoModel) : props.videoModel;

  // 创建播放器实例
  playerInstance.value = new VePlayer({
    root: playerRef.value,
    width: '100%',
    height: '100%',
    autoplay: props.autoPlay,
    loop: props.loop,
    muted: false,
    poster: props.coverUrl,
    controls: true,
    playsinline: true,
    preload: 'auto',
    vid: props.vid,
    videoModel: model as IVideoModel,
    resolution: '720p',
    AutoplayPlugin: {
      showUnmuteBtn: false,
    },
  });

  // 监听事件
  playerInstance.value.on('play', () => {
    isPlaying.value = true;
    emit('play');
  });

  playerInstance.value.on('pause', () => {
    isPlaying.value = false;
    emit('pause');
  });

  playerInstance.value.on('ended', () => {
    isPlaying.value = false;
    emit('ended');
  });

  playerInstance.value.on('error', (err: any) => {
    console.error('播放器错误:', err);
    emit('error', err);
  });

  playerInstance.value.on('timeupdate', (time: number) => {
    emit('timeupdate', time);
  });

  // 自动播放
  if (props.autoPlay) {
    startPlay();
  }
};

// 开始播放
const startPlay = () => {
  if (playerInstance.value) {
    playerInstance.value.play();
  }
};

// 暂停播放
const pausePlay = () => {
  console.log('pausePalyer');
  if (playerInstance.value) {
    playerInstance.value.pause();
  }
};

// 重置播放器
const resetPlayer = () => {
  if (playerInstance.value) {
    playerInstance.value.destroy();
    playerInstance.value = null;
  }
};

// 对外暴露方法
defineExpose({
  player: playerInstance,
  play: startPlay,
  pause: pausePlay,
  reset: resetPlayer,
});

// 监听props变化
watch(
  () => [props.vid, props.videoModel],
  () => {
    resetPlayer();
    initPlayer();
  },
);

// 组件挂载后初始化播放器
onMounted(() => {
  initPlayer();
});

// 组件销毁前清理资源
onBeforeUnmount(() => {
  resetPlayer();
});
</script>

<style scoped lang="less">
.player-container {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #000;
  overflow: hidden;

  .player-wrapper {
    width: 100%;
    height: 100%;
  }

  .controls {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .play-button {
      width: 60px;
      height: 60px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      svg {
        width: 30px;
        height: 30px;
        color: white;
      }
    }
  }
}
</style>
