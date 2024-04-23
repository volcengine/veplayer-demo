import style from './index.module.less';
import { featureList } from '@/page.tsx';
import SceneCard from './scene_card';
import BgImg from '@/assets/img/bg.png';
import useAxios from 'axios-hooks';
import { API_PATH } from '@/api';

function Home() {
  const [{ data: data1 }] = useAxios(
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
  const [{ data: data2 }] = useAxios(
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

  return (
    <>
      <div className={style.main}>
        <img className={style.bg} src={BgImg} alt="bg" />
        <div className={style.content}>
          <div className={style.title}>
            <div className={style.title_main}>视频点播</div>
            <div className={style.title_sub}>体验一站式视频解决方案</div>
          </div>
          {featureList.map(item => (
            <SceneCard key={item.key} icon={item.icon} name={item.name} jump={item.jump} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
