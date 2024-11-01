/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { SwiperClass } from 'swiper/react';
import { Popup, Toast } from 'antd-mobile';
import VePlayer, { Events, PlayerCore } from '@/player';
import SliderItem from '../slider-item';
import SelectBtn from '../select-btn';
import SelectIcon from '@/assets/svg/select.svg?react';
import UpArrowIcon from '@/assets/svg/ic_arrow_packup.svg?react';
import CloseIcon from '@/assets/svg/close.svg?react';
import UnmuteIcon from '@/assets/svg/unmute.svg?react';
import { selectDef, formatPreloadStreamList, os } from '@/utils';
import type { IPlayerConfig } from '@/player';
import type { IVideoDataWithModel } from '@/typings';

import 'swiper/less';
import style from './index.module.less';
import '@volcengine/veplayer/index.min.css';

interface IVideoSwiperProps {
  videoDataList: IVideoDataWithModel[];
  isRecommend?: boolean;
  isRecommendActive?: boolean;
  isSliderMoving?: boolean;
  startTime?: number;
  onChange: (v: number) => any;
  onProgressDrag?: () => void;
  onProgressDragend?: () => void;
}

const preventDefault = (e: TouchEvent) => e?.preventDefault?.();

const getClass: (player: PlayerCore) => HTMLDivElement = (player: PlayerCore) =>
  player.root?.getElementsByClassName('xgplayer-start')[0];

