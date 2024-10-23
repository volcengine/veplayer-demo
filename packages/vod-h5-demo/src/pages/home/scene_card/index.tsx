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

import React, { useCallback, cloneElement, ReactElement } from 'react';
import ArrowIcon from '@/assets/svg/arrow.svg?react';
import { useNavigate } from 'react-router-dom';

import style from './index.module.less';

interface ISceneCardProps {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string | undefined }>;
  name: string;
  jump: string;
}

const SceneCard: React.FC<ISceneCardProps> = ({ icon, name: featName, jump }) => {
  const navigate = useNavigate();
  const iconElement = cloneElement(icon({ title: 'icon', className: style.icon }) as ReactElement);
  const handleClick = useCallback(() => navigate(jump), [navigate, jump]);
  return (
    <div className={style.card}>
      <div className={style.content} onClick={handleClick}>
        <div className={style.info}>
          {iconElement}
          <div className={style.title}>{featName}</div>
        </div>
        <div className={style.jump}>
          <ArrowIcon className={style.jump} />
        </div>
      </div>
    </div>
  );
};

export default SceneCard;
