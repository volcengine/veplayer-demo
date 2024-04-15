import style from './index.module.less';
import { featureList } from '../../page.tsx';
import SceneCard from '../../components/scene_card';

function Home() {
  return (
    <>
      <div className={style.main}>
        <img
          className={style.bg}
          src="https://p6-addone-sign.byteimg.com/tos-cn-i-hhc0kcolqq/79f33e163e7749519dd8b0506d6d46fc.png~tplv-hhc0kcolqq-image.image?x-expires=2000452732&x-signature=hchC4bcYRGRLYFhoBf%2Fl7H0mqnE%3D"
          alt="bg"
        />
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