const VideoSwiper: React.FC<IVideoSwiperProps> = ({
  videoDataList,
  isRecommend,
  isRecommendActive,
  isSliderMoving,
  startTime = 0,
  onChange,
  onProgressDrag,
  onProgressDragend,
}) => {
  const swiperRef = useRef<SwiperClass>();
  const wrapRef = useRef<HTMLElement>();
  const sdkRef = useRef<VePlayer>();

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const swiperActiveRef = useRef<number>(0);
  const [playNextStatus, setPlayNextStatus] = useState<string>('');
  const [showUnmuteBtn, setShowUnmuteBtn] = useState<boolean>(false);
  const [selectVisible, setSelectVisible] = useState<boolean>(false);

  const currentVideoData: IVideoDataWithModel = videoDataList?.[activeIndex];

  const dramaInfo = currentVideoData?.episodeDetail?.dramaInfo;
  const { dramaTitle, totalEpisodeNumber } = dramaInfo || {};

  /**
   * 展示静音按钮
   */
  const showUnmute = useCallback(() => {
    if (sdkRef.current?.player) {
      const player = sdkRef.current?.player;
      setShowUnmuteBtn(player.muted || player.media?.muted);
    }
  }, []);

  const onUnmuteClick = useCallback(() => {
    if (sdkRef.current?.player) {
      const player = sdkRef.current?.player;
      player.muted = false;
      player.play();
      setShowUnmuteBtn(false);
    }
  }, []);

  const hideStartIcon = useCallback((player?: PlayerCore) => {
    if (!player?.root) {
      return;
    }
    const startClassDom = getClass(player);
    if (startClassDom) {
      startClassDom.className = startClassDom.className
        ?.split(' ')
        .filter(item => item !== 'veplayer-h5-hide-start')
        .join(' ');
    }
  }, []);

  const attachStartIcon = useCallback((player: PlayerCore) => {
    if (!player?.root) {
      return;
    }
    const startClassDom = getClass(player);
    if (startClassDom) {
      startClassDom.className = `${startClassDom.className} veplayer-h5-hide-start`;
    }
  }, []);

  /**
   * 播放器下一个视频
   * @param {number} index - 当前swiper的index
   */
  const playNext = useCallback(
    (index: number) => {
      if (index < 0 || index >= videoDataList.length) {
        return;
      }
      if (sdkRef.current && index !== swiperActiveRef.current) {
        swiperActiveRef.current = index;
        setPlayNextStatus('start');
        const next = videoDataList?.[index];
        const nextInfo = formatPreloadStreamList([videoDataList?.[index]])[0];
        if (!nextInfo?.url) {
          Toast.show({
            icon: 'fail',
            content: '数据异常',
          });
          return;
        }
        const poster = next?.videoModel?.PosterUrl ?? next.coverUrl;
        swiperRef.current?.slideTo(index, 0);
        setActiveIndex(index);
        sdkRef.current?.player?.pause();
        sdkRef.current?.getPlugin('poster')?.update(poster);
        attachStartIcon(sdkRef.current?.player);
        sdkRef.current
          ?.playNext({
            autoplay: true,
            vid: nextInfo.vid,
            playList: [nextInfo],
          })
          .then(() => sdkRef.current?.player.play())
          .then(() => {
            setTimeout(() => hideStartIcon(sdkRef.current?.player), 0);
            setPlayNextStatus('end');
          });
      }
    },
    [attachStartIcon, hideStartIcon, videoDataList],
  );

  const onSlideChange = useCallback(
    (swiper: SwiperClass) => {
      if (swiper.realIndex !== swiperActiveRef.current) {
        playNext(swiper.realIndex);
      }
    },
    [playNext],
  );

  const onEnded = useCallback(() => {
    if (swiperRef.current?.activeIndex === videoDataList.length - 1) {
      Toast.show({
        content: '看完了！',
      });
    } else {
      swiperRef.current?.slideNext();
    }
  }, [videoDataList.length]);

  const initPlayer = useCallback(() => {
    if (!sdkRef.current && currentVideoData) {
      const playInfoList = currentVideoData?.videoModel?.PlayInfoList || [];
      const poster = currentVideoData?.videoModel?.PosterUrl ?? currentVideoData.coverUrl;
      const def = selectDef(playInfoList, '720p');
      if (!def?.MainPlayUrl) {
        return;
      }
      const options = {
        id: 'veplayer-container',
        playList: [
          {
            url: def.MainPlayUrl,
            definition: def.Definition,
            codecType: def.Codec,
            bitrate: def.Bitrate,
            vtype: 'MP4',
          },
        ],
        vid: currentVideoData.vid,
        startTime,
        autoplay: !isRecommend,
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
          disableGesture: isRecommend,
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
            sdkRef.current?.player?.plugins?.progress.focus();
          },
          onMoveEnd: () => {
            sdkRef.current?.player?.plugins?.progress.blur();
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

      const playerSdk = new VePlayer(options as IPlayerConfig);
      window.playerSdk = playerSdk;
      playerSdk.once(Events.COMPLETE, () => {
        const player = playerSdk.player;
        if (isRecommend) {
          // 通过插件实例调用
          player.getPlugin('progress').useHooks('dragstart', () => {
            /**
             * 如果返回false，则不执行默认逻辑
             * 如果返回true，则执行默认行为seek操作
             * */
            onProgressDrag && onProgressDrag();
            return true;
          });
          player.getPlugin('progress').useHooks('drag', () => {
            onProgressDrag && onProgressDrag();
            return true;
          });
          player.getPlugin('progress').useHooks('dragend', () => {
            onProgressDragend && onProgressDragend();
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

      sdkRef.current = playerSdk;
    }
  }, [currentVideoData, isRecommend, onEnded, onProgressDrag, onProgressDragend, showUnmute, startTime]);

  // 组件加载时初始化播放器
  useEffect(() => {
    setTimeout(() => {
      initPlayer();
    });
  }, [currentVideoData, activeIndex, initPlayer]);

  useEffect(() => {
    // 预加载只支持PC、Android
    if (!(os.isPc || os.isAndroid)) {
      return;
    }
    // 预加载开启场景：推荐页且处于激活状态； 进入短剧详情页
    if ((isRecommend && isRecommendActive) || !isRecommend) {
      VePlayer.setPreloadScene(1, {
        prevCount: 1,
        nextCount: 2,
      });

      // 待预加载列表设置
      VePlayer.setPreloadList(formatPreloadStreamList(videoDataList));
    }
  }, [isRecommend, isRecommendActive, videoDataList]);

  // 组件卸载时销毁播放器
  useEffect(() => {
    return () => {
      if (sdkRef.current) {
        sdkRef.current.destroy();
        sdkRef.current?.player?.root?.removeEventListener('touchmove', preventDefault);
      }
    };
  }, []);

  useEffect(() => {
    if (!sdkRef.current) {
      return;
    }
    onChange(activeIndex);
    const playerDom = sdkRef.current?.playerContainer;
    const insertParentNode = document.getElementById(`swiper-video-container-${activeIndex}`);
    if (insertParentNode && playerDom) {
      insertParentNode?.insertBefore(playerDom, null);
    }
  }, [activeIndex, onChange]);

  useEffect(() => {
    if (isRecommend) {
      if (isRecommendActive) {
        if (isSliderMoving) {
          sdkRef.current?.player?.pause();
        } else {
          sdkRef.current?.player?.play();
        }
      } else {
        sdkRef.current?.player?.pause();
      }
    }
  }, [isRecommend, isRecommendActive, isSliderMoving]);

  const onSelectClick = useCallback(
    (index: number) => {
      playNext(index);
    },
    [playNext],
  );

  const getCurrentTime = useCallback(() => {
    return sdkRef?.current?.player?.currentTime || 0;
  }, []);

  return (
    <>
      <div className={isRecommend ? style.recommendMain : style.main}>
        <div className={style.swiperContainer} ref={wrapRef as React.MutableRefObject<HTMLDivElement>}>
          {videoDataList?.length > 0 && (
            <Swiper
              className={style.mySwiper}
              direction="vertical"
              onSwiper={swiper => (swiperRef.current = swiper)}
              onActiveIndexChange={onSlideChange}
            >
              {videoDataList.map((item: any, i: number) => {
                return (
                  <SwiperSlide key={`${item.id}-${i}`}>
                    {({ isActive }) => (
                      <SliderItem
                        key={item.id}
                        data={item}
                        index={i}
                        playNextStatus={playNextStatus}
                        isActive={isActive}
                        activeIndex={activeIndex}
                        isRecommend={isRecommend}
                        getCurrentTime={getCurrentTime}
                      >
                        {activeIndex === 0 && <div id="veplayer-container" className="veplayer-container"></div>}
                      </SliderItem>
                    )}
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </div>
        {showUnmuteBtn && (
          <div className={style.unmute} onClick={onUnmuteClick}>
            <div className={style.unmuteBtn}>
              <UnmuteIcon className={style.unmuteIcon} />
              <span>点击取消静音</span>
            </div>
          </div>
        )}
        {!isRecommend && (
          <div className={style.foot} onClick={() => setSelectVisible(!selectVisible)}>
            <div className={style.footContent}>
              <SelectIcon className={style.selectIcon} />
              <div className={style.selectText}>
                {videoDataList?.length ? `选集（${videoDataList?.length}集）` : ''}
              </div>
              <UpArrowIcon className={style.selectArrow} />
            </div>
          </div>
        )}
      </div>
      <Popup
        visible={selectVisible}
        onMaskClick={() => {
          setSelectVisible(false);
        }}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          minHeight: '40vh',
        }}
      >
        <div className={style.selectPopup}>
          <div className={style.selectHead}>
            <div className={style.selectTitle}>{dramaTitle}</div>
            <div className={style.selectDes}>{`全${totalEpisodeNumber}集 | 29.3w`}</div>
            <div className={style.closeBtn}>
              <CloseIcon onClick={() => setSelectVisible(false)} />
            </div>
          </div>
          <div className={style.selectContent}>
            {videoDataList.map((_item, index) => (
              <SelectBtn
                key={index}
                isActive={index === activeIndex}
                index={index}
                onClick={() => onSelectClick(index)}
              />
            ))}
          </div>
        </div>
      </Popup>
    </>
  );
};

export default VideoSwiper;
