/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Toast } from 'antd-mobile';
import type { ToastHandler } from 'antd-mobile/es/components/toast/methods';
import useUrlState from '@ahooksjs/use-url-state';
import type { IVideoDataWithModel } from '@/typings';
import VideoSwiper from '@/components/video-swiper';
import { parseModel } from '@/utils';

import style from './index.module.less';
import 'swiper/less';
import '@volcengine/veplayer/index.min.css';

interface IRecommend {
  isRecommend: boolean;
  isRecommendActive: boolean;
  isSliderMoving: boolean;
  onProgressDrag: () => void;
  onProgressDragend: () => void;
  recData: any;
  recLoading: boolean;
}

const Recommend: React.FC<IRecommend> = ({
  isRecommend,
  isRecommendActive,
  isSliderMoving,
  onProgressDrag,
  onProgressDragend,
  recData,
  recLoading,
}) => {
  const [urlState] = useUrlState();
  const toastRef = useRef<ToastHandler>();
  const startTime = urlState.startTime || 0;
  const data = recData;
  const loading = recLoading;

  const [activeIndex, setActiveIndex] = useState(0);
  const list: IVideoDataWithModel[] = useMemo(
    () =>
      (data?.result || [])
        .map((item: any) => {
          const model: IVideoDataWithModel = {
            ...item,
            videoModel: parseModel(item.videoModel),
          };
          return model;
        })
        .filter((item: IVideoDataWithModel) => item?.videoModel?.PlayInfoList?.[0]?.MainPlayUrl),
    [data?.result],
  );
  const current: IVideoDataWithModel = useMemo(() => list?.[activeIndex], [activeIndex, list]);

  useEffect(() => {
    if (isRecommend) {
      return;
    }
    if (current) {
      toastRef?.current?.close();
    } else {
      toastRef.current = Toast.show({
        icon: 'loading',
        content: '加载中…',
        duration: 0,
      });
    }
  }, [current, isRecommend]);

  useEffect(() => {
    return () => {
      toastRef.current?.close();
    };
  }, []);

  return loading ? (
    <div className={style.loadingMask}></div>
  ) : (
    <div className={style.wrap}>
      <VideoSwiper
        startTime={startTime}
        isRecommendActive={isRecommendActive}
        isRecommend={isRecommend}
        videoDataList={list}
        isSliderMoving={isSliderMoving}
        onChange={setActiveIndex}
        onProgressDrag={onProgressDrag}
        onProgressDragend={onProgressDragend}
      />
    </div>
  );
};

export default Recommend;
