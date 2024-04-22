import { useCallback, useState, useRef, useEffect } from 'react';
import { NavBar, Tabs, Grid } from 'antd-mobile';
import useAxios from 'axios-hooks';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide, SwiperRef, SwiperClass } from 'swiper/react';
import { API_PATH } from '@/api';
import DramaCard from './components/drama_card';
import SkeletonCard from './components/drama_card/skeleton_card.tsx';
import Recommend from './components/recommend';
import { hasScrollbar } from '@/utils';
import { useUpdate } from '@/hooks';

import type { IDramaInfo } from '@/typings';

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

  const list: IDramaInfo[] = data?.result || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSliderMoving, setIsSliderMoving] = useState(false);
  const [isProgressDragging, setProgressDragging] = useState(false);

  const swiperRef = useRef<SwiperRef>(null);

  const navigate = useNavigate();
  const back = () => navigate('/');
  const update = useUpdate();

  const showFoot = hasScrollbar();

  useEffect(() => {
    update();
  }, [showFoot, update, loading]);

  const isRecommendActive = activeIndex === 1;

  const onSwiperChange = useCallback((swiper: SwiperClass) => {
    setActiveIndex(swiper.activeIndex);
    if (swiper.activeIndex === 1) {
      window.scrollTo({ left: 0, top: 0 });
    }
  }, []);

  return (
    <div className={`${style.main} ${isRecommendActive ? style.recommendActive : style.recommendInactive}`}>
      <NavBar className={style.head} onBack={back}>
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
        <SwiperSlide style={{ height: '100vh' }}>
          <div className={style.recommend}>
            <Recommend
              isRecommend={true}
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
