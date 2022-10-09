import React, { useEffect, useState } from 'react';
import { Tabs, Spin } from 'antd';
import { FormattedMessage } from 'umi';

import * as matchService from '@/services/match';
import Ranking from './ranking';
import RecentGames from './recent';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';

const { TabPane } = Tabs;

interface IProps {
  matchId: number;
  match: matchService.MatchDetails;
}
const Stats: React.FC<IProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [allRanking, setAllRanking] = useState<matchService.TeamRankingItemType[]>([]);
  const [homeRanking, setHomeRanking] = useState<matchService.TeamRankingItemType[]>([]);
  const [awayRanking, setAwayRanking] = useState<matchService.TeamRankingItemType[]>([]);

  const [allHistory, setAllHistory] = useState<matchService.TeamHistoryVSItemType[]>([]);
  const [homeHistory, setHomeHistory] = useState<matchService.TeamHistoryVSItemType[]>([]);
  const [awayHistory, setAwayHistory] = useState<matchService.TeamHistoryVSItemType[]>([]);

  const init = async () => {
    setLoading(true);
    const result = await matchService.fetchRankingList({ match_id: props.matchId });
    setLoading(false);
    if (result.success) {
      const { tables, history } = result.data;
      if (tables) {
        if (tables.all) setAllRanking(tables.all);
        if (tables.home) setHomeRanking(tables.home);
        if (tables.away) setAwayRanking(tables.away);
      }
      if (history) {
        if (history.vs) setAllHistory(history.vs);
        if (history.home) setHomeHistory(history.home);
        if (history.away) setAwayHistory(history.away);
      }
    }
  };

  const handleTabChange = (key: string) => {
    report({
      cate: REPORT_CATE.match_detail,
      action: REPORT_ACTION[`match_detail_tab3_${key}`],
    });
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Spin spinning={loading}>
      <div>
        <Tabs defaultActiveKey="rank" onChange={handleTabChange}>
          <TabPane tab={<FormattedMessage id="key_league_ranking" />} key="rank">
            <Ranking match={props.match} data={allRanking} />
          </TabPane>
          <TabPane tab={<FormattedMessage id="key_home_team" />} key="home">
            <Ranking match={props.match} data={homeRanking} />
          </TabPane>
          <TabPane tab={<FormattedMessage id="key_away_team" />} key="away">
            <Ranking match={props.match} data={awayRanking} />
          </TabPane>
          <TabPane tab={<FormattedMessage id="key_recent_games" />} key="recent">
            <RecentGames data={{ vs: allHistory, home: homeHistory, away: awayHistory }} />
          </TabPane>
        </Tabs>
      </div>
    </Spin>
  );
};

export default Stats;
