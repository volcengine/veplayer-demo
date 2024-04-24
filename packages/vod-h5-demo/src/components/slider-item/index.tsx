import React, { PropsWithChildren, useState, MouseEvent, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Viewer } from '@volcengine/imagex-react';
import LikeIcon from '@/assets/svg/like.svg?react';
import LikeActiveIcon from '@/assets/svg/like-active.svg?react';
import FavIcon from '@/assets/svg/fav.svg?react';
import FavActiveIcon from '@/assets/svg/fav-active.svg?react';
import DIcon from '@/assets/svg/d.svg?react';

import { IVideoDataWithModel } from '@/typings';

import style from './index.module.less';

interface ISliderItemProps extends PropsWithChildren {
  isActive: boolean;
  activeIndex: number;
  data: IVideoDataWithModel;
  index: number;
  isRecommend?: boolean;
  getCurrentTime: () => number;
  playNextStatus: string;
}

const imageSizes = [600, 750, 800, 960];

const SliderItem: React.FC<ISliderItemProps> = ({
  isActive,
  activeIndex,
  data,
  index,
  isRecommend,
  getCurrentTime,
  children,
  playNextStatus,
}) => {
  const coverUrl = data?.videoModel?.PosterUrl ?? data?.coverUrl;
  const episodeDesc = data.episodeDetail?.episodeDesc;
  const dramaTitle = data.episodeDetail?.dramaInfo?.dramaTitle;
  const totalEpisodeNumber = data.episodeDetail?.dramaInfo?.totalEpisodeNumber;
  const episodeNumber = data.episodeDetail?.episodeNumber;
  const [isLike, setIsLike] = useState<boolean>(false);
  const [isFav, setIsFav] = useState<boolean>(false);

  const navigate = useNavigate();
  const bottomText = `观看完整短剧 · 全${totalEpisodeNumber}集`;

  const favNumRef = useRef('');
  const likeNumRef = useRef('');

  useEffect(() => {
    favNumRef.current = (Math.random() * 50 + 50).toFixed(1);
    likeNumRef.current = (Math.random() * 50 + 10).toFixed(1);
  }, []);

  const onBottomBtnClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      const dramaId = data?.episodeDetail?.dramaInfo?.dramaId;
      const startTime = getCurrentTime();
      if (dramaId) {
        navigate(`/playlet/theater/?id=${dramaId}&startTime=${startTime}`);
      }
    },
    [data?.episodeDetail?.dramaInfo?.dramaId, getCurrentTime, navigate],
  );

  // 距离当前两集加载，减少dom数目
  const shouldRenderContent = useMemo(() => Math.abs(activeIndex - index) <= 2, [activeIndex, index]);
  return (
    <div className={style.wrapper}>
      {shouldRenderContent && (
        <>
          <div
            className={`${style.poster} ${isActive && playNextStatus === 'end' ? style.posterHide : style.posterShow}`}
          >
            <Viewer
              layout="raw"
              placeholder="skeleton"
              objectFit="cover"
              objectPosition="center"
              loading="eager"
              src={coverUrl}
              imageSizes={imageSizes}
              loader={({ src, format, width }) => {
                const path = src.split('/');
                const finalPath = path.splice(1).join('/');
                return `${__IMAGEX_DOMAIN__}/${finalPath}~${__IMAGEX_TEMPLATE__}:${width}:q75.${format}`;
              }}
            />
          </div>
          <div id={`swiper-video-container-${index}`} className={style.videoContainer}>
            <div className="veplayer-cus-gradient-wrapper" />
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
              <div className={style.num}>{`${likeNumRef.current}w`}</div>
            </div>
            <div
              className={style.btnItem}
              onClick={e => {
                e.stopPropagation();
                setIsFav(!isFav);
              }}
            >
              {isFav ? <FavActiveIcon className={style.icon} /> : <FavIcon className={style.icon} />}
              <div className={style.num}>{`${favNumRef.current}w`}</div>
            </div>
          </div>
          <div className={style.bottom} onClick={e => e.stopPropagation()}>
            <div className={style.title}>{dramaTitle}</div>
            <div className={style.des}>
              {isRecommend && episodeNumber ? (
                <>
                  {`第${episodeNumber}集`}
                  <span className={style.split} />
                  {episodeDesc}
                </>
              ) : (
                episodeDesc
              )}
            </div>
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
        </>
      )}
    </div>
  );
};

export default SliderItem;
