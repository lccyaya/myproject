import styles from './mobile.module.less';
import Coupon from '@/components/Coupon/mobile';
import { Spin, Tabs } from 'antd';
import { COUPON_TYPE } from '@/constants/index';
import React, { useState } from 'react';
import Unused from './unused/mobile';
import Expired from './expired/mobile';
import Used from './used/mobile';
const TabPane = Tabs.TabPane;
const MyCoupon = () => {
  const [type, setType] = useState(COUPON_TYPE.UNUSED);

  return (
    <div className={styles.tabs_wrap}>
      <Tabs onChange={setType} activeKey={type}>
        <TabPane tab="未使用" key={COUPON_TYPE.UNUSED}>
          <Unused />
        </TabPane>
        <TabPane tab="已使用" key={COUPON_TYPE.USED}>
          <Used />
        </TabPane>
        <TabPane tab="已过期" key={COUPON_TYPE.EXPIRED}>
          <Expired />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default MyCoupon;
