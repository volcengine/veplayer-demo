import React, { useState } from 'react';
import LikeIcon from '../../../../assets/svg/like.svg?react';
import LikeActiveIcon from '../../../../assets/svg/like-active.svg?react';
import FavIcon from '../../../../assets/svg/fav.svg?react';
import FavActiveIcon from '../../../../assets/svg/fav-active.svg?react';
import DIcon from '../../../../assets/svg/d.svg?react';
import { IVideoData } from '../../../../interface';

import style from './index.module.less';

interface ISliderItemProps {
  isTouching: boolean;
  isActive: boolean;
  data: IVideoData;
  index: number;
}

const SliderItem: React.FC<ISliderItemProps> = ({ isTouching, isActive, data }) => {
  const coverUrl = data.coverUrl;
  const episodeDesc = data.episodeDetail?.episodeDesc;
  const dramaTitle = data.episodeDetail?.dramaInfo?.dramaTitle;
  const totalEpisodeNumber = data.episodeDetail?.dramaInfo?.totalEpisodeNumber;
  const latestEpisodeNumber = data.episodeDetail?.dramaInfo?.latestEpisodeNumber;
  const [isLike, setIsLike] = useState<boolean>(true);
  const [isFav, setIsFav] = useState<boolean>(false);

  const bottomText = `观看完整短剧 · 全${totalEpisodeNumber}集`;

  return (
    <div className={style.wrapper}>
      <img src={coverUrl} className={isActive && !isTouching ? style.posterHide : style.posterShow} alt="poster" />
      <div className={style.right} onClick={e => e.stopPropagation()}>
        <div
          className={style.btnItem}
          onClick={e => {
            e.stopPropagation();
            setIsLike(!isLike);
            return false;
          }}
        >
          {isLike ? <LikeActiveIcon className={style.icon} /> : <LikeIcon className={style.icon} />}
          <div className={style.num}>10.2w</div>
        </div>
        <div
          className={style.btnItem}
          onClick={e => {
            e.stopPropagation();
            setIsFav(!isFav);
          }}
        >
          {isFav ? <FavActiveIcon className={style.icon} /> : <FavIcon className={style.icon} />}
          <div className={style.num}>66.3w</div>
        </div>
      </div>
      <div className={style.bottom}>
        <div className={style.title}>{dramaTitle}</div>
        <div className={style.des}>{episodeDesc}</div>
      </div>
    </div>
  );
};

// <div className={style.info}>
//   <div className={style.text}>
//     <DIcon className={style.icon} />
//     <div>{bottomText}</div>
//   </div>
//   <div className={style.btn}>连续看</div>
// </div>

export default SliderItem;
