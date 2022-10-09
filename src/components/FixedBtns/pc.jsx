import styles from './pc.module.less';
import { BackTop } from 'antd';
import IconFont from '@/components/IconFont';
import React, { useState } from 'react';
import classNames from 'classnames';
import FeedBack from '@/components/FeedBack/pc';

const Sidebar = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.sidebar}>
      <BackTop className={classNames(styles.back)} visibilityHeight={200}>
        <div>
          <div className={styles.sidebar_item}>
            <IconFont className={styles.icon} type="icon-huidingbu" size={22} />
          </div>
          <div
            className={styles.space}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          <div
            className={styles.sidebar_item}
            onClick={(e) => {
              e.stopPropagation();
              setVisible(true);
            }}
          >
            <IconFont className={styles.icon} type="icon-yijianfankui" size={22} />
          </div>
        </div>
      </BackTop>
      <FeedBack visible={visible} setVisible={setVisible} />
    </div>
  );
};
export default Sidebar;
