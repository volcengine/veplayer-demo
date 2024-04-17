import { useState } from 'react';
import { NavBar, SpinLoading } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import useUrlState from '@ahooksjs/use-url-state';
import type { IVideoData } from '../../interface';
import useAxios from 'axios-hooks';
import { API_PATH } from '../../api';
import VideoSwiper from './components/video-swiper';

import 'swiper/less';
import style from './index.module.less';
import '@volcengine/veplayer/index.min.css';

function Theater() {
  const [urlState] = useUrlState();
  const dramaId = urlState.id;
  const [{ data, loading }] = useAxios(
    {
      url: API_PATH.GetDramaEpisodeWithPlayAuthToken,
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
  const list: IVideoData[] = data?.result || [];
  const current: IVideoData = list?.[activeIndex];
  const episodeNumber = current?.episodeDetail?.episodeNumber;

  const back = () => navigate('/playlet/square/');
  return loading ? (
    <div className={style.loadingMask}>
      <div className={style.loadingBtn}>
        <div className={style.loadingIcon}>
          <SpinLoading style={{ '--size': '20px' }} />
        </div>
        <div className={style.loadingText}>加载中</div>
      </div>
    </div>
  ) : (
    <div className={style.wrap}>
      <NavBar className={style.head} left={episodeNumber ? `第${episodeNumber}集` : ''} onBack={back} />
      <VideoSwiper list={list} onChange={setActiveIndex} />
    </div>
  );
}

export default Theater;
