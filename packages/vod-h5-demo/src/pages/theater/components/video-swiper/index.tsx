import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { SwiperClass } from 'swiper/react';
import VePlayer, { Events } from '@volcengine/veplayer';
import type { IPlayerConfig } from '@volcengine/veplayer';
import type { IVideoDataWithModel } from '../../../../interface';
import { Popup, Toast } from 'antd-mobile';
import SliderItem from '../slider-item';
import SelectBtn from '../select-btn';
import SelectIcon from '@/assets/svg/select.svg?react';
import UpArrowIcon from '@/assets/svg/ic_arrow_packup.svg?react';
import CloseIcon from '@/assets/svg/close.svg?react';
import UnmuteIcon from '@/assets/svg/unmute.svg?react';

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
}

const VideoSwiper: React.FC<IVideoSwiperProps> = ({
  list,
  isRecommend,
  isRecommendActive,
  isSliderMoving,
  startTime = 0,
  onChange,
}) => {
  const swiperRef = useRef<SwiperClass>();
  const wrapRef = useRef<HTMLElement>();
  const sdkRef = useRef<VePlayer>();
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isTouching, setTouching] = useState<boolean>(false);
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
        if (player.muted || player.video.muted) {
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
      setShowUnmuteBtn(false);
    }
  }

  const onSlideChange = (swiper: SwiperClass) => {
    console.log('tttt', isTouching, swiper.activeIndex, activeIndex);
    if (swiper.activeIndex !== activeIndex) {
      playNext(swiper.activeIndex);
    }
  };

  /**
   * 播放器下一个视频
   * @param {number} index - 当前swiper的index
   */
  const playNext = (index: number) => {
    if (sdkRef.current && index !== activeIndex) {
      const next = list?.[index];
      const playInfoList = next?.videoModel?.PlayInfoList || [];
      const url = playInfoList?.[0]?.MainPlayUrl;
      const poster = next?.videoModel?.PosterUrl ?? next.coverUrl;
      if (!url) {
        console.warn('');
        Toast.show({
          icon: 'fail',
          content: '数据异常',
        });
        return;
      }
      setActiveIndex(index);
      sdkRef.current?.player?.pause();
      sdkRef.current?.getPlugin('poster')?.update(poster);
      sdkRef.current
        ?.playNext({
          autoplay: true,
          url,
        })
        .then(() => {
          sdkRef.current?.player.play();
        });
    }
  };

  const onEnded = () => {
    if (activeIndex === list.length - 1) {
      Toast.show({
        content: '看完了！',
      });
    } else {
      console.log('qie xia yige ');
      swiperRef.current?.slideNext();
    }
  };

  const initPlayer = () => {
    if (!sdkRef.current && current) {
      const playInfoList = current?.videoModel?.PlayInfoList || [];
      const poster = current?.videoModel?.PosterUrl ?? current.coverUrl;
      console.log('playInfoList', playInfoList);
      const url = playInfoList?.[0]?.MainPlayUrl;
      const options = {
        url,
        // el: containerRef.current,
        id: 'veplayer-container',
        startTime,
        autoplay: !isRecommend,
        enableDegradeMuteAutoplay: true,
        controls: {
          mode: 'bottom',
        },
        mobile: {
          gradient: 'none',
          darkness: false,
          disableGesture: isRecommend,
          isTouchingSeek: !isRecommend,
        },
        commonStyle: {
          // 播放完成部分进度条底色
          playedColor: '#ffffff',
        },
        sdkErrorPlugin: {
          isNeedRefreshButton: false,
        },
        ignores: [
          'moreButtonPlugin',
          'enter',
          'fullscreen',
          'volume',
          'play',
          'time',
          'pip',
          'playbackrate',
          'sdkDefinitionPlugin',
        ],
        codec: 'h264',
        start: {
          disableAnimate: true,
          isShowPause: true,
        },
        videoFillMode: 'fillWidth',
        poster: {
          poster,
          hideCanplay: true,
          fillMode: 'fixWidth',
        },
        vodLogOpts: {
          vtype: 'MP4',
          tag: 'normal',
          codec_type: 'h264',
          line_app_id: 5627721,
        },
      };

      const playerSdk = new VePlayer(options as IPlayerConfig);
      window.playerSdk = playerSdk;
      playerSdk.once(Events.COMPLETE, () => {
        console.log('playerSdk', options, playerSdk);
      });
      playerSdk.once(Events.PLAY, showUnmute);
      playerSdk.once(Events.AUTOPLAY_PREVENTED, showUnmute);
      playerSdk.on(Events.PLAY, () => setTouching(false));
      playerSdk.on(Events.ENDED, onEnded);
      sdkRef.current = playerSdk;
    }
  };

  // 组件加载时初始化播放器
  useEffect(() => {
    setTimeout(() => {
      initPlayer();
    }, 0);
  }, [current]);

  // 组件卸载时销毁播放器
  useEffect(() => {
    return () => {
      if (sdkRef.current) {
        sdkRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    onChange(activeIndex);
    const playerContainer = sdkRef.current?.playerContainer;
    const insertParentNode = document.getElementById(`swiper-video-container-${activeIndex}`);
    if (playerContainer) {
      insertParentNode?.insertBefore(playerContainer, null);
    }
  }, [activeIndex, onChange]);

  useEffect(() => {
    if (isTouching) {
      sdkRef?.current?.player.pause();
    } else {
      if (!isSliderMoving) {
        console.warn('>>>> swiper touch play');
        sdkRef?.current?.player.play();
      }
    }
  }, [isTouching]);

  useEffect(() => {
    if (isRecommend) {
      console.log(
        '>>> isSliderMoving:',
        isSliderMoving,
        'isRecommendActive:',
        isRecommendActive,
        'isRecommend: ',
        isRecommend,
      );
      if (isRecommendActive) {
        if (isSliderMoving) {
          console.warn('>>>pause');
          sdkRef.current?.player?.pause();
        } else {
          console.warn('>>> play');
          sdkRef.current?.player?.play();
        }
      } else {
        console.warn('>>>pause');
        sdkRef.current?.player?.pause();
      }
    }
  }, [isRecommend, isRecommendActive, isSliderMoving]);

  const onSelectClick = (index: number) => {
    swiperRef.current?.slideTo(index);
    setActiveIndex(index);
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
              onSliderFirstMove={() => {
                if (activeIndex === 0 || activeIndex === list.length - 1) {
                  return;
                }
                setTouching(true);
                console.log('fm');
              }}
              onTransitionEnd={() => {
                console.log('onTransitionEnd');
                setTouching(false);
              }}
              onSlideChangeTransitionEnd={() => {
                console.log('et');
                // setTouching(false)
              }}
              allowSlideNext={activeIndex !== list.length - 1}
              allowSlidePrev={activeIndex !== 0}
            >
              {list.map((item: any, i: number) => {
                return (
                  <SwiperSlide key={item.id}>
                    {({ isActive }) => (
                      <SliderItem
                        key={item.id}
                        data={item}
                        index={i}
                        isTouching={isTouching}
                        isActive={isActive}
                        isRecommend={isRecommend}
                        getCurrentTime={getCurrentTime}
                      >
                        <div className={style.veplayerContainer}>
                          <div ref={containerRef} id="veplayer-container"></div>
                        </div>
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
