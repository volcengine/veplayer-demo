import React, { useCallback } from 'react';
import { Ellipsis } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import PlayIcon from '../../assets/svg/play.svg?react';
import { Viewer } from '@volcengine/imagex-react';

import style from './index.module.less';

interface IDramaCardProps {
  dramaId: string;
  dramaTitle: string;
  coverUrl: string;
  totalEpisodeNumber: number;
  latestEpisodeNumber: number;
}

const imageSizes= [120, 200, 300, 400];

const DramaCard: React.FC<IDramaCardProps> = ({
  dramaId,
  coverUrl,
  dramaTitle,
  totalEpisodeNumber,
  latestEpisodeNumber,
}) => {
  const navigate = useNavigate();
  const desText =
    latestEpisodeNumber === totalEpisodeNumber ? `全${totalEpisodeNumber}集` : `更新至${latestEpisodeNumber}集`;
  const handleClick = useCallback(() => navigate(`/playlet/theater/?id=${dramaId}`), [dramaId, navigate]);

  return (
    <div className={style.card} onClick={handleClick}>
      <div className={style.content}>
        <div className={style.main}>
          {/*<img src={coverUrl} alt="" />*/}
          <Viewer
            className={style.img}
            layout="fill"
            placeholder="skeleton"
            src={coverUrl}
            imageSizes={imageSizes}
            loader={({ src, format, width }) => {
              const path = src.split('/');
              const finalPath = path.splice(1).join('/');
              return `//vod-demo-cover.volcimagex.cn/${finalPath}~tplv-j8hmcvvxia-resize:${width}:q75.${format}`}
            }
          />
          <div className={style.play_count}>
            <PlayIcon />
            <span>29.3w</span>
          </div>
        </div>
        <div className={style.foot}>
          <div className={style.title}>
            <Ellipsis content={dramaTitle} />
          </div>
          <div className={style.des}>{desText}</div>
        </div>
      </div>
    </div>
  );
};

export default DramaCard;
