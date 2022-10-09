import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { FormattedMessage } from 'umi';

import type * as matchService from '@/services/match';
import Ranking from './ranking';
import styles from './index.less';

const { TabPane } = Tabs;

interface IProps {
  data: {
    vs: matchService.TeamHistoryVSItemType[];
    home: matchService.TeamHistoryVSItemType[];
    away: matchService.TeamHistoryVSItemType[];
  };
}

const TabName = (props: { name: string }) => {
  return <div className={styles.tabName}><FormattedMessage id={props.name} /></div>;
};

const Stats: React.FC<IProps> = (props) => {
  const { data } = props;
  return (
    <div className={styles.recent}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="H2H" key="1">
          <Ranking data={data.vs} />
        </TabPane>
        <TabPane tab={<TabName name="key_home" />} key="2">
          <Ranking data={data.home} />
        </TabPane>
        <TabPane tab={<TabName name="key_away" />} key="3">
          <Ranking data={data.away} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Stats;
