<template>
  <div :class="isRecommend ? 'recommend-main' : 'main'">
    <div ref="wrapRef" class="swiper-container">
      <swiper
        class="my-swiper"
        direction="vertical"
        @swiper="swiper => (swiperRef = swiper)"
        @active-index-change="onSlideChange"
      >
        <swiper-slide v-for="(item, i) in videoDataList"
:key="`${item.id}-${i}`">
          <template #default="{ isActive }">
            <SliderItem
              :key="item.id"
              :data="item"
              :index="i"
              :play-next-status="playNextStatus"
              :is-active="isActive"
              :active-index="activeIndex"
              :is-recommend="isRecommend"
              :get-current-time="getCurrentTime"
            />
          </template>
        </swiper-slide>
      </swiper>
    </div>
    <div v-if="showUnmuteBtn"
class="unmute" @click="onUnmuteClick">
      <div class="unmute-btn">
        <UnmuteIcon class="unmute-icon" />
        <span>点击取消静音</span>
      </div>
    </div>
    <div v-if="!isRecommend"
class="foot" @click="setSelectVisible(true)">
      <div class="foot-content">
        <SelectIcon class="select-icon" />
        <!-- <div v-html="SelectIcon" class="select-icon"></div> -->
        <div class="select-text">
          {{ videoDataList?.length ? `选集（${videoDataList?.length}集）` : '' }}
        </div>
        <UpArrowIcon class="select-arrow" />
      </div>
    </div>
  </div>
  <van-popup
    v-model:show="selectVisible"
    position="bottom"
    round
    :style="{
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
      minHeight: '40vh',
    }"
  >
    <div class="select-popup">
      <div class="select-head">
        <div class="select-title">
          {{ dramaTitle }}
        </div>
        <div class="select-des">
          {{ `全${totalEpisodes}集 | 29.3w` }}
        </div>
        <div class="close-btn">
          <CloseIcon @click="setSelectVisible(false)" />
        </div>
      </div>
      <div class="select-content">
        <SelectBtn
          v-for="(_, index) in videoDataList"
          :key="index"
          :is-active="index === activeIndex"
          :index="index"
          @click="onSelectClick"
        />
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */
import { ref, watch, onMounted, onBeforeUnmount, computed, nextTick } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import type { Swiper as SwiperType } from 'swiper';
import { showToast } from 'vant';
import { Popup as VanPopup } from 'vant';
import SelectBtn from './SelectBtn.vue';
import SliderItem from './SliderItem.vue';
import VePlayer from '@/player';
import { Events, type PlayerCore } from '@volcengine/veplayer';
import type { IVideoDataWithModel, IDramaInfo } from '@/typings';
import { formatPreloadList } from '@/utils/preload';
import { os, selectDef } from '@/utils';
import '@volcengine/veplayer/index.min.css';
import 'swiper/css';

// SVG图标导入
import UnmuteIcon from '@/assets/svg/unmute.svg';
import SelectIcon from '@/assets/svg/select.svg';
import UpArrowIcon from '@/assets/svg/ic_arrow_packup.svg';
import CloseIcon from '@/assets/svg/close.svg';

const props = defineProps({
  videoDataList: {
    type: Array as () => IVideoDataWithModel[],
    default: () => [],
  },
  isRecommend: {
    type: Boolean,
    default: false,
  },
  isRecommendActive: {
    type: Boolean,
    default: false,
  },
  isSliderMoving: {
    type: Boolean,
    default: false,
  },
  startTime: {
    type: Number,
    default: 0,
  },
  onChange: {
    type: Function,
    default: () => {},
  },
  onProgressDrag: {
    type: Function,
    default: () => {},
  },
  onProgressDragend: {
    type: Function,
    default: () => {},
  },
});

const emit = defineEmits(['change']);

// 组件状态
const swiperRef = ref<SwiperType | null>(null);
const wrapRef = ref<HTMLElement | null>(null);
const sdkRef = ref<any>(null);
const activeIndex = ref<number>(0);
const swiperActiveRef = ref<number>(0);
const playNextStatus = ref<string>('');
const showUnmuteBtn = ref<boolean>(false);
const selectVisible = ref<boolean>(false);

// 计算属性
const currentVideoData = computed<IVideoDataWithModel | undefined>(() => props.videoDataList?.[activeIndex.value]);
const dramaInfo = computed(() => {
  return currentVideoData.value?.episodeDetail?.dramaInfo || ({} as IDramaInfo);
});
const dramaTitle = computed(() => dramaInfo.value.dramaTitle || '');
const totalEpisodes = computed(() => dramaInfo.value.totalEpisodeNumber || 0);

