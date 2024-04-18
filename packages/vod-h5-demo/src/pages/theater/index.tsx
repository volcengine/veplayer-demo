import { useState, useRef, useEffect } from 'react';
import { NavBar, Toast } from 'antd-mobile';
import type { ToastHandler } from 'antd-mobile/es/components/toast/methods';
import { useNavigate } from 'react-router-dom';
import useUrlState from '@ahooksjs/use-url-state';
import type { IVideoDataWithModel } from '../../interface';
import useAxios from 'axios-hooks';
import { API_PATH } from '../../api';
import VideoSwiper from './components/video-swiper';
import { parseModel } from '../../utils';

import style from './index.module.less';
import 'swiper/less';
import '@volcengine/veplayer/index.min.css';

function Theater() {
  const [urlState] = useUrlState();
  const toastRef = useRef<ToastHandler>();
  const dramaId = urlState.id;
  const startTime = urlState.start || 0;
  const [{ data, loading }] = useAxios(
    {
      url: API_PATH.GetDramaEpisodeWithVideoModel,
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
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const list: IVideoDataWithModel[] = (data?.result || []).map(item => ({
    ...item,
    videoModel: parseModel(item.videoModel),
  }));
  const current: IVideoDataWithModel | undefined = list?.[activeIndex];
  const episodeNumber = current?.episodeDetail?.episodeNumber;

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

  console.log('list:', list);

  const back = () => navigate('/playlet/square/');
  return loading ? (
    <div className={style.loadingMask}></div>
  ) : (
    <div className={style.wrap}>
      <NavBar className={style.head} left={episodeNumber ? `第${episodeNumber}集` : ''} onBack={back} />
      <VideoSwiper startTime={startTime} list={list} onChange={setActiveIndex} />
    </div>
  );
}

export default Theater;
