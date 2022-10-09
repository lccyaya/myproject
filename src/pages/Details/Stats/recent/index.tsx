import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { FormattedMessage } from 'umi';

import type * as matchService from '@/services/match';
import Ranking from './ranking';
import styles from './index.less';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';

const { TabPane } = Tabs;

interface IProps {
  data: {
    vs: matchService.TeamHistoryVSItemType[];
    home: matchService.TeamHistoryVSItemType[];
    away: matchService.TeamHistoryVSItemType[];
  };
}

const TabName = (props: { name: string }) => {
  return <div className={styles.tabName}>{<FormattedMessage id={props.name} />}</div>;
};

const Stats: React.FC<IProps> = (props) => {
  const { data } = props;
  const handleTabChange = (key: string) => {
    report({
      cate: REPORT_CATE.match_detail,
      action: REPORT_ACTION[`match_detail_tab4_${key}`],
    });
  };
  return (
    <div className={styles.recent}>
      <Tabs defaultActiveKey="h2h" onChange={handleTabChange}>
        <TabPane tab={<div className={styles.tabName}>H2H</div>} key="h2h">
          <Ranking data={data.vs} />
        </TabPane>
        <TabPane tab={<TabName name="key_home" />} key="home">
          <Ranking data={data.home} />
        </TabPane>
        <TabPane tab={<TabName name="key_away" />} key="away">
          <Ranking data={data.away} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Stats;
