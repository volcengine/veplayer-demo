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
