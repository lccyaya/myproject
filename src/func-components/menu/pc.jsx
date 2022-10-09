import React, { useState } from 'react';
import { Menu } from 'antd';
import styles from './pc.module.less';

const menu = ({ 
  menus = [], onChange = () => {}, activeKey
}) => {
  const onClick = (key) => {
    onChange(key);
  }
  return <div className={styles.menu}>
    <Menu selectedKeys={activeKey + ''}>
      {menus.map((item, key) => <>
        <Menu.Item onClick={() => onClick(key)} key={item.param_value}>{item.label}</Menu.Item>
      </>)}
    </Menu>
  </div>
};

export default menu;


