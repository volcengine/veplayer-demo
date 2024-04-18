import React, { useState, useRef, useEffect } from 'react';
import { Toast } from 'antd-mobile';
import type { ToastHandler } from 'antd-mobile/es/components/toast/methods';
import useUrlState from '@ahooksjs/use-url-state';
import type { IVideoDataWithModel } from '../../interface';
import useAxios from 'axios-hooks';
import { API_PATH } from '../../api';
import VideoSwiper from '../../pages/theater/components/video-swiper';
import { parseModel } from '../../utils';

import style from './index.module.less';
import 'swiper/less';
import '@volcengine/veplayer/index.min.css';

interface IRecommend {
  isRecommend: boolean;
  isRecommendActive: boolean;
  isSliderMoving: boolean;
  onProgressDrag: () => void;
  onProgressDragend: () => void;
}

const Recommend: React.FC<IRecommend> = ({
  isRecommend,
  isRecommendActive,
  isSliderMoving,
  onProgressDrag,
  onProgressDragend,
}) => {
  const [urlState] = useUrlState();
  const toastRef = useRef<ToastHandler>();
  const dramaId = urlState.id;
  const startTime = urlState.startTime || 0;
  const [{ data, loading }] = useAxios(
    {
      url: API_PATH.GetEpisodeFeedStreamWithVideoModel,
      method: 'POST',
      data: {
        authorId: __AuthorId__,
        dramaId,
        offset: 0,
        pageSize: 50,
      },
    },
    { manual: false },
  );

  const [activeIndex, setActiveIndex] = useState(0);
  // TODO EpisodeFeedStreamWithVideoModel
  const list: IVideoDataWithModel[] = (data?.result || [])
    .map(
      (item: any) =>
        ({
          ...item,
          videoModel: parseModel(item.videoModel),
        }) as IVideoDataWithModel,
    )
    .filter((item: IVideoDataWithModel) => item?.videoModel?.PlayInfoList?.[0]?.MainPlayUrl);
  const current: IVideoDataWithModel = list?.[activeIndex];

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
      toastRef.current && toastRef.current?.close();
    };
  }, []);

  console.log('recommend list:', list);

  return loading ? (
    <div className={style.loadingMask}></div>
  ) : (
    <div className={style.wrap}>
      <VideoSwiper
        startTime={startTime}
        isRecommendActive={isRecommendActive}
        isRecommend={isRecommend}
        list={list}
        isSliderMoving={isSliderMoving}
        onChange={setActiveIndex}
        onProgressDrag={onProgressDrag}
        onProgressDragend={onProgressDragend}
      />
    </div>
  );
};

export default Recommend;
