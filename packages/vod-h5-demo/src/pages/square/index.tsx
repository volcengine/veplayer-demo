import { useCallback, useState, useRef, useEffect } from 'react';
import VePlayer from '@/player';
import { NavBar, Tabs, Grid } from 'antd-mobile';
import useAxios from 'axios-hooks';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide, SwiperRef, SwiperClass } from 'swiper/react';
import { API_PATH } from '@/api';
import DramaCard from './components/drama_card';
import SkeletonCard from './components/drama_card/skeleton_card.tsx';
import Recommend from './components/recommend';
import { formatPreloadStreamList, hasScrollbar, os, parseModel } from '@/utils';
import { useUpdate } from '@/hooks';
import BackIconGray from '@/assets/svg/back_gray.svg?react';
import BackIcon from '@/assets/svg/back_v3.svg?react';

import type { IDramaInfo, IVideoDataWithModel } from '@/typings';

import style from './index.module.less';

const TheaterKey = 'square';
const RecommendKey = 'recommend';

const tabs = [
  {
    title: '剧场',
    key: TheaterKey,
  },
  {
    title: '推荐',
    key: RecommendKey,
  },
];

function PreloadDramaId(props: { dramaId: string }) {
  useAxios(
    {
      url: API_PATH.GetDramaEpisodeWithVideoModel,
      method: 'POST',
      data: {
        authorId: __AuthorId__,
        needSsl: true,
        dramaId: props.dramaId,
        offset: 0,
        pageSize: 50,
      },
    },
    { useCache: true },
  );
  return null;
}

function Square() {
  const [{ data, loading }] = useAxios(
    {
      url: API_PATH.ListDrama,
      method: 'POST',
      data: {
        authorId: __AuthorId__,
        offset: 0,
        pageSize: 50,
      },
    },
    { useCache: true },
  );

  const [{ data: recData, loading: recLoading }] = useAxios(
    {
      url: API_PATH.GetEpisodeFeedStreamWithVideoModel,
      method: 'POST',
      data: {
        authorId: __AuthorId__,
        needSsl: true,
        offset: 0,
        pageSize: 50,
      },
    },
    { useCache: true },
  );

  const list: IDramaInfo[] = data?.result || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSliderMoving, setIsSliderMoving] = useState(false);
  const [isProgressDragging, setProgressDragging] = useState(false);

  const swiperRef = useRef<SwiperRef>(null);
  const preloadOnceRef = useRef<boolean>(false);

  const navigate = useNavigate();
  const back = () => navigate('/');
  const update = useUpdate();

  const showFoot = hasScrollbar();

  useEffect(() => {
    update();
  }, [showFoot, update, loading]);

  useEffect(() => {
    // PC&Android开启预加载
    if (!recLoading && recData?.result && (os.isPc || os.isAndroid) && !preloadOnceRef.current && activeIndex === 0) {
      // 预加载前6个视频第一集
      const list: IVideoDataWithModel[] = recData.result
        .map((item: any) => ({
          ...item,
          videoModel: parseModel(item.videoModel),
        }))
        .filter((item: IVideoDataWithModel) => item?.videoModel?.PlayInfoList?.[0]?.MainPlayUrl);
      VePlayer.preloader?.clearPreloadList(); // 切换模式前清空预加载列表
      VePlayer.setPreloadScene(0); // 更新为手动模式，注意：手动模式下直接全量加载所有待预加载资源
      VePlayer.setPreloadList(formatPreloadStreamList(list.slice(0, 6))); // 设置手动模式待预加载列表
      preloadOnceRef.current = true;
      console.log('Page Square resetPreloadList and setPreloadScene=0');
    }
  }, [recData, recLoading, activeIndex]);

  const isRecommendActive = activeIndex === 1;

  const onSwiperChange = useCallback((swiper: SwiperClass) => {
    setActiveIndex(swiper.activeIndex);
    if (swiper.activeIndex === 1) {
      window.scrollTo({ left: 0, top: 0 });
    }
  }, []);

  return (
    <div className={`${style.main} ${isRecommendActive ? style.recommendActive : style.recommendInactive}`}>
      <NavBar backArrow={isRecommendActive ? <BackIcon /> : <BackIconGray />} className={style.head} onBack={back}>
        <Tabs
          activeLineMode="fixed"
          activeKey={tabs[activeIndex].key}
          onChange={key => {
            const index = tabs.findIndex(item => item.key === key);
            setActiveIndex(index);
            swiperRef.current?.swiper.slideTo(index);
          }}
        >
          {tabs.map(item => (
            <Tabs.Tab title={item.title} key={item.key} />
          ))}
        </Tabs>
      </NavBar>
      <Swiper
        ref={swiperRef}
        onActiveIndexChange={onSwiperChange}
        onSliderMove={() => setIsSliderMoving(true)}
        allowSlideNext={activeIndex !== 1}
        allowSlidePrev={activeIndex !== 0 && activeIndex === 1 && !isProgressDragging}
        onTransitionEnd={() => {
          setIsSliderMoving(false);
        }}
      >
        <SwiperSlide>
          <div>
            <Grid className={style.content} columns={3} gap={[8, 16]}>
              {loading
                ? new Array(9).fill(1).map((item, index) => (
                    <Grid.Item key={index}>
                      <SkeletonCard />
                    </Grid.Item>
                  ))
                : list.map((item, index) => (
                    <Grid.Item key={index}>
                      {index < 9 ? <PreloadDramaId dramaId={item.dramaId} /> : null}
                      <DramaCard
                        dramaId={item.dramaId}
                        dramaTitle={item.dramaTitle}
                        coverUrl={item.coverUrl}
                        totalEpisodeNumber={item.totalEpisodeNumber}
                        latestEpisodeNumber={item.latestEpisodeNumber}
                      />
                    </Grid.Item>
                  ))}
            </Grid>
            {showFoot && <div className={style.foot}>已展示全部资源</div>}
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={style.recommend}>
            <Recommend
              isRecommend={true}
              recData={recData}
              recLoading={recLoading}
              isRecommendActive={isRecommendActive}
              isSliderMoving={isSliderMoving}
              onProgressDrag={() => setProgressDragging(true)}
              onProgressDragend={() => setProgressDragging(false)}
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default Square;