/**
 * 阻止默认行为
 */
const preventDefault = (e: TouchEvent) => e?.preventDefault?.();

/**
 * 获取播放器开始按钮的DOM元素
 */
const getClass = (player: PlayerCore): HTMLDivElement | null =>
  (player.root?.getElementsByClassName('xgplayer-start')[0] as HTMLDivElement) || null;

/**
 * 展示静音按钮
 */
const showUnmute = () => {
  if (sdkRef.value?.player) {
    const player = sdkRef.value.player;
    showUnmuteBtn.value = player.muted || player.media?.muted;
  }
};

/**
 * 点击取消静音
 */
const onUnmuteClick = () => {
  if (sdkRef.value?.player) {
    const player = sdkRef.value.player;
    player.muted = false;
    player.play();
    showUnmuteBtn.value = false;
  }
};

/**
 * 隐藏开始图标
 */
const hideStartIcon = (player?: PlayerCore) => {
  if (!player?.root) return;
  const startClassDom = getClass(player);
  if (startClassDom) {
    startClassDom.className = startClassDom.className
      .split(' ')
      .filter(item => item !== 'veplayer-h5-hide-start')
      .join(' ');
  }
};

/**
 * 添加开始图标
 */
const attachStartIcon = (player: PlayerCore) => {
  if (!player?.root) return;
  const startClassDom = getClass(player);
  if (startClassDom) {
    startClassDom.className = `${startClassDom.className} veplayer-h5-hide-start`;
  }
};

/**
 * 播放器下一个视频
 */
const playNext = (index: number) => {
  if (index < 0 || index >= props.videoDataList.length) return;

  if (sdkRef.value && index !== swiperActiveRef.value) {
    swiperActiveRef.value = index;
    playNextStatus.value = 'start';

    const next = props.videoDataList?.[index];
    const nextInfoList = formatPreloadList([next]);
    const nextInfo = nextInfoList[0];

    if (!nextInfo?.url) {
      showToast({
        type: 'fail',
        message: '数据异常',
      });
      return;
    }

    const poster = next?.videoModel?.PosterUrl ?? next.coverUrl;
    swiperRef.value?.slideTo(index, 0);
    setActiveIndex(index);

    sdkRef.value?.player?.pause();
    sdkRef.value?.getPlugin('poster')?.update(poster);
    attachStartIcon(sdkRef.value?.player);

    sdkRef.value?.playNext({
        autoplay: true,
        vid: nextInfo.vid,
        playList: [nextInfo],
      })
      .then(() => sdkRef.value?.player.play())
      .then(() => {
        setTimeout(() => hideStartIcon(sdkRef.value?.player), 0);
        playNextStatus.value = 'end';
      }).catch((error: Error) => {
        console.log(error);
      });
  }
};

/**
 * Swiper滑动变化处理
 */
const onSlideChange = (swiper: SwiperType) => {
  if (swiper.realIndex !== swiperActiveRef.value) {
    playNext(swiper.realIndex);
  }
};

/**
 * 视频播放结束处理
 */
const onEnded = () => {
  if (swiperRef.value?.activeIndex === props.videoDataList.length - 1) {
    showToast({
      message: '看完了！',
    });
  } else {
    swiperRef.value?.slideNext();
  }
};

/**
 * 初始化播放器
 */
