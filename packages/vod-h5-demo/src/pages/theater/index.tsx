import React, { useState, useRef, useEffect, useCallback } from 'react';
import { NavBar } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import VePlayer, { Events } from '@volcengine/veplayer';
import type { IPlayerConfig } from '@volcengine/veplayer';
import { Popup } from 'antd-mobile';
import SliderItem from './components/slider-item';
import { useDoubleClick } from './hooks';
import SelectIcon from '@/assets/svg/select.svg?react';
import UpArrowIcon from '@/assets/svg/ic_arrow_packup.svg?react';
import CloseIcon from '@/assets/svg/close.svg?react';
import UnmuteIcon from '@/assets/svg/unmute.svg?react';
import SelectBtn from './components/select-btn';
// import useUrlState from '@ahooksjs/use-url-state';
import type { IVideoData } from '../../interface';
// import useAxios from 'axios-hooks';
// import { API_PATH } from '../../api';
//
// import playData from '../../model';

import 'swiper/less';
import style from './index.module.less';
import '@volcengine/veplayer/index.min.css';

function Theater() {
  // const [urlState, setUrlState] = useUrlState();
  // const dramaId = urlState.id;
  // const [{ data, loading }, getVideos] = useAxios(
  //   {
  //     url: API_PATH.GetDramaEpisodeWithPlayAuthToken,
  //     method: 'POST',
  //     data: {
  //       authorId: __AuthorId__,
  //       dramaId,
  //       offset: 0,
  //       pageSize: 50,
  //     },
  //   },
  //   { manual: false },
  // );

  const data: IVideoData[] = [
    {
      vid: 'v0c0b4g7007ccob2mrvog65luelooqng',
      caption: '绝世神王.mp4',
      duration: 93.461,
      coverUrl:
        'http://bytevod-drama-cover1.byte-test.com/tos-vod-boe-v-37f0e876b2846a20/675c93e30df045ceb19eb1805b21d754~tplv-vod-obj.image',
      playAuthToken:
        'eyJHZXRQbGF5SW5mb1Rva2VuIjoiQWN0aW9uPUdldFBsYXlJbmZvXHUwMDI2VmVyc2lvbj0yMDIwLTA4LTAxXHUwMDI2VmlkPXYwYzBiNGc3MDA3Y2NvYjJtcnZvZzY1bHVlbG9vcW5nXHUwMDI2WC1BbGdvcml0aG09SE1BQy1TSEEyNTZcdTAwMjZYLUNyZWRlbnRpYWw9QUtMVE5UQmpaalE0T0RZMFl6ZzJOREZqWXprelltWmxaR1EzWkRReE1qSmtOalUlMkYyMDI0MDQxNSUyRmNuLW5vcnRoLTElMkZ2b2QlMkZyZXF1ZXN0XHUwMDI2WC1EYXRlPTIwMjQwNDE1VDE2MTQxOFpcdTAwMjZYLUV4cGlyZXM9ODY0MDBcdTAwMjZYLU5vdFNpZ25Cb2R5PVx1MDAyNlgtU2lnbmF0dXJlPTVkOThlNjNjMzIyMzM1NTk0MTIzYzEyMmI0NzA0Y2M0MjFlNzU1MGI4MzllMWRjMzhlZjk1ODA4NGRjM2Q3ZmVcdTAwMjZYLVNpZ25lZEhlYWRlcnM9XHUwMDI2WC1TaWduZWRRdWVyaWVzPUFjdGlvbiUzQlZlcnNpb24lM0JWaWQlM0JYLUFsZ29yaXRobSUzQlgtQ3JlZGVudGlhbCUzQlgtRGF0ZSUzQlgtRXhwaXJlcyUzQlgtTm90U2lnbkJvZHklM0JYLVNpZ25lZEhlYWRlcnMlM0JYLVNpZ25lZFF1ZXJpZXMiLCJUb2tlblZlcnNpb24iOiJWMiJ9',
      subtitleAuthToken:
        'eyJHZXRTdWJ0aXRsZUF1dGhUb2tlbiI6IkFjdGlvbj1HZXRTdWJ0aXRsZUluZm9MaXN0XHUwMDI2U3RhdHVzPVB1Ymxpc2hlZFx1MDAyNlZlcnNpb249MjAyMC0wOC0wMVx1MDAyNlZpZD12MGMwYjRnNzAwN2Njb2IybXJ2b2c2NWx1ZWxvb3FuZ1x1MDAyNlgtQWxnb3JpdGhtPUhNQUMtU0hBMjU2XHUwMDI2WC1DcmVkZW50aWFsPUFLTFROVEJqWmpRNE9EWTBZemcyTkRGall6a3pZbVpsWkdRM1pEUXhNakprTmpVJTJGMjAyNDA0MTUlMkZjbi1ub3J0aC0xJTJGdm9kJTJGcmVxdWVzdFx1MDAyNlgtRGF0ZT0yMDI0MDQxNVQxNjE0MThaXHUwMDI2WC1FeHBpcmVzPTg2NDAwXHUwMDI2WC1Ob3RTaWduQm9keT1cdTAwMjZYLVNpZ25hdHVyZT03MTU3ODZiZWIwOTljOTdiMWNmOTY2M2EyYTEzODA0Y2EzM2RlNTUzZDMxMzJjODc2MjY0ZjljNjQyZDJiZmQ3XHUwMDI2WC1TaWduZWRIZWFkZXJzPVx1MDAyNlgtU2lnbmVkUXVlcmllcz1BY3Rpb24lM0JTdGF0dXMlM0JWZXJzaW9uJTNCVmlkJTNCWC1BbGdvcml0aG0lM0JYLUNyZWRlbnRpYWwlM0JYLURhdGUlM0JYLUV4cGlyZXMlM0JYLU5vdFNpZ25Cb2R5JTNCWC1TaWduZWRIZWFkZXJzJTNCWC1TaWduZWRRdWVyaWVzIn0=',
      episodeDetail: {
        episodeNumber: 1,
        episodeDesc: '绝世神王.mp4 - 世界神王在众手下四大战神的跪拜迎接之下回归华夏大地，复仇归来',
        dramaInfo: {
          dramaId: '3781',
          dramaTitle: '绝世神王',
          description: '绝世神王',
          coverUrl:
            'http://bytevod-drama-cover1.byte-test.com/tos-vod-boe-v-37f0e876b2846a20/vod/demo/drama/episode/image/MTcxMjcyOTAyMDg4NF/nu53kuJbnpZ7njotfY292ZXI=~tplv-vod-obj.image',
          totalEpisodeNumber: 3,
          latestEpisodeNumber: 3,
          authorId: 'frank_drama_test_5',
        },
      },
    },
    {
      vid: 'v0c0b4g7007ccob2n37og65v76t438c0',
      caption: '绝世神王.mp4',
      duration: 60.16,
      coverUrl:
        'http://bytevod-drama-cover1.byte-test.com/tos-vod-boe-v-37f0e876b2846a20/6c13189a859c483f9fd5ae56d42fd90a~tplv-vod-obj.image',
      playAuthToken:
        'eyJHZXRQbGF5SW5mb1Rva2VuIjoiQWN0aW9uPUdldFBsYXlJbmZvXHUwMDI2VmVyc2lvbj0yMDIwLTA4LTAxXHUwMDI2VmlkPXYwYzBiNGc3MDA3Y2NvYjJuMzdvZzY1djc2dDQzOGMwXHUwMDI2WC1BbGdvcml0aG09SE1BQy1TSEEyNTZcdTAwMjZYLUNyZWRlbnRpYWw9QUtMVE5UQmpaalE0T0RZMFl6ZzJOREZqWXprelltWmxaR1EzWkRReE1qSmtOalUlMkYyMDI0MDQxNSUyRmNuLW5vcnRoLTElMkZ2b2QlMkZyZXF1ZXN0XHUwMDI2WC1EYXRlPTIwMjQwNDE1VDE2MTQxOFpcdTAwMjZYLUV4cGlyZXM9ODY0MDBcdTAwMjZYLU5vdFNpZ25Cb2R5PVx1MDAyNlgtU2lnbmF0dXJlPTcxOWRjOTAwNWUwYzQ3OWExYWU4NjQyOWI1OWJlNzRkNWY0N2ExOWViZjMyYzlmOWMzMGU1ZWExOWNjOGNhMDhcdTAwMjZYLVNpZ25lZEhlYWRlcnM9XHUwMDI2WC1TaWduZWRRdWVyaWVzPUFjdGlvbiUzQlZlcnNpb24lM0JWaWQlM0JYLUFsZ29yaXRobSUzQlgtQ3JlZGVudGlhbCUzQlgtRGF0ZSUzQlgtRXhwaXJlcyUzQlgtTm90U2lnbkJvZHklM0JYLVNpZ25lZEhlYWRlcnMlM0JYLVNpZ25lZFF1ZXJpZXMiLCJUb2tlblZlcnNpb24iOiJWMiJ9',
      subtitleAuthToken:
        'eyJHZXRTdWJ0aXRsZUF1dGhUb2tlbiI6IkFjdGlvbj1HZXRTdWJ0aXRsZUluZm9MaXN0XHUwMDI2U3RhdHVzPVB1Ymxpc2hlZFx1MDAyNlZlcnNpb249MjAyMC0wOC0wMVx1MDAyNlZpZD12MGMwYjRnNzAwN2Njb2IybjM3b2c2NXY3NnQ0MzhjMFx1MDAyNlgtQWxnb3JpdGhtPUhNQUMtU0hBMjU2XHUwMDI2WC1DcmVkZW50aWFsPUFLTFROVEJqWmpRNE9EWTBZemcyTkRGall6a3pZbVpsWkdRM1pEUXhNakprTmpVJTJGMjAyNDA0MTUlMkZjbi1ub3J0aC0xJTJGdm9kJTJGcmVxdWVzdFx1MDAyNlgtRGF0ZT0yMDI0MDQxNVQxNjE0MThaXHUwMDI2WC1FeHBpcmVzPTg2NDAwXHUwMDI2WC1Ob3RTaWduQm9keT1cdTAwMjZYLVNpZ25hdHVyZT0yY2Y5MDljM2UxNGUxNGQ1YzcxMjhhZGU1NTJjZWE3Njg5MGRlN2M5OTJmZDc0MDI0OWFhN2UwNTY5NmUxOTk5XHUwMDI2WC1TaWduZWRIZWFkZXJzPVx1MDAyNlgtU2lnbmVkUXVlcmllcz1BY3Rpb24lM0JTdGF0dXMlM0JWZXJzaW9uJTNCVmlkJTNCWC1BbGdvcml0aG0lM0JYLUNyZWRlbnRpYWwlM0JYLURhdGUlM0JYLUV4cGlyZXMlM0JYLU5vdFNpZ25Cb2R5JTNCWC1TaWduZWRIZWFkZXJzJTNCWC1TaWduZWRRdWVyaWVzIn0=',
      episodeDetail: {
        episodeNumber: 2,
        episodeDesc: '绝世神王.mp4 - 世界神王在众手下四大战神的跪拜迎接之下回归华夏大地，复仇归来',
        dramaInfo: {
          dramaId: '3781',
          dramaTitle: '绝世神王',
          description: '绝世神王',
          coverUrl:
            'http://bytevod-drama-cover1.byte-test.com/tos-vod-boe-v-37f0e876b2846a20/vod/demo/drama/episode/image/MTcxMjcyOTAyMDg4NF/nu53kuJbnpZ7njotfY292ZXI=~tplv-vod-obj.image',
          totalEpisodeNumber: 3,
          latestEpisodeNumber: 3,
          authorId: 'frank_drama_test_5',
        },
      },
    },
    {
      vid: 'v0c0b4g7007ccob2n87og65v76t438cg',
      caption: '绝世神王.mp4',
      duration: 80.277,
      coverUrl:
        'http://bytevod-drama-cover1.byte-test.com/tos-vod-boe-v-37f0e876b2846a20/fadae451d7af4624afd0386b4e994792~tplv-vod-obj.image',
      playAuthToken:
        'eyJHZXRQbGF5SW5mb1Rva2VuIjoiQWN0aW9uPUdldFBsYXlJbmZvXHUwMDI2VmVyc2lvbj0yMDIwLTA4LTAxXHUwMDI2VmlkPXYwYzBiNGc3MDA3Y2NvYjJuODdvZzY1djc2dDQzOGNnXHUwMDI2WC1BbGdvcml0aG09SE1BQy1TSEEyNTZcdTAwMjZYLUNyZWRlbnRpYWw9QUtMVE5UQmpaalE0T0RZMFl6ZzJOREZqWXprelltWmxaR1EzWkRReE1qSmtOalUlMkYyMDI0MDQxNSUyRmNuLW5vcnRoLTElMkZ2b2QlMkZyZXF1ZXN0XHUwMDI2WC1EYXRlPTIwMjQwNDE1VDE2MTQxOFpcdTAwMjZYLUV4cGlyZXM9ODY0MDBcdTAwMjZYLU5vdFNpZ25Cb2R5PVx1MDAyNlgtU2lnbmF0dXJlPWE3ZDgyMzM4Njc0NzliNjUzNjk5NzBmNzVkYzA0MzJhNjI4N2U0OTAxY2UwMDg2YjY2NGMyNTdmOTMxNWI3YThcdTAwMjZYLVNpZ25lZEhlYWRlcnM9XHUwMDI2WC1TaWduZWRRdWVyaWVzPUFjdGlvbiUzQlZlcnNpb24lM0JWaWQlM0JYLUFsZ29yaXRobSUzQlgtQ3JlZGVudGlhbCUzQlgtRGF0ZSUzQlgtRXhwaXJlcyUzQlgtTm90U2lnbkJvZHklM0JYLVNpZ25lZEhlYWRlcnMlM0JYLVNpZ25lZFF1ZXJpZXMiLCJUb2tlblZlcnNpb24iOiJWMiJ9',
      subtitleAuthToken:
        'eyJHZXRTdWJ0aXRsZUF1dGhUb2tlbiI6IkFjdGlvbj1HZXRTdWJ0aXRsZUluZm9MaXN0XHUwMDI2U3RhdHVzPVB1Ymxpc2hlZFx1MDAyNlZlcnNpb249MjAyMC0wOC0wMVx1MDAyNlZpZD12MGMwYjRnNzAwN2Njb2Iybjg3b2c2NXY3NnQ0MzhjZ1x1MDAyNlgtQWxnb3JpdGhtPUhNQUMtU0hBMjU2XHUwMDI2WC1DcmVkZW50aWFsPUFLTFROVEJqWmpRNE9EWTBZemcyTkRGall6a3pZbVpsWkdRM1pEUXhNakprTmpVJTJGMjAyNDA0MTUlMkZjbi1ub3J0aC0xJTJGdm9kJTJGcmVxdWVzdFx1MDAyNlgtRGF0ZT0yMDI0MDQxNVQxNjE0MThaXHUwMDI2WC1FeHBpcmVzPTg2NDAwXHUwMDI2WC1Ob3RTaWduQm9keT1cdTAwMjZYLVNpZ25hdHVyZT01MGQxYzAxMmIxOGY3ZTlhODBmNmEzN2IwY2E2MmM4YzVhNDMyNWUxYzFjMTliYWYxYmY5Y2NkMmYxYjc3MzAxXHUwMDI2WC1TaWduZWRIZWFkZXJzPVx1MDAyNlgtU2lnbmVkUXVlcmllcz1BY3Rpb24lM0JTdGF0dXMlM0JWZXJzaW9uJTNCVmlkJTNCWC1BbGdvcml0aG0lM0JYLUNyZWRlbnRpYWwlM0JYLURhdGUlM0JYLUV4cGlyZXMlM0JYLU5vdFNpZ25Cb2R5JTNCWC1TaWduZWRIZWFkZXJzJTNCWC1TaWduZWRRdWVyaWVzIn0=',
      episodeDetail: {
        episodeNumber: 3,
        episodeDesc: '绝世神王.mp4 - 世界神王在众手下四大战神的跪拜迎接之下回归华夏大地，复仇归来',
        dramaInfo: {
          dramaId: '3781',
          dramaTitle: '绝世神王',
          description: '绝世神王',
          coverUrl:
            'http://bytevod-drama-cover1.byte-test.com/tos-vod-boe-v-37f0e876b2846a20/vod/demo/drama/episode/image/MTcxMjcyOTAyMDg4NF/nu53kuJbnpZ7njotfY292ZXI=~tplv-vod-obj.image',
          totalEpisodeNumber: 3,
          latestEpisodeNumber: 3,
          authorId: 'frank_drama_test_5',
        },
      },
    },
  ];
  const list = data;

  const refSwiper = useRef<SwiperClass>();
  const wrapRef = useRef<HTMLElement>(null);
  const sdkRef = useRef<VePlayer>();
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isTouching, setTouching] = useState(false);
  const [isFirstSlide, setFirstSlide] = useState(true);
  const [showUnmuteBtn, setShowUnmuteBtn] = useState(false);
  const [selectVisible, setSelectVisible] = useState<boolean>(false);

  const navigate = useNavigate();

  const current = list[activeIndex];
  const dramaInfo = current?.episodeDetail?.dramaInfo || {};
  const { dramaTitle, totalEpisodeNumber } = dramaInfo;
  const episodeNumber = current.episodeDetail?.episodeNumber;

  const back = () => navigate('/playlet/square/');

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

  useDoubleClick({
    onSingleClick: e => {
      console.log('se', e);
      pauseOrPlay();
    },
    onDoubleClick: () => {
      console.log('dbclick');
    },
    ref: wrapRef,
  });

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
      const next = list[index];
      const { playAuthToken = '', coverUrl } = next;
      setActiveIndex(index);
      sdkRef.current?.getPlugin('poster')?.update(coverUrl);
      sdkRef.current.playNext({
        autoplay: true,
        getVideoByToken: {
          playAuthToken,
          defaultDefinition: '480p',
        },
      });
    }
  };

  const initPlayer = useCallback(() => {
    if (!sdkRef.current && containerRef.current) {
      const defaultData = list[activeIndex];
      const { playAuthToken, coverUrl } = defaultData || {};
      const options: IPlayerConfig = {
        getVideoByToken: {
          playAuthToken,
          defaultDefinition: '480p',
        },
        el: containerRef.current,
        mobile: {
          gradient: 'none',
        },
        // autoplay: true,
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
        ignores: ['moreButtonPlugin', 'enter', 'fullscreen', 'volume', 'play', 'time'],
        codec: 'h264',
        start: {
          disableAnimate: true,
          isShowPause: true,
        },
        videoFillMode: 'fillHeight',
        poster: {
          poster: coverUrl,
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
      playerSdk.once(Events.PLAY, showUnmute);
      playerSdk.once(Events.AUTOPLAY_PREVENTED, showUnmute);
      sdkRef.current = playerSdk;
    }
  }, []);

  // 组件加载时初始化播放器，组件卸载时销毁播放器
  useEffect(() => {
    setTimeout(() => {
      initPlayer();
    });
    return () => {
      if (sdkRef.current) {
        sdkRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className={style.wrap}>
      <NavBar className={style.head} left={`第${episodeNumber}集`} onBack={back} />
      <div className={style.main}>
        <div
          className={style.swiperContainer}
          onClick={e => console.log('swi', e)}
          ref={wrapRef as React.MutableRefObject<HTMLDivElement>}
        >
          {list.length > 0 && (
            <Swiper
              className={style.mySwiper}
              onSwiper={swiper => (refSwiper.current = swiper)}
              direction="vertical"
              preventClicksPropagation={false}
              onSlideChange={onSlideChange}
              onTouchEnd={() => setTouching(false)}
              onTouchMove={() => setTouching(true)}
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
      </div>
      <div className={style.foot} onClick={() => setSelectVisible(!selectVisible)}>
        <SelectIcon className={style.selectIcon} />
        <div className={style.selectText}>{`选集（${list.length}集）`}</div>
        <UpArrowIcon className={style.selectArrow} />
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
    </div>
  );
}

export default Theater;
