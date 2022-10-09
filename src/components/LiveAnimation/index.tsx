import React, { useEffect, useState } from 'react';
import { useIntl, FormattedMessage, Link } from 'umi';
import redCard from '@/assets/timeline/redCard.svg';
import yellowCard from '@/assets/timeline/yellowCard.svg';
import Live from '@/components/Live';
import Timeline from '../Timeline';
import PieChart from '../piechart';
import styles from './index.less';
// import img from '../../assets/animation.png';
import { Row, Col } from 'antd';
import type { processStatsType, processInfo } from '@/services/home';
import * as homeService from '@/services/home';
import type { MatchDetails } from '@/services/match';
import * as matchUtils from '@/utils/match';
import * as matchService from '@/services/match';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { statesPrams } from '../../pages/Home';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';

interface animationProps {
  liveMatchId: number;
  match?: MatchDetails;
  immediately: boolean;
  hideLive?: boolean;
  hideAttackStatistics?: boolean;
  hideFoulStatistics?: boolean;
  italicTitle?: boolean;
  showMore?: boolean;
}

const Animation: React.FC<animationProps> = (props) => {
  // const { match } = props;

  // const stats = {
  //   21: 'ShotsOnTarget',
  //   22: 'ShotsOffTarget',
  //   25: 'Possession',
  //   23: 'Attack',
  //   24: 'DangerousAttack',
  //   2: 'Corner',
  // }
  const intl = useIntl();

  const [liveMatchInfo, setLiveMatchInfo] = useState<processInfo>({
    away_logo: '',
    home_logo: '',
    match_state: 0,
    start_time: 0,
  });
  const [liveIncidents, setLiveIncidents] = useState<homeService.incident[]>([]);
  const [liveMatchStats, setLiveMatchStats] = useState<processStatsType[]>([]);
  const [matchInfo, setMatchInfo] = useState<matchService.MatchDetails>(props.match!);

  let timeout: any;
  const getProcessMatch = async (id: number) => {
    const result = await homeService.getProcessData(id);
    if (result.success) {
      setLiveMatchInfo(result.data.info);
      setLiveIncidents(result.data.incidents);
      if (result.data.info && statesPrams[result.data.info.match_state] === 'going') {
        if (timeout) clearTimeout(timeout);
        if (timeout === -1) return;
        timeout = setTimeout(() => {
          getProcessMatch(props.liveMatchId);
        }, 5000);
      } else {
        clearTimeout(timeout);
      }
    }
    const fetchData = await homeService.getProcessStats(id);
    if (fetchData.success && fetchData.data.stats) {
      setLiveMatchStats(fetchData.data.stats);
    }
  };

  const getStats = (stats: number) => {
    const isStats = liveMatchStats.find((ele) => {
      return ele.type === stats;
    });
    return isStats || { home: 0, away: 0 };
  };

  const init = async () => {
    if (props.match) {
      return;
    }
    const result = await matchService.matchDetails({ match_id: +props.liveMatchId });
    if (result.success) {
      setMatchInfo(result.data);
    }
  };

  useEffect(() => {
    init();
    getProcessMatch(props.liveMatchId);
    return () => {
      timeout = -1;
      clearTimeout(timeout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const lang = toShortLangCode(locale.getLocale());
  return (
    <div className={styles.container}>
      {!props.hideLive &&
        matchInfo &&
        (matchInfo.has_live || matchInfo.has_live_animation || matchInfo.playback_link) && (
          <Live match={matchInfo} immediately={!!props.immediately} />
        )}
      <div className={styles.text}>
        <div className={props.italicTitle ? styles.italic : ''}>
          <FormattedMessage id="key_match_progress" />
        </div>
        {Boolean(props.showMore) && (
          <Link to={`/${lang}/details/${props.liveMatchId}`} className={styles.more}>
            <div className={styles.txt}>
              <FormattedMessage id="key_more_details" />
            </div>
            <div className={styles.arrow} />
          </Link>
        )}
      </div>
      {liveMatchInfo && <Timeline liveIncidents={liveIncidents} liveMatchInfo={liveMatchInfo} />}
      {!props.hideAttackStatistics && (
        <>
          <PieChart
            totalShots={{
              name: intl.formatMessage({ id: 'key_shots_on_target' }),
              params: getStats(21),
            }}
            corner={{
              name: intl.formatMessage({ id: 'key_shots_off_target' }),
              params: getStats(22),
            }}
            posession={{
              name: intl.formatMessage({ id: 'key_posession' }),
              params: getStats(25),
            }}
          />
          <PieChart
            totalShots={{ name: intl.formatMessage({ id: 'key_attack' }), params: getStats(23) }}
            corner={{
              name: intl.formatMessage({ id: 'key_dangerous_attack' }),
              params: getStats(24),
            }}
            posession={{ name: intl.formatMessage({ id: 'key_corner' }), params: getStats(2) }}
          />
        </>
      )}
      {!props.hideFoulStatistics && (
        <>
          <Row className={styles.cardContainer}>
            <Col span={3} className={styles.number}>
              {getStats(4).home}
            </Col>
            <Col span={18} className={styles.iconContainer}>
              <img src={redCard} />
            </Col>
            <Col span={3} className={styles.number}>
              {getStats(4).away}
            </Col>
          </Row>
          <Row className={styles.cardContainer}>
            <Col span={3} className={styles.number}>
              {getStats(3).home}
            </Col>
            <Col span={18} className={styles.iconContainer}>
              <img src={yellowCard} />
            </Col>
            <Col span={3} className={styles.number}>
              {getStats(3).away}
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};
export default Animation;
