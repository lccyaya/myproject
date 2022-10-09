import React from 'react';
import styles from './pc.module.less';
import Menu from '@/func-components/menu/pc';

const Content = ({ children, menus = [], onChange, activeKey }) => {
  return <div className={styles.content}>
    <div className={styles.left}>
      <Menu activeKey={activeKey} menus={menus} onChange={(key) => {
        onChange(menus[key]);
      }}/>
    </div>
    <div className={styles.right}>
      {children}
    </div>
  </div>;
};


export default Content;
