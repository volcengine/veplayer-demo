import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, Toast } from 'antd-mobile';
import useUrlState from '@ahooksjs/use-url-state';
import useAxios from 'axios-hooks';
import { API_PATH } from '@/api';
import VideoSwiper from '@/components/video-swiper';
import { parseModel } from '@/utils';
import BackIcon from '@/assets/svg/back_v3.svg?react';

import type { ToastHandler } from 'antd-mobile/es/components/toast/methods';
import type { IVideoDataWithModel } from '@/typings';

import style from './index.module.less';
import 'swiper/less';
import '@volcengine/veplayer/index.min.css';

type ResultType = {
  videoModel: string;
} & Omit<IVideoDataWithModel, 'videoModel'>;

function Theater() {
  const [urlState] = useUrlState();
  const toastRef = useRef<ToastHandler>();
  const dramaId = urlState.id;
  const startTime = urlState.startTime || 0;
  const [{ data, loading }] = useAxios(
    {
      url: API_PATH.GetDramaEpisodeWithVideoModel,
      method: 'POST',
      data: {
        authorId: __AuthorId__,
        needSsl: true,
        dramaId,
        offset: 0,
        pageSize: 50,
      },
    },
    { useCache: true },
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const list: IVideoDataWithModel[] = useMemo(
    () =>
      ((data?.result || []) as ResultType[]).map(item => ({
        ...item,
        videoModel: parseModel(item.videoModel),
      })),
    [data?.result],
  );
  const current: IVideoDataWithModel | undefined = useMemo(() => list?.[activeIndex], [activeIndex, list]);
  const episodeNumber = useMemo(() => current?.episodeDetail?.episodeNumber, [current?.episodeDetail?.episodeNumber]);
  useEffect(() => {
    if (current) {
      toastRef?.current?.close();
    } else {
      toastRef.current = Toast.show({
        icon: 'loading',
        content: '加载中…',
        duration: 0,
      });
    }
  }, [current]);

  useEffect(() => {
    const scrollFn = () => {
      window.scrollTo({ left: 0, top: 0 });
    };
    window.addEventListener('scrollend', scrollFn);
    return () => {
      window.removeEventListener('scrollend', scrollFn);
    };
  }, []);

  const back = () => navigate('/playlet/square/');
  return loading ? (
    <div className={style.loadingMask}></div>
  ) : (
    <div className={style.wrap}>
      <NavBar
        backArrow={<BackIcon />}
        className={style.head}
        left={episodeNumber ? <span>{`第${episodeNumber}集`}</span> : ''}
        onBack={back}
      />
      <VideoSwiper startTime={startTime} list={list} onChange={setActiveIndex} />
    </div>
  );
}

export default Theater;
