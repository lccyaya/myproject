import React from 'react';
import { Row, Col } from 'antd';
import { history } from 'umi';
import styles from './index.less';
import moment from 'moment';
import { getMatchStatus, getScore, MatchStatus } from '@/utils/match';

import type * as matchService from '@/services/match';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';

export type DetailCardProps = {
  data: matchService.MatchDetails;
};

const DetailCard: React.FC<DetailCardProps> = (props) => {
  const { data } = props;

  return (
    <div className={styles.cardContainer}>
      {/* <Row className={styles.head}>
        <Col className={styles.time} span={4}>
          {moment(new Date(data.match_time * 1000)).format('DD MMM HH:mm a')}
        </Col>
        <Col className={styles.match} span={16}>
          {data.competition_name}
        </Col>
      </Row> */}
      <Row className={styles.content}>
        <Col span={6}>
          <div className={styles.logoContainer}>
            <img onClick={() => {
              const lang = toShortLangCode(locale.getLocale());
              history.push(`/${lang}/teamdetails/${data.home_team_id}`);
            }} className={styles.logo} src={data.home_team_logo} />
            <div className={styles.text}>
              <span className={styles.textName}>{data.home_team_name}</span>
            </div>
          </div>
        </Col>
        <Col className={styles.center} span={12}>
          <div>
            <div className={styles.time}>
              {moment(new Date(data.match_time * 1000)).format('DD MMM HH:mm a')}
            </div>
            <div className={styles.vs}>
              {
                (getMatchStatus(data.status) === MatchStatus.Going || getMatchStatus(data.status) === MatchStatus.Complete) ? `${getScore(data.home_score)} : ${getScore(data.away_score)}` : 'VS'
              }
            </div>
            <div className={styles.name}>{data.competition_name}</div>
          </div>

        </Col>
        <Col span={6}>
          <div className={styles.logoContainer}>
            <img onClick={() => {
              const lang = toShortLangCode(locale.getLocale());
              history.push(`/${lang}/teamdetails/${data.away_team_id}`);
            }} className={styles.logo} src={data.away_team_logo} />
            <div className={styles.text}>
              <span className={styles.textName}>{data.away_team_name}</span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default DetailCard;
