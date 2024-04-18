import React, { PropsWithChildren, useState, MouseEvent } from 'react';
import LikeIcon from '../../../../assets/svg/like.svg?react';
import LikeActiveIcon from '../../../../assets/svg/like-active.svg?react';
import FavIcon from '@/assets/svg/fav.svg?react';
import FavActiveIcon from '../../../../assets/svg/fav-active.svg?react';
import DIcon from '../../../../assets/svg/d.svg?react';
import { IVideoData } from '../../../../interface';

import style from './index.module.less';
import { Viewer } from '@volcengine/imagex-react';
import { useNavigate } from 'react-router-dom';

interface ISliderItemProps extends PropsWithChildren {
  isTouching: boolean;
  isActive: boolean;
  data: IVideoData;
  index: number;
  isRecommend?: boolean;
  getCurrentTime: () => number;
}

const imageSizes = [600, 750, 800, 960];

const SliderItem: React.FC<ISliderItemProps> = ({ isActive, data, index, isRecommend, getCurrentTime, children }) => {
  const coverUrl = data.coverUrl;
  const episodeDesc = data.episodeDetail?.episodeDesc;
  const dramaTitle = data.episodeDetail?.dramaInfo?.dramaTitle;
  const totalEpisodeNumber = data.episodeDetail?.dramaInfo?.totalEpisodeNumber;
  const [isLike, setIsLike] = useState<boolean>(false);
  const [isFav, setIsFav] = useState<boolean>(false);

  const navigate = useNavigate();
  const bottomText = `观看完整短剧·全${totalEpisodeNumber}集`;

  const onBottomBtnClick = (e: MouseEvent) => {
    e.stopPropagation();
    const dramaId = data?.episodeDetail?.dramaInfo?.dramaId;
    const startTime = getCurrentTime();
    if (dramaId) {
      navigate(`/playlet/theater/?id=${dramaId}$startTime=${startTime}`);
    }
  };

  return (
    <div className={style.wrapper}>
      <div className={`${style.poster} ${isActive ? style.posterHide : style.posterShow}`}>
        <Viewer
          layout="fill"
          placeholder="skeleton"
          objectFit="cover"
          objectPosition="center"
          src={coverUrl}
          imageSizes={imageSizes}
          loader={({ src, format, width }) => {
            const path = src.split('/');
            const finalPath = path.splice(1).join('/');
            return `//vod-demo-cover.volcimagex.cn/${finalPath}~tplv-j8hmcvvxia-resize:${width}:q75.${format}`;
          }}
        />
      </div>
      <div id={`swiper-video-container-${index}`} className={style.videoContainer}>
        {children}
      </div>
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
      <div className={style.bottom} onClick={e => e.stopPropagation()}>
        <div className={style.title}>{dramaTitle}</div>
        <div className={style.des}>{episodeDesc}</div>
        {isRecommend && (
          <div className={style.info}>
            <div className={style.text}>
              <DIcon className={style.icon} />
              <div>{bottomText}</div>
            </div>
            <div onClick={onBottomBtnClick} className={style.btn}>
              连续看
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SliderItem;
