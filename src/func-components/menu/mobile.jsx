import React, { useState } from 'react';
import { Tabs, Button } from 'antd';
import styles from './mobile.module.less';
import cls from 'classnames';

const menu = ({ 
  menus = [], onChange = () => {}, children, className, operations
}) => {
  // operations = <Button>Extra Action</Button>;
  const [active, setActive] = useState('0');
  const onClick = (e) => {
    onChange(menus[+e]);
    setActive(e);
  }
  return <div className={cls(styles.menu, className)}>
     {/* onTabClick={onClick} */}
    <Tabs 
        activeKey={active} className={styles.navTab} onChange={onClick}
        style={{ position: 'sticky', top: '92px' }} tabBarExtraContent={operations}
    >
        {menus.map((item, key) => (
            <Tabs.TabPane tab={item.label} key={key} />
        ))}
    </Tabs>
    {children}
  </div>
};

export default menu;