const initPlayer = () => {
  if (!sdkRef.value && currentVideoData.value) {
    const playInfoList = currentVideoData.value?.videoModel?.PlayInfoList || [];
    const poster = currentVideoData.value?.videoModel?.PosterUrl ?? currentVideoData.value.coverUrl;

    const def = selectDef(playInfoList, '720p');
    if (!def?.MainPlayUrl) return;
    const options: any = {
      id: `swiper-video-container-${activeIndex.value}`,
      playList: [
        {
          url: def.MainPlayUrl,
          definition: def.Definition,
          codecType: def.Codec,
          bitrate: def.Bitrate,
          vtype: 'MP4',
        },
      ],
      vid: currentVideoData.value.vid,
      startTime: props.startTime,
      autoplay: !props.isRecommend,
      enableDegradeMuteAutoplay: true,
      closeVideoClick: false,
      closeVideoDblclick: true,
      videoFillMode: 'fillWidth',
      codec: def.Codec,
      enableMp4MSE: true,
      ignores: [
        'moreButtonPlugin',
        'enter',
        'fullscreen',
        'volume',
        'play',
        'time',
        'pip',
        'replay',
        'playbackrate',
        'sdkDefinitionPlugin',
      ],
      commonStyle: {
        // 播放完成部分进度条底色
        playedColor: '#ffffff',
      },
      controls: {
        mode: 'bottom',
      },
      mobile: {
        gradient: 'none',
        darkness: false,
        disableGesture: props.isRecommend,
        isTouchingSeek: false,
        gestureY: false,
      },
      adaptRange: {
        enable: true,
        minCacheDuration: 15,
        maxCacheDuration: 40,
      },
      progress: {
        onMoveStart: () => {
          sdkRef.value?.player?.plugins?.progress.focus();
        },
        onMoveEnd: () => {
          sdkRef.value?.player?.plugins?.progress.blur();
        },
      },
      sdkErrorPlugin: {
        isNeedRefreshButton: false,
      },
      start: {
        disableAnimate: true,
        isShowPause: true,
      },
      poster: {
        poster,
        hideCanplay: true,
        fillMode: 'fixWidth',
      },
      vodLogOpts: {
        vtype: 'MP4',
        tag: 'normal',
        codec_type: def.Codec,
        line_app_id: 597335, // 从视频点播控制台-点播SDK-应用管理 获取，如果没有应用则创建
      },
    };

    const playerSdk = new VePlayer(options);
    // @ts-ignore
    window.playerSdk = playerSdk;

    playerSdk.once(Events.COMPLETE, () => {
      const player = playerSdk.player;
      if (props.isRecommend) {
        // 通过插件实例调用
        player.getPlugin('progress').useHooks('dragstart', () => {
          /**
           * 如果返回false，则不执行默认逻辑
           * 如果返回true，则执行默认行为seek操作
           * */
          props.onProgressDrag();
          return true;
        });
        player.getPlugin('progress').useHooks('drag', () => {
          props.onProgressDrag();
          return true;
        });
        player.getPlugin('progress').useHooks('dragend', () => {
          props.onProgressDragend();
          return true;
        });
      } else {
        // 通过插件实例调用
        player.root?.addEventListener('touchmove', preventDefault);
      }
    });

    playerSdk.once(Events.PLAY, showUnmute);
    playerSdk.once(Events.AUTOPLAY_PREVENTED, showUnmute);
    playerSdk.on(Events.ENDED, onEnded);

    sdkRef.value = playerSdk;
  }
};

/**
 * 设置当前活动的索引
 */
const setActiveIndex = (index: number) => {
  activeIndex.value = index;
  props.onChange(index);
};

/**
 * 设置选集弹窗可见性
 */
const setSelectVisible = (visible: boolean) => {
  selectVisible.value = visible;
};

/**
 * 选集点击处理
 */
const onSelectClick = (index: number) => {
  playNext(index);
  setSelectVisible(false);
};

/**
 * 获取当前播放时间
 */
const getCurrentTime = () => {
  return sdkRef?.value?.player?.currentTime || 0;
};

// 组件挂载时初始化
onMounted(() => {
  setTimeout(() => {
    initPlayer();
  });

  // 预加载只支持PC、Android
  if (!(os.isPc || os.isAndroid)) {
    return;
  }

  // 预加载开启场景：推荐页且处于激活状态； 进入短剧详情页
  if ((props.isRecommend && props.isRecommendActive) || !props.isRecommend) {
    VePlayer.setPreloadScene(1, {
      prevCount: 1,
      nextCount: 2,
    });
    console.log('开启了预加载');
    // 待预加载列表设置
    VePlayer.setPreloadList(formatPreloadList(props.videoDataList) as any);
  }
});

// 监听activeIndex变化
watch(
  () => activeIndex.value,
  async newIndex => {
    props.onChange(newIndex);

    if (!sdkRef.value) return;
    await nextTick();
    const playerDom = sdkRef.value?.playerContainer;
    const insertParentNode = document.getElementById(`swiper-video-container-${newIndex}`);
    console.log('watch', newIndex, playerDom, insertParentNode);
    if (insertParentNode && playerDom) {
      insertParentNode.appendChild(playerDom);
    }
  },
);

// 监听是否推荐页且处于激活状态
watch(
  [() => props.isRecommend, () => props.isRecommendActive, () => props.isSliderMoving],
  ([isRecommend, isRecommendActive, isSliderMoving]) => {
    if (!sdkRef.value?.player) return;

    if (isRecommend) {
      if (isRecommendActive) {
        if (isSliderMoving) {
          sdkRef.value?.player?.pause();
        } else {
          sdkRef.value?.player?.play();
        }
      } else {
        sdkRef.value?.player?.pause();
      }
    }
  },
);

// 组件卸载时销毁播放器
onBeforeUnmount(() => {
  if (sdkRef.value) {
    sdkRef.value.destroy();
    sdkRef.value?.player?.root?.removeEventListener('touchmove', preventDefault);
  }
});

