import React, { useCallback, useEffect, useRef } from 'react';
import { Ellipsis } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import PlayIcon from '../../assets/svg/play.svg?react';
import { Viewer } from '@volcengine/imagex-react';
import { useUpdate } from '../../hooks';

import style from './index.module.less';

interface IDramaCardProps {
  dramaId: string;
  dramaTitle: string;
  coverUrl: string;
  totalEpisodeNumber: number;
  latestEpisodeNumber: number;
}

const imageSizes = [120, 200, 300, 400];

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

  const update = useUpdate();
  const numRef = useRef('');

  useEffect(() => {
    numRef.current = (Math.random() * 50 + 10).toFixed(1);
    update();
    console.log('dram', numRef.current);
  }, []);

  return (
    <div className={style.card} onClick={handleClick}>
      <div className={style.content}>
        <div className={style.main}>
          <Viewer
            className={style.img}
            layout="responsive"
            objectFit="cover"
            objectPosition="center"
            placeholder="skeleton"
            src={coverUrl}
            imageSizes={imageSizes}
            loader={({ extra }) => {
              // const path = src.split('/');
              // const finalPath = path.splice(1).join('/');
              // return `${__IMAGEX_DOMAIN__}/${finalPath}~${__IMAGEX_TEMPLATE__}:${width}:q75.${format}`;
              return extra.origin.replace(/^http:/, 'https:');
            }}
          ></Viewer>
          <div className={style.mask} />
          <div className={style.play_count}>
            <PlayIcon />
            <span>{`${numRef.current}w`}</span>
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
