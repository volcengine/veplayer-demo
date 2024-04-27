import React, { useState, useRef, useEffect, CSSProperties } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { SwiperClass } from 'swiper/react';
import { Popup, Toast } from 'antd-mobile';
import VePlayer, { Events, PlayerCore } from '@volcengine/veplayer';
import MP4Plugin from '@byted/xgplayer-encrypt-mp4';
import SliderItem from '../slider-item';
import SelectBtn from '../select-btn';
import SelectIcon from '@/assets/svg/select.svg?react';
import UpArrowIcon from '@/assets/svg/ic_arrow_packup.svg?react';
import CloseIcon from '@/assets/svg/close.svg?react';
import UnmuteIcon from '@/assets/svg/unmute.svg?react';
import { selectDef, os, addPreloadList } from '@/utils';

import type { IPlayerConfig } from '@volcengine/veplayer';
import type { IVideoDataWithModel } from '@/typings';

import 'swiper/less';
import style from './index.module.less';
import '@volcengine/veplayer/index.min.css';

interface IVideoSwiperProps {
  list: IVideoDataWithModel[];
  isRecommend?: boolean;
  isRecommendActive?: boolean;
  isSliderMoving?: boolean;
  startTime?: number;
  onChange: (v: number) => any;
  onProgressDrag?: () => void;
  onProgressDragend?: () => void;
}

