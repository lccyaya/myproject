import React from 'react';
import { Spin } from 'antd';
import cls from 'classnames';
import styles from './pc.module.less';

const LoadingCom = ({ show, height, className }) => {
  return show === false ? null : <div style={{ height }} className={cls(styles.loading, className)}>
    <Spin spinning={true}/>
  </div>
};
export default LoadingCom;