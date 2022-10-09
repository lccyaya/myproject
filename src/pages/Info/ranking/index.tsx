import React, { useEffect, useState } from 'react';
import { Tabs, Spin } from 'antd';

import type * as matchService from '@/services/match';
import * as competitionService from '@/services/competition';

import Ranking from '@/pages/Details/Stats/ranking';
import styles from './index.less';
import { FormattedMessage } from 'react-intl';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';

const { TabPane } = Tabs;

interface IProps {
  competitionId: number;
  hideLoading?: boolean;
  seasonId: number;
}
const Stats: React.FC<IProps> = (props) => {
  const { competitionId, hideLoading, seasonId } = props;
  const [loading, setLoading] = useState<boolean>(false);

  const [allRanking, setAllRanking] = useState<matchService.TeamRankingItemType[]>([]);
  const [homeRanking, setHomeRanking] = useState<matchService.TeamRankingItemType[]>([]);
  const [awayRanking, setAwayRanking] = useState<matchService.TeamRankingItemType[]>([]);

  const init = async (id: number, season_id?: number) => {
    setLoading(!hideLoading);
    const result = await competitionService.ranking({ competition_id: id, season_id });
    setLoading(false);
    if (result.success) {
      const { tables } = result.data;
      if (tables) {
        setAllRanking(tables.all || []);
        setHomeRanking(tables.home || []);
        setAwayRanking(tables.away || []);
      } else {
        setAllRanking([]);
        setHomeRanking([]);
        setAwayRanking([]);
      }
    }
  };

  const handleTabChange = (key: string) => {
    report({
      cate: REPORT_CATE.info,
      action: REPORT_ACTION.info_tab3 + key,
    });
  };

  useEffect(() => {
    if (!competitionId || !seasonId) return;
    init(competitionId, seasonId);
  }, [competitionId, seasonId]);

  return (
    <Spin spinning={loading}>
      <div className={styles.container}>
        <Tabs defaultActiveKey="4" onChange={handleTabChange}>
          <TabPane tab={<FormattedMessage id="key_league" />} key="rank">
            <Ranking data={allRanking} />
          </TabPane>
          <TabPane tab={<FormattedMessage id="key_home" />} key="home">
            <Ranking data={homeRanking} />
          </TabPane>
          <TabPane tab={<FormattedMessage id="key_away" />} key="away">
            <Ranking data={awayRanking} />
          </TabPane>
        </Tabs>
      </div>
    </Spin>
  );
};

export default Stats;
