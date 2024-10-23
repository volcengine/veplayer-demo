import { Skeleton } from 'antd-mobile';

import style from './index.module.less';

const SkeletonCard = () => {
  return (
    <div className={style.card}>
      <div className={style.content}>
        <Skeleton animated className={style.main} />
        <div className={style.footSkelet}>
          <Skeleton.Paragraph lineCount={2} animated />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
