import React from 'react';
import classnames from 'classnames';
import { Row, Col, Rate } from 'antd';
import { Link, useIntl } from 'umi';
import styles from './index.less';
import PiechartVertical from '../PiechartVertical';
import type { tipsType } from '@/services/home';
import win from '../../assets/tags/win.png';
import lose from '../../assets/tags/lose.png';
import draw from '../../assets/tags/draw.png';

import emptyLogo from '../../assets/emptyLogo.png';
import type { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { report } from '@/services/ad';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';

const resultType = {
  1: win,
  2: draw,
  3: lose,
};

const betType = {
  1: 'H',
  3: 'A',
};

export type TipsProps = {
  data: tipsType[];
  direction?: string;
  reportCate?: REPORT_CATE;
  reportAction?: REPORT_ACTION;
};

const HistoryTips: React.FC<TipsProps> = (props) => {
  const intl = useIntl()
  const { data, reportCate, reportAction } = props;
  const lang = toShortLangCode(locale.getLocale());
  const resultLang = {
    1: intl.formatMessage({id: 'key_win'}),
    2: intl.formatMessage({id: 'key_draw'}),
    3: intl.formatMessage({id: 'key_lose'}),
  }
  return (
    <div className={styles.historyTipsContainer}>
      {data.map((ele, i) => {
        const key = `key${i}`;
        const halfStar = Math.round(ele.confidence * 2 + 0.5) / 2;
        const total = ele.home_voted + ele.draw_voted + ele.away_voted;
        const pieData = {
          home_team_vote: ele.home_voted,
          total,
          draw_vote: ele.draw_voted,
          away_team_vote: ele.away_voted,
          away_odds: ele.away_odds,
          home_odds: ele.home_odds,
          draw_odds: ele.draw_odds,
        };

        const betValue = ele.bet_value > 0 ? `+${ele.bet_value}` : ele.bet_value;
        return (
          <Row className={styles.box} key={key}>
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
              {ele.result ? (
                <div className={styles.winOrLose} style={{backgroundImage: `url(${resultType[ele.result]})`}}>
                  {/* <img src={resultType[ele.result]} /> */}
                  <span>{resultLang[ele.result]}</span>
                </div>
              ) : null}
              <Row className={styles.tips}>
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
                      span={7}
                      className={classnames(
                        styles.tipsValue,
                        ele.bet_type === 3 ? styles.away : '',
                      )}
                    >
                      {`${betType[ele.bet_type] || ''} ${betValue}`}
                    </Col>
                    <Col span={3} className={styles.starNumber}>
                      {ele.confidence}
                    </Col>
                    <Col span={8} className={styles.starContainer}>
                      <Rate allowHalf value={halfStar} className={styles.star} disabled />
                    </Col>
                  </Row>
                  <Row className={styles.matchInfo}>
                    <Col span={2} className={styles.vs}>
                      VS
                    </Col>
                    <Col span={8} className={styles.opponent}>
                      <span className={styles.opponentText}>{ele.away_team_name}</span>
                    </Col>
                    <Col span={14} className={styles.match}>
                      <span className={styles.matchText}>{ele.competition_name}</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <PiechartVertical
                data={pieData}
                style={{ justifyContent: 'space-between', padding: '0 10px' }}
              />
            </Link>
          </Row>
        );
      })}
    </div>
  );
};
export default HistoryTips;
