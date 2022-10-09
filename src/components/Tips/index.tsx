import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import { Row, Col, Rate } from 'antd';
import { Link } from 'umi';
import styles from './index.less';
import type { tipsType } from '@/services/home';
import emptyLogo from '../../assets/emptyLogo.png';
import type { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { report } from '@/services/ad';
import { checkIsPhone } from '@/utils/utils';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';

interface TipsProps {
  data: tipsType[];
  direction?: string;
  isPhone?: boolean;
  reportCate?: REPORT_CATE;
  reportAction?: REPORT_ACTION;
}

const betType = {
  1: 'H',
  2: 'D',
  3: 'A',
};

const Tips: React.FC<TipsProps> = (props) => {
  const { data, direction, reportCate, reportAction } = props;
  const isPhone = checkIsPhone();
  const lang = toShortLangCode(locale.getLocale());
  return (
    <div
      className={styles.tipsContainer}
      style={
        direction === 'horizental'
          ? {
              display: 'flex',
              flexWrap: 'wrap',
            }
          : {}
      }
    >
      {data.map((ele, i) => {
        const key = `tips-${i}`;
        const halfStar = Math.round(ele.confidence * 2 + 0.5) / 2;
        // const isThree = i % 3;
        const betValue = ele.bet_value > 0 ? `+${ele.bet_value}` : ele.bet_value;
        return (
          <Row
            className={classnames(
              styles.tips,
              isPhone ? '' : direction === 'horizental' ? styles.horizental : '',
            )}
            key={key}
          >
            <Link
              to={`/${lang}/details/${ele.match_id}`}
              style={{ width: '100%' }}
              onClick={() => {
                if (reportCate && reportAction) {
                  report({
                    cate: reportCate,
                    action: reportAction,
                  });
                }
              }}
            >
              <Row>
                <Col span={6} className={styles.nameContainer}>
                  <div className={styles.logoContainer}>
                    <img className={styles.logo} src={ele.home_team_logo || emptyLogo} />
                  </div>
                  <div className={styles.name}>
                    <span className={styles.nameText}>{ele.home_team_name}</span>
                  </div>
                </Col>
                <Col span={18} className={styles.info}>
                  <Row className={styles.tipsInfo}>
                    <Col
                      span={6}
                      className={classnames(
                        styles.tipsValue,
                        ele.bet_type === 3 ? styles.away : ele.bet_type === 2 ? styles.drawn : '',
                      )}
                    >
                      {`${betType[ele.bet_type] || ''} ${betValue}`}
                    </Col>
                    <Col span={3} className={styles.starNumber}>
                      {ele.confidence}
                    </Col>
                    <Col span={6} className={styles.starContainer}>
                      <Rate allowHalf defaultValue={halfStar} className={styles.star} disabled />
                    </Col>
                    <Col span={9} className={styles.time}>
                      {moment(new Date(ele.match_time * 1000)).format('MM/DD HH:mm')}
                    </Col>
                  </Row>
                  <Row className={styles.matchInfo}>
                    <Col span={3} className={styles.vs}>
                      VS
                    </Col>
                    <Col span={8} className={styles.opponent}>
                      <span className={styles.opponentText}>{ele.away_team_name}</span>
                    </Col>
                    <Col span={13} className={styles.match}>
                      <span className={styles.matchText}>{ele.competition_name}</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Link>
          </Row>
        );
      })}
    </div>
  );
};
// export default Tips;
export default connect(({ divice }: ConnectState) => ({
  isPhone: divice.isPhone,
}))(Tips);
