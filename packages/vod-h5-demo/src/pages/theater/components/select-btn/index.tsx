import React from 'react';
import ActiveIcon from '@/assets/svg/active.svg?react';
import style from './index.module.less';

interface ISelectBtnProps {
  isActive: boolean;
  index: number;
  onClick: (...args: any) => any;
}

const SelectBtn: React.FC<ISelectBtnProps> = ({ isActive, index, onClick }) => {
  return (
    <div className={`${style.btn} ${isActive ? style.active : ''}`} onClick={onClick}>
      {index + 1}
      {isActive && <ActiveIcon className={style.icon} />}
    </div>
  );
};

export default SelectBtn;
