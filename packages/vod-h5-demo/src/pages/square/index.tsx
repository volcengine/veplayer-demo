import { useCallback, useState, useRef } from 'react';
import { NavBar, Tabs, Grid } from 'antd-mobile';
import useAxios from 'axios-hooks';
import { useNavigate } from 'react-router-dom';
import { API_PATH } from '../../api';
import { Swiper, SwiperSlide, SwiperRef, SwiperClass } from 'swiper/react';
import DramaCard from '../../components/drama_card';
import { IDramaInfo } from '../../interface';
import { hasScrollbar } from '../../utils'
import Recommend from '../../components/recommend'

import style from './index.module.less';
import { useEffect } from 'react';
import { useUpdate } from '../theater/hooks';


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
  const [{ data }] = useAxios(
    {
      url: API_PATH.ListDrama,
      method: 'POST',
      data: {
        authorId: __AuthorId__,
        offset: 0,
        pageSize: 50,
      },
    },
    { manual: false },
  );

  const list: IDramaInfo[] = [...(data?.result || []), ...(data?.result || [])];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSliderMoving, setIsSliderMoving] = useState(false)
  const swiperRef = useRef<SwiperRef>();

  const navigate = useNavigate();
  const back = () => navigate('/');
  const update = useUpdate();

  const showFoot = hasScrollbar();

  useEffect(() => {
    update()
  }, [showFoot]);

  const isRecommendActive = activeIndex === 1;

  const onSwiperChange = useCallback (
    (swiper: SwiperClass) => {
      setActiveIndex(swiper.activeIndex)
      console.warn('>>>sliderchange', swiper.activeIndex)
    }, []
  )

  return (
    <div className={`${style.main} ${isRecommendActive ? style.recommendActive : style.recommendInactive}`}>
      <NavBar className={style.head} onBack={back}>
        <Tabs activeKey={tabs[activeIndex].key} onChange={(key) => {
          const index = tabs.findIndex((item) => item.key === key);
          setActiveIndex(index)
          swiperRef.current?.swiper.slideTo(index)
        }}>
          {tabs.map(item => (
            <Tabs.Tab title={item.title} key={item.key} />
          ))}
        </Tabs>
      </NavBar>
      <Swiper
        ref={swiperRef}
        defaultIndex={activeIndex}
        onActiveIndexChange={onSwiperChange}
        onSliderMove={() => setIsSliderMoving(true)}
        onTransitionEnd={() =>{
          console.log('onTransitionEnd')
          setIsSliderMoving(false)
        } }
      >
        <SwiperSlide>
          <div>
            <Grid className={style.content} columns={3} gap={8}>
              {list.map(item => (
                <Grid.Item>
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
            {
              showFoot && (
                <div className={style.foot}>
                  已展示全部资源
                </div>
              )
            }
          </div>
        </SwiperSlide>
        <SwiperSlide style={{height: '100vh'}}>
          <div className={style.recommend}>
            <Recommend isRecommend={true} isRecommendActive={isRecommendActive} isSliderMoving={isSliderMoving} />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default Square;
