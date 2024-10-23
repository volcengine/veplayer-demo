/*
 * Copyright 2024 Beijing Volcano Engine Technology Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
import type { IVideoDataWithModel, IVideoModel } from '@/typings';

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
        videoModel: parseModel(item.videoModel) as IVideoModel,
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
      <VideoSwiper startTime={startTime} videoDataList={list} onChange={setActiveIndex} />
    </div>
  );
}

export default Theater;
