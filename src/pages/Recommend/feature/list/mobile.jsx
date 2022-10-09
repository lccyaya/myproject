import React from 'react';
import { Link } from 'umi';
import moment from 'moment';
import classnames from 'classnames';

import styles from './mobile.module.less';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import Iconfont from '@/components/IconFont';
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
                  <div className={styles.header}>
                    <div className={styles.time}>
                      {moment(new Date(d.match_time * 1000)).format('HH:mm')}
                      <span>{d.competition_name}</span>
                    </div>
                    <div className={styles.scheme_num}>{d.scheme_num}个方案</div>
                  </div>
                  <div className={styles.body}>
                    <div className={styles.team_wrap}>
                      <div className={classnames(styles.team, styles.home)}>
                        <img
                          className={styles.logo}
                          src={d.home_logo || EmptyLogo}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = EmptyLogo;
                          }}
                        />
                        <span className={styles.name}>{d.home_name}</span>
                      </div>
                      <span className={styles.vs}>VS</span>
                      <div className={classnames(styles.team, styles.away)}>
                        <img
                          className={styles.logo}
                          src={d.away_logo || EmptyLogo}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = EmptyLogo;
                          }}
                        />
                        <span className={styles.name}>{d.away_name}</span>
                      </div>
                    </div>
                    <Iconfont className={styles.icon} type="icon-jiantouyou" size={14} />
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
