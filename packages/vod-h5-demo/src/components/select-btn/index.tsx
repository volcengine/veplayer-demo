import React from 'react';
import Lottie from 'lottie-react';
import flowAnim from '@/assets/lottie/flow.json';

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
      {isActive && <Lottie className={style.icon} animationData={flowAnim} loop={true} />}
    </div>
  );
};

export default SelectBtn;
