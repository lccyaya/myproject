import React from 'react';
import IconFont from '@/components/IconFont';
import styles from './index.less';
import cls from 'classnames';
export default function Title({ title, className, onClick = () => {} }) {
  return (
    <div className={cls(styles.header, className)}>
      <div className={styles.title}>{title}</div>
      <div className={styles.more} onClick={onClick}>
        查看更多
        <IconFont type="icon-jiantouyou" />
      </div>
    </div>
  );
}
