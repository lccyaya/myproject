import React, { useEffect, useState } from 'react';
import { Tabs, Spin } from 'antd';
import { FormattedMessage, Link } from 'umi';
import styles from './index.less';

import * as matchService from '@/services/match';
import Ranking from './ranking';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';

const { TabPane } = Tabs;

interface IProps {
  matchId: number;
  match: matchService.MatchDetails;
  smallView?: boolean;
}
const Stats: React.FC<IProps> = (props) => {
  const { smallView, matchId } = props;
  const [loading, setLoading] = useState<boolean>(false);

  const [asia, setAsia] = useState<matchService.OddsCompanyType[]>([]);
  const [bs, setBS] = useState<matchService.OddsCompanyType[]>([]);
  const [eu, setEU] = useState<matchService.OddsCompanyType[]>([]);

  // const [allHistory, setAllHistory] = useState<matchService.TeamHistoryVSItemType[]>([]);
  // const [homeHistory, setHomeHistory] = useState<matchService.TeamHistoryVSItemType[]>([]);
  // const [awayHistory, setAwayHistory] = useState<matchService.TeamHistoryVSItemType[]>([]);

  const init = async () => {
    setLoading(true);
    const result = await matchService.fetchOdds({ match_id: props.matchId });
    setLoading(false);
    if (result.success) {
      const { data } = result;
      if (data) {
        if (data.asia) setAsia(data.asia);
        if (data.bs) setBS(data.bs);
        if (data.eu) setEU(data.eu);
      }
    }
  };

  const handleTabChange = (key: string) => {
    report({
      cate: REPORT_CATE.match_detail,
      action: REPORT_ACTION[`match_detail_tab2_${key}`],
    });
  };

  useEffect(() => {
    init();
  }, []);
  const lang = toShortLangCode(locale.getLocale());

  return (
    <Spin spinning={loading}>
      <div className={smallView ? styles.smallView : ''}>
        <Tabs
          defaultActiveKey="4"
          onChange={handleTabChange}
          tabBarExtraContent={
            smallView
              ? {
                  right: (
                    <Link className={styles.more} to={`/${lang}/details/${matchId}`}>
                      <div className={styles.text}>
                        <FormattedMessage id="key_more_details" />
                      </div>
                      <div className={styles.arrow} />
                    </Link>
                  ),
                }
              : {}
          }
        >
          <TabPane tab={<FormattedMessage id="key_1x2" />} key="1x2">
            <Ranking
              data={smallView ? eu.slice(0, 3) : eu}
              match={props.match}
              type="eu"
              matchId={props.matchId}
              smallView={smallView}
            />
          </TabPane>
          <TabPane tab={<FormattedMessage id="key_handicap" />} key="handicap">
            <Ranking
              data={smallView ? asia.slice(0, 3) : asia}
              match={props.match}
              type="asia"
              matchId={props.matchId}
              smallView={smallView}
            />
          </TabPane>
          <TabPane tab={<FormattedMessage id="key_over_under" />} key="ou">
            <Ranking
              data={smallView ? bs.slice(0, 3) : bs}
              match={props.match}
              type="bs"
              matchId={props.matchId}
              smallView={smallView}
            />
          </TabPane>
        </Tabs>
      </div>
    </Spin>
  );
};

export default Stats;
