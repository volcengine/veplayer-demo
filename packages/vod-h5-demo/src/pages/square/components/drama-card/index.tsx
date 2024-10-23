/*
 * Copyright 2024 Beijing Volcano Engine Technology Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { Ellipsis } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import PlayIcon from '@/assets/svg/play.svg?react';
import { Viewer } from '@volcengine/imagex-react';
import { useUpdate } from '@/hooks';

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
  }, [update]);

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
            loader={({ src, format, width }) => {
              const path = src.split('/');
              const finalPath = path.splice(1).join('/');
              return `${__IMAGEX_DOMAIN__}/${finalPath}~${__IMAGEX_TEMPLATE__}:${width}:q75.${format}`;
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
