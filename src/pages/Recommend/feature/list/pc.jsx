import React from 'react';
import { Link } from 'umi';
import moment from 'moment';
import classnames from 'classnames';

import styles from './pc.module.less';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { handleReport } from '@/utils/report';
import EmptyLogo from '@/assets/emptyLogo.png';

const Ranking = (props) => {
  const { data } = props;
  const lang = toShortLangCode(locale.getLocale());
  const handleClick = () => {
    handleReport({
      action: 'match_enter',
    });
  };
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
                to={`/${lang}/details/${d.match_id}?tab=scheme`}
                onClick={handleClick}
                key={d.match_id}
              >
                <div className={styles.matchItem}>
                  <span className={styles.time}>
                    {moment(new Date(d.match_time * 1000)).format('HH:mm')}
                  </span>
                  <div className={styles.team_wrap}>
                    <div className={classnames(styles.team, styles.home)}>
                      <span className={styles.name}>{d.home_name}</span>
                      <img
                        className={styles.logo}
                        src={d.home_logo || EmptyLogo}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src = EmptyLogo;
                        }}
                      />
                    </div>
                    <span className={styles.vs}>VS</span>
                    <div className={classnames(styles.team, styles.away)}>
                      <span className={styles.name}>{d.away_name}</span>
                      <img
                        className={styles.logo}
                        src={d.away_logo || EmptyLogo}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src = EmptyLogo;
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.scheme_num}>{d.scheme_num}个方案</div>
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