// 对外提供Swiper实例和方法
defineExpose({
  swiper: swiperRef,
  slideTo: (index: number, speed?: number, runCallbacks?: boolean) => {
    swiperRef.value?.slideTo(index, speed, runCallbacks);
  },
  player: sdkRef,
});
</script>

<style scoped lang="less">
.main {
  position: relative;
  width: 100%;
  height: 100%;

  .swiper-container {
    height: calc(var(--vh, 1vh) * 100 - 60px - constant(safe-area-inset-bottom));
    height: calc(var(--vh, 1vh) * 100 - 60px - env(safe-area-inset-bottom));
  }
}

.recommend-main {
  position: relative;
  width: 100%;
  height: 100%;

  .swiper-container {
    height: calc(var(--vh, 1vh) * 100 - 10px - constant(safe-area-inset-bottom));
    height: calc(var(--vh, 1vh) * 100 - 10px - env(safe-area-inset-bottom));
  }
}

.swiper-container {
  position: relative;
  z-index: 4;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .my-swiper {
    width: 100%;
    height: 100%;
  }

  :deep(.xgplayer-unmute) {
    display: none !important;
  }

  :deep(.xgplayer) {
    background-color: transparent;

    .xg-pos {
      left: calc(18px + constant(safe-area-inset-left));
      left: calc(18px + env(safe-area-inset-left));
      right: calc(18px + constant(safe-area-inset-right));
      right: calc(18px + env(safe-area-inset-right));
    }
  }

  :deep(.xgplayer .xgplayer-poster) {
    background-size: 100% auto;
    background-color: transparent !important;
  }

  :deep(.xgplayer .xgplayer-start) {
    transform: translate3d(0, 0, 0);
    translate: -50% -50%;
  }

  :deep(.xgplayer .xgplayer-controls) {
    transform: translate3d(0, 0, 0);
  }

  :deep(.xgplayer-mobile .xgplayer-progress .xgplayer-progress-btn) {
    background-color: rgba(255, 255, 255, 0) !important;
    box-shadow: none;
  }

  :deep(.swiper-slide) {
    overflow: hidden;
  }

  :deep(.xgplayer.xgplayer-mobile .xgplayer-progress-bottom) {
    &.active {
      .xgplayer-progress-outer {
        height: 6px;
        margin-bottom: 3px;
        transition:
          height 0.3s ease,
          margin-bottom 0.3s ease;
      }
      .xgplayer-progress-btn {
        transform: translate(-50%, -50%) scale(1);
      }
      .inner-focus-point {
        &:before,
        &:after {
          width: 6px;
        }
      }
    }
  }
}

.unmute {
  position: absolute;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  pointer-events: none;

  .unmute-btn {
    box-sizing: border-box;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 140px;
    height: 48px;
    padding: 13.5px 10px;
    pointer-events: visible;
    background: rgb(58 58 58 / 50%);
    backdrop-filter: blur(5px);
    border-radius: 25px;

    .unmute-icon {
      width: 20px;
      height: 20px;
      margin-right: 2px;
    }

    span {
      font-size: 15px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      color: #fff;
      text-align: center;
    }
  }
}

.foot {
  position: relative;
  width: 100%;
  margin-top: 10px;
  z-index: 100;

  .foot-content {
    display: flex;
    align-items: center;
    height: 40px;
    background: rgb(255 255 255 / 15%);
    border-radius: 8px;
    box-shadow: 0 4px 18px 0 rgb(0 0 0 / 15%);
    padding: 0 16px;
    position: absolute;
    top: 0;
    left: 12px;
    right: 12px;
    bottom: 0;
  }

  .select-text {
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    color: rgb(255 255 255 / 90%);
  }

  .select-icon {
    width: 14px;
    height: 14px;
    margin-right: 8px;
  }

  .select-arrow {
    position: absolute;
    right: 12px;
    width: 16px;
    height: 16px;
  }
}

.select-popup {
  padding: 16px;

  .select-head {
    padding-bottom: 16px;
    border-bottom: 1px solid #f1f1f2;
    position: relative;

    .select-title {
      margin-bottom: 8px;
      font-size: 17px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      color: #161823;
    }

    .select-des {
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: 18px;
      color: rgb(22 24 35 / 50%);
    }

    .close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background-color: rgb(22 24 35 / 5%);
      border-radius: 28px;
      cursor: pointer;

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }

  .select-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, 46px);
    gap: 12px 12px;
    max-height: 360px;
    overflow-y: scroll;
    padding: 12px 0;
  }
}

.loading-mask {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  background-color: #000;
}
</style>
