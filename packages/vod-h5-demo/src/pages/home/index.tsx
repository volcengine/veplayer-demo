import style from './index.module.less';
import { featureList } from '../../page.tsx';
import SceneCard from '../../components/scene_card';
import BgImg from '../../assets/img/bg.png';
// import FbgImg from '../../assets/img/fbg.png';

function Home() {
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
            <SceneCard {...item} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
