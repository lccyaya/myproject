import React, { useState } from 'react';
import { Row, Col, message, } from 'antd';
import { Link } from 'umi';
import styles from './index.less';
import classnames from 'classnames';
import moment from 'moment';
import * as matchUtils from '@/utils/match';
import * as homeService from '@/services/home';
import Icon from '@ant-design/icons';
import PopupLogin from '@/components/PopupLogin';
import { getMatchStatus, MatchStatus } from '@/utils/match';

import { ReactComponent as NoSubscribe } from '@/assets/stats/de_subscribe.svg';
import { ReactComponent as Subscribed } from '@/assets/stats/de_subscribed.svg';

import type * as matchService from '@/services/match';
import type { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { report } from '@/services/ad';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import Notification from '@/components/Notification';
import { useIntl } from 'umi';

export type DetailCardProps = {
  data: matchService.MatchDetails;
  matchId: number;
  reportCate?: REPORT_CATE;
  reportAction?: REPORT_ACTION;
};

const DetailCard: React.FC<DetailCardProps> = (props) => {
  const intl = useIntl()
  const { data, matchId, reportCate, reportAction } = props;
  const [isSubscribed, setIsSubscribed] = useState<boolean>(data.is_subscribed);
  const [notificationVisible, setNotificationVisible] = useState(false);

  const { status } = data;

  const matchStatus = matchUtils.getMatchStatus(status);

  const handleSubscribe = async () => {
    if (isSubscribed) {
      const result = await homeService.cancelSubscribe(+matchId);
      if (result.success) {
        setIsSubscribed(false);
        message.success(intl.formatMessage({id: "key_unsubscribed"}));
      } else {
        message.error(result.message || 'Request Error');
      }
    } else {
      setNotificationVisible(true);
      const result = await homeService.setSubscribe(+matchId);
      if (result.success) {
        setIsSubscribed(true);
        message.success(intl.formatMessage({id: "key_subscribed"}));
      } else {
        message.error(result.message || 'Request Error');
      }
      if (reportCate && reportAction) {
        report({
          action: reportAction,
          cate: reportCate,
        });
      }
    }
  };

  const homeScore = matchUtils.getScore(data.home_score);
  const awayScore = matchUtils.getScore(data.away_score);
  const lang = toShortLangCode(locale.getLocale());
  return (
    <div className={styles.cardContainer}>
      <Notification
        visible={notificationVisible}
        onCancel={() => setNotificationVisible(false)}
        onOk={() => setNotificationVisible(false)}
      />
      {
        getMatchStatus(data.status) === MatchStatus.Before && (
          <div className={styles.iconWrapper}>
            <PopupLogin
              onLogin={handleSubscribe}
            >
              <Icon
                className={isSubscribed ? styles.iconed : styles.icon}
                component={isSubscribed ? Subscribed : NoSubscribe}
              />
            </PopupLogin>

          </div>
        )
      }

      <Row className={styles.head}>
        <Col className={styles.time} span={4}>
          {moment(new Date(data.match_time * 1000)).format('DD MMM HH:mm a')}
        </Col>
        <Col className={styles.match} span={16}>
          {data.competition_name}
        </Col>
      </Row>
      <Row className={styles.content}>
        <Col span={11}>
          <div className={classnames(styles.logoContainer, styles.left)}>
            <Link to={`/${lang}/teamdetails/${data.home_team_id}`}>
              <img className={styles.logo} src={data.home_team_logo} />
            </Link>
            <div className={styles.text}>
              <span className={styles.textName}>{data.home_team_name}</span>
            </div>
          </div>
        </Col>
        <Col className={styles.vs} span={2}>
          {matchStatus !== matchUtils.MatchStatus.Before ? `${homeScore}:${awayScore}` : 'VS'}
        </Col>
        <Col span={11}>
          <div className={classnames(styles.logoContainer, styles.right)} style={{ float: 'right' }}>
            <Link to={`/${lang}/teamdetails/${data.away_team_id}`}>
              <img className={styles.logo} src={data.away_team_logo} />
            </Link>
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
