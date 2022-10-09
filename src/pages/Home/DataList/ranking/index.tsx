import React, { useEffect, useState } from 'react';
import { Tabs, Spin } from 'antd';
import type * as matchService from '@/services/match';
import * as competitionService from '@/services/competition';
import { useIntl } from 'umi';
import Ranking from '@/pages/Details/Stats/ranking';
import styles from './index.less';

const { TabPane } = Tabs;

interface IProps {
  competitionId: number;
  loading?: boolean;
}
const Stats: React.FC<IProps> = (props) => {
  const intl = useIntl();

  const { competitionId } = props;

  const [loading, setLoading] = useState<boolean>(false);

  const [allRanking, setAllRanking] = useState<matchService.TeamRankingItemType[]>([]);
  const [homeRanking, setHomeRanking] = useState<matchService.TeamRankingItemType[]>([]);
  const [awayRanking, setAwayRanking] = useState<matchService.TeamRankingItemType[]>([]);

  const init = async (id: number) => {
    if (props.loading) {
      setLoading(true);
    }
    const result = await competitionService.ranking({ competition_id: id });
    setLoading(false);
    if (result.success) {
      const { tables } = result.data;
      if (tables) {
        if (tables.all) setAllRanking(tables.all);
        if (tables.home) setHomeRanking(tables.home);
        if (tables.away) setAwayRanking(tables.away);
      }
    }
  };

  useEffect(() => {
    if (!competitionId) return;
    init(competitionId);
  }, [competitionId]);

  return (
    <Spin spinning={loading}>
      <div className={styles.container}>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={intl.formatMessage({
              id: 'key_league',
            })}
            key="1"
          >
            <Ranking size="small" data={allRanking} />
          </TabPane>
          <TabPane
            tab={intl.formatMessage({
              id: 'key_home',
            })}
            key="2"
          >
            <Ranking size="small" data={homeRanking} />
          </TabPane>
          <TabPane
            tab={intl.formatMessage({
              id: 'key_away',
            })}
            key="3"
          >
            <Ranking size="small" data={awayRanking} />
          </TabPane>
        </Tabs>
      </div>
    </Spin>
  );
};

export default Stats;
