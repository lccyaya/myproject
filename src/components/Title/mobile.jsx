import React from 'react';
import IconFont from '@/components/IconFont';
import styles from './mobile.module.less';
import cls from 'classnames';
export default function Title({ title, className, onClick = () => {}, theme = 'light' }) {
  return (
    <div className={cls(styles.header, className, styles[theme])}>
      <div className={styles.title}>{title}</div>
      <div className={styles.more} onClick={onClick}>
        查看更多
        <IconFont type="icon-jiantouyou" />
      </div>
    </div>
  );
}
