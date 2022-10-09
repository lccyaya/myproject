import styles from './pc.module.less';
import { Tabs } from 'antd';
import { COUPON_TYPE } from '@/constants/index';
import React, { useState } from 'react';
import Unused from './unused/pc';
import Expired from './expired/pc';
import Used from './used/pc';

const TabPane = Tabs.TabPane;
const MyCoupon = () => {
  const [type, setType] = useState(COUPON_TYPE.UNUSED);
  return (
    <div className={styles.tabs_wrap}>
      <Tabs
        activeKey={type}
        onChange={(val) => {
          setType(val);
        }}
      >
        <TabPane tab="未使用" key={COUPON_TYPE.UNUSED}>
          <div className={styles.content}>
            <Unused />
          </div>
        </TabPane>
        <TabPane tab="已使用" key={COUPON_TYPE.USED}>
          <div className={styles.content}>
            <Used />
          </div>
        </TabPane>
        <TabPane tab="已过期" key={COUPON_TYPE.EXPIRED}>
          <div className={styles.content}>
            <Expired />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};
export default MyCoupon;
