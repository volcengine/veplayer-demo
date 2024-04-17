import React, { useState, useRef, useEffect } from 'react';
import { NavBar, SpinLoading } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import VePlayer, { Events } from '@volcengine/veplayer';
import type { IPlayerConfig } from '@volcengine/veplayer';
import type { IVideoData, IVideoDataWithModel } from '../../../../interface';
import { Popup, Toast } from 'antd-mobile';
import SliderItem from '../slider-item';
import SelectBtn from '../select-btn';
// import { useDoubleClick } from './hooks';
import SelectIcon from '@/assets/svg/select.svg?react';
import UpArrowIcon from '@/assets/svg/ic_arrow_packup.svg?react';
import CloseIcon from '@/assets/svg/close.svg?react';
import UnmuteIcon from '@/assets/svg/unmute.svg?react';
import LoadingIcon from '@/assets/svg/loading.svg?react';
import useUrlState from '@ahooksjs/use-url-state';
import useAxios from 'axios-hooks';
import { API_PATH } from '../../api';

import 'swiper/less';
import style from './index.module.less';
import '@volcengine/veplayer/index.min.css';

interface IVideoSwiperProps {
  list: IVideoDataWithModel[];
  onChange: (v: number) => any;
}

const VideoSwiper: React.FC<IVideoSwiperProps> = ({ list, onChange }) => {
  const refSwiper = useRef<SwiperClass>();
  const wrapRef = useRef<HTMLElement>(null);
  const sdkRef = useRef<VePlayer>();
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isTouching, setTouching] = useState(false);
  const [isFirstSlide, setFirstSlide] = useState(true);
  const [showUnmuteBtn, setShowUnmuteBtn] = useState(false);
  const [selectVisible, setSelectVisible] = useState<boolean>(false);

  const current: IVideoDataWithModel = list?.[activeIndex];

  const dramaInfo = current?.episodeDetail?.dramaInfo;
  const { dramaTitle, totalEpisodeNumber } = dramaInfo || {};

  function pauseOrPlay() {
    if (sdkRef.current?.player) {
      const player = sdkRef.current.player;
      if (player.paused) {
        player.play();
      } else {
        player.pause();
      }
    }
  }

  /**
   * 展示静音按钮
   */
  function showUnmute() {
    if (sdkRef.current?.player) {
      const player = sdkRef.current.player;
      if (player.muted || player.video.muted) {
        setShowUnmuteBtn(true);
      } else {
        setShowUnmuteBtn(false);
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

  // useDoubleClick({
  //   onSingleClick: e => {
  //     console.log('se', e);
  //     pauseOrPlay();
  //   },
  //   onDoubleClick: () => {
  //     console.log('dbclick');
  //   },
  //   ref: wrapRef,
  // });

  const onSlideChange = (swiper: SwiperClass) => {
    console.log('tttt', isTouching, swiper.activeIndex, activeIndex);
    if (isFirstSlide && swiper.realIndex === 1) {
      setFirstSlide(false);
    }
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
        console.warn('')
        Toast.show({
          icon: 'fail',
          content: '数据异常',
        })
        return;
      }
      setActiveIndex(index);
      sdkRef.current?.player.pause();
      sdkRef.current?.getPlugin('poster')?.update(poster);
      sdkRef.current.playNext({
        autoplay: true,
        url,
      }).then(() => {
        sdkRef.current?.player.play();
      })
    }
  };

  const initPlayer = () => {
    if (!sdkRef.current && containerRef.current && current) {
      const playInfoList = current?.videoModel?.PlayInfoList || [];
      const poster = current?.videoModel?.PosterUrl ?? current.coverUrl;
      const url = playInfoList?.[0]?.MainPlayUrl;
      const options: IPlayerConfig = {
        url,
        el: containerRef.current,
        mobile: {
          gradient: 'none',
        },
        autoplay: true,
        loop: true,
        enableDegradeMuteAutoplay: true,
        closeVideoClick: false,
        closeVideoDblclick: true,
        controls: {
          mode: 'bottom',
        },
        commonStyle: {
          // 播放完成部分进度条底色
          playedColor: '#ffffff',
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
          // 'sdkDefinitionPlugin',
        ],
        codec: 'h264',
        start: {
          disableAnimate: true,
          isShowPause: true,
        },
        videoFillMode: 'fillHeight',
        poster: {
          poster,
          hideCanplay: true,
          fillMode: 'contain',
        },
        vodLogOpts: {
          vtype: 'MP4',
          tag: 'normal',
          codec_type: 'h264',
          line_app_id: 5627721,
        },
      };

      const playerSdk = new VePlayer(options as IPlayerConfig);
      console.log('playerSdk', options, playerSdk);
      playerSdk.once(Events.PLAY, showUnmute);
      playerSdk.once(Events.AUTOPLAY_PREVENTED, showUnmute);
      sdkRef.current = playerSdk;
    }
  };

  // 组件加载时初始化播放器
  useEffect(() => {
    setTimeout(() => {
      initPlayer();
    });
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
  }, [activeIndex, onChange]);

  const handleClick = (function () {
    let times = 0;
    const timeout = 300;
    return () => {
      times++;
      if (times === 1) {
        setTimeout(function () {
          if (times === 1) {
            pauseOrPlay();
          } else {
            // playerRef.current?.likeRef.current.handleLike();
          }
          times = 0;
        }, timeout);
      }
    };
  })();

  return (
    <>
      <div className={style.main}>
        <div
          className={style.swiperContainer}
          onClick={handleClick}
          ref={wrapRef as React.MutableRefObject<HTMLDivElement>}
        >
          {list?.length > 0 && (
            <Swiper
              className={style.mySwiper}
              onSwiper={swiper => (refSwiper.current = swiper)}
              direction="vertical"
              preventClicksPropagation={false}
              onSlideChange={onSlideChange}
              onTouchEnd={() => setTouching(false)}
              onTouchMove={() => setTouching(true)}
              allowSlideNext={activeIndex !== list.length - 1}
              allowSlidePrev={activeIndex !== 0}
            >
              {list.map((item: any, i: number) => {
                return (
                  <SwiperSlide key={item.id}>
                    {({ isActive }) => (
                      <SliderItem key={item.id} data={item} index={i} isTouching={isTouching} isActive={isActive} />
                    )}
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </div>
        <div className={style.veplayerContainer}>
          <div ref={containerRef}></div>
        </div>
        {showUnmuteBtn && (
          <div className={style.unmute} onClick={onUnmuteClick}>
            <div className={style.unmuteBtn}>
              <UnmuteIcon className={style.unmuteIcon} />
              <span>点击取消静音</span>
            </div>
          </div>
        )}
        <div className={style.foot} onClick={() => setSelectVisible(!selectVisible)}>
          <SelectIcon className={style.selectIcon} />
          <div className={style.selectText}>{list?.length ? `选集（${list?.length}集）` : ''}</div>
          <UpArrowIcon className={style.selectArrow} />
        </div>
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
              <SelectBtn key={index} isActive={index === activeIndex} index={index} onClick={() => playNext(index)} />
            ))}
          </div>
        </div>
      </Popup>
    </>
  );
};

export default VideoSwiper;
