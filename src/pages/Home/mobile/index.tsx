import SimpleTabs from '@/components/SimpleTabs';
import type { ConnectState } from '@/models/connect';
import Info from '@/pages/Info';
import { Spin } from 'antd';
import { NavBar } from 'antd-mobile';
import { useState } from 'react';
import { useSelector } from 'umi';
import styles from './index.less';
import VersionA from './version-a';
import VersionB from './version-b';

export default function MobileHome() {
  const abVersion = useSelector<ConnectState, ConnectState['abtest']['version']>(
    (state) => state.abtest.version,
  );
  const content = { A: <VersionA />, B: <VersionB />, '': null }[abVersion];
  const [tabkey, setTabkey] = useState('home');

  return (
    <Spin spinning={!abVersion}>
      <div className={styles.wrapper}>
        {/* {content} */}
        <SimpleTabs
          sticky
          activeKey={tabkey}
          theme="dark"
          className={styles.base_tab}
          list={[
            {
              key: 'home',
              title: '首页',
              node: <VersionA />,
            },
            {
              key: 'library',
              title: '资料库',
              node: (
                <Info id="info"/>
              ),
            },
          ]}
          onChange={setTabkey}
        />
      </div>
    </Spin>
  );
}
