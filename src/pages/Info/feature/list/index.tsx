import React from 'react';
import { Link } from 'umi';
import moment from 'moment';
import classnames from 'classnames';

import type { MatchDateFormatDataItem } from '../index';

import styles from './index.less';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { report } from '@/services/ad';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';

interface IProps {
  data: MatchDateFormatDataItem[];
}
const Ranking: React.FC<IProps> = (props) => {
  const { data } = props;
  const lang = toShortLangCode(locale.getLocale());
  return (
    <div className={styles.list}>
      {data.map((i) => (
        <div className={styles.item} key={i.key}>
          <div className={styles.date}>
            <span className={styles.day}>{i.day}</span>
            <span className={styles.divide}>/</span>
            <span className={styles.month}>{i.month}</span>
          </div>
          <div className={styles.content}>
            {i.data.map((d) => (
              <Link
                to={`/${lang}/details/${d.match_id}`}
                key={d.match_id}
                onClick={() => {
                  report({
                    cate: REPORT_CATE.info,
                    action: REPORT_ACTION.info_match_enter,
                  });
                }}
              >
                <div className={styles.matchItem}>
                  <span className={styles.time}>
                    {moment(new Date(d.match_time * 1000)).format('HH:mm')}
                  </span>
                  <div className={classnames(styles.team, styles.home)}>
                    <span className={styles.name}>{d.home_team_name}</span>
                    <img className={styles.logo} src={d.home_team_logo} />
                  </div>
                  <span className={styles.vs}>VS</span>
                  <div className={classnames(styles.team, styles.away)}>
                    <span className={styles.name}>{d.away_team_name}</span>
                    <img className={styles.logo} src={d.away_team_logo} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Ranking;