const VideoSwiper: React.FC<IVideoSwiperProps> = ({
  list,
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
  const [playNextStatus, setPlayNextStatus] = useState<string>('');
  const [showUnmuteBtn, setShowUnmuteBtn] = useState<boolean>(false);
  const [selectVisible, setSelectVisible] = useState<boolean>(false);

  const current: IVideoDataWithModel = list?.[activeIndex];

  const dramaInfo = current?.episodeDetail?.dramaInfo;
  const { dramaTitle, totalEpisodeNumber } = dramaInfo || {};

  /**
   * 展示静音按钮
   */
  function showUnmute() {
    if (sdkRef.current?.player) {
      const player = sdkRef.current?.player;
      if (player) {
        // @ts-expect-error: expect
        if (player.muted || player.video?.muted) {
          setShowUnmuteBtn(true);
        } else {
          setShowUnmuteBtn(false);
        }
      }
    }
  }

  function onUnmuteClick() {
    if (sdkRef.current?.player) {
      const player = sdkRef.current?.player;
      player.muted = false;
      player.play();
      setShowUnmuteBtn(false);
    }
  }

  const onSlideChange = (swiper: SwiperClass) => {
    if (swiper.realIndex !== activeIndex) {
      playNext(swiper.realIndex);
    }
  };
  const getDefInfo = (list: IVideoDataWithModel[], index: number) => {
    return selectDef(list?.[index]?.videoModel?.PlayInfoList ?? [], '720p');
  };

  /**
   * 播放器下一个视频
   * @param {number} index - 当前swiper的index
   */
  const playNext = (index: number) => {
    if (index < 0 || index >= list.length) {
      return;
    }
    if (sdkRef.current && index !== activeIndex) {
      setPlayNextStatus('start');
      const next = list?.[index];
      const def = getDefInfo(list, index);
      if (!def?.MainPlayUrl) {
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
      // @ts-expect-error expected
      sdkRef.current?.getPlugin('poster')?.update(poster);
      attachStartIcon(sdkRef.current?.player);
      sdkRef.current
        ?.playNext({
          autoplay: true,
          url: def.MainPlayUrl,
          vid: next.vid,
          definition: {
            list: [
              {
                url: def.MainPlayUrl,
                definition: def.Definition,
                codecType: def.Codec,
                bitrate: def.Bitrate,
                vtype: 'MP4',
              },
            ],
          },
        })
        .then(() => {
          console.warn('planext success', index);
          sdkRef.current?.player.play();
          setTimeout(() => hideStartIcon(sdkRef.current?.player), 0);
          setPlayNextStatus('end');
          // 追加前后集预加载
          addPreloadList(list, index);
        });
    }
  };

  function onEnded() {
    if (swiperRef.current?.activeIndex === list.length - 1) {
      Toast.show({
        content: '看完了！',
      });
    } else {
      swiperRef.current?.slideNext();
    }
  }

  const getClass = (player: PlayerCore) => player.root?.getElementsByClassName('xgplayer-start')[0];

  const hideStartIcon = (player?: PlayerCore) => {
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
  };

  const attachStartIcon = (player: PlayerCore) => {
    if (!player?.root) {
      return;
    }
    const startClassDom = getClass(player);
    if (startClassDom) {
      startClassDom.className = `${startClassDom.className} veplayer-h5-hide-start`;
    }
    // player.once(Events.AUTOPLAY_STARTED, () => hideStartIcon(player));
  };

  function initPlayer() {
    if (!sdkRef.current && current) {
      const playInfoList = current?.videoModel?.PlayInfoList || [];
      const poster = current?.videoModel?.PosterUrl ?? current.coverUrl;
      const def = selectDef(playInfoList, '720p');
      if (!def?.MainPlayUrl) {
        return;
      }
      const options: IPlayerConfig = {
        id: 'veplayer-container',
        // url: def.MainPlayUrl,
        playList: [
          {
            url: def.MainPlayUrl,
            definition: def.Definition,
            codecType: def.Codec,
            bitrate: def.Bitrate,
            vtype: 'MP4',
          },
        ],
        vid: current.vid,
        startTime,
        autoplay: !isRecommend,
        enableDegradeMuteAutoplay: true,
        closeVideoClick: false,
        closeVideoDblclick: true,
        videoFillMode: 'fillWidth',
        codec: def.Codec,
        enableMp4MSE: true,
        plugins: [MP4Plugin],
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
          isTouchingSeek: !isRecommend,
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
          line_app_id: 597335,
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
        }
      });
      playerSdk.once(Events.PLAY, showUnmute);
      playerSdk.once(Events.AUTOPLAY_PREVENTED, showUnmute);
      playerSdk.on(Events.ENDED, onEnded);

      sdkRef.current = playerSdk;
      addPreloadList(list, activeIndex);
    }
  }

  // 组件加载时初始化播放器
  useEffect(() => {
    setTimeout(() => {
      initPlayer();
    }, 0);
  }, [current, activeIndex]);

  // 组件卸载时销毁播放器
  useEffect(() => {
    return () => {
      if (sdkRef.current) {
        sdkRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    swiperRef.current?.slideReset();
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
          console.warn('>>> pause');
          sdkRef.current?.player?.pause();
        } else {
          console.warn('>>> play');
          sdkRef.current?.player?.play();
        }
      } else {
        console.warn('>>> pause');
        sdkRef.current?.player?.pause();
      }
    }
  }, [isRecommend, isRecommendActive, isSliderMoving]);
  const onSelectClick = (index: number) => {
    playNext(index);
  };

  const getCurrentTime = () => {
    return sdkRef?.current?.player?.currentTime || 0;
  };

  return (
    <>
      <div className={isRecommend ? style.recommendMain : style.main}>
        <div className={style.swiperContainer} ref={wrapRef as React.MutableRefObject<HTMLDivElement>}>
          {list?.length > 0 && (
            <Swiper
              className={style.mySwiper}
              direction="vertical"
              onSwiper={swiper => (swiperRef.current = swiper)}
              onActiveIndexChange={onSlideChange}
              allowSlideNext={activeIndex !== list.length - 1}
              allowSlidePrev={activeIndex !== 0}
            >
              {list.map((item: any, i: number) => {
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
              <div className={style.selectText}>{list?.length ? `选集（${list?.length}集）` : ''}</div>
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
            {list.map((_item, index) => (
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
