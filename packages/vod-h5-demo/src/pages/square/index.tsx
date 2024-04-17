import { NavBar, Tabs, Grid } from 'antd-mobile';
import useAxios from 'axios-hooks';
import { API_PATH } from '../../api';
import { useNavigate } from 'react-router-dom';
import DramaCard from '../../components/drama_card';
import { IDramaInfo } from '../../interface';
import { hasScrollbar } from '../../utils'

import style from './index.module.less';
import { useEffect } from 'react';
import { useUpdate } from '../theater/hooks';


const tabs = [
  {
    title: '剧场',
    key: 'square',
  },
  // {
  //   title: '推荐',
  //   key: 'recommend',
  // },
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

  const navigate = useNavigate();
  const back = () => navigate('/');
  const update = useUpdate();

  const showFoot = hasScrollbar();

  useEffect(() => {
    update()
  }, [showFoot]);


  return (
    <div className={style.main}>
      <NavBar className={style.head} onBack={back}>
        <Tabs>
          {tabs.map(item => (
            <Tabs.Tab title={item.title} key={item.key} />
          ))}
        </Tabs>
      </NavBar>
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
  );
}

export default Square;
