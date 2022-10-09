import React from 'react';
import styles from './pc.module.less';
import cls from 'classnames';
import moment from 'moment';
import { PLAY_STATUS, PLAY_TYPE, SCHEME_STATE, MATCH_STATUS } from '@/constants/index';
import HitImage from '@/assets/hit.png';
import MisImage from '@/assets/miss.png';
import { handleReport } from '@/utils/report';
import { history } from 'umi';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';

const SchemeBlock = ({ detail, matchInfo }) => {
  const { odds } = detail;
  const map = {
    [PLAY_STATUS.RQ]: [
      { width: 43, label: '让球', key: 'goal', background: '#FBEABF' },
      { width: 100, label: '主胜', key: 'home' },
      { width: 100, label: '平局', key: 'draw' },
      { width: 100, label: '客胜', key: 'away' },
    ],
    [PLAY_STATUS.SFGG]: [
      { width: 100, label: '主胜', key: 'home' },
      { width: 100, label: '让球', key: 'goal' },
      { width: 100, label: '客胜', key: 'away' },
    ],
    [PLAY_STATUS.SPF]: [
      { width: 100, label: '主胜', key: 'home' },
      { width: 100, label: '平局', key: 'draw' },
      { width: 100, label: '客胜', key: 'away' },
    ],
    [PLAY_STATUS.SXDS]: [
      { width: 100, label: '上单', key: 'up_single' },
      { width: 100, label: '上双', key: 'up_double' },
      { width: 100, label: '下单', key: 'down_single' },
      { width: 100, label: '下双', key: 'down_double' },
    ],
  };
  return (
    <div
      className={styles.scheme_block}
      onClick={() => {
        if (!detail?.match_id) {
          return;
        }
        handleReport({ action: 'match_enter', tag: matchInfo.status });
        const lang = toShortLangCode(locale.getLocale());
        history.push(`/${lang}/details/${detail.match_id}`);
      }}
    >
      <div className={styles.top}>
        <div className={styles.pa0}>
          <div className={styles.play}>
            {PLAY_STATUS.SFGG === detail.play ? PLAY_STATUS[detail.play] : PLAY_TYPE[detail.type]}
          </div>
          <div className={styles.competition_name}>{detail.competition_name}</div>
          <div className={styles.match_time}>
            {moment(detail.match_time * 1000).format('MM/DD HH:mm')}
          </div>
        </div>
        {detail.state === SCHEME_STATE.HIT ? <img src={HitImage} className={styles.pa3} /> : null}
        {detail.state === SCHEME_STATE.MISS ? <img src={MisImage} className={styles.pa3} /> : null}

        <div className={styles.team}>
          <img src={detail.home_logo} className={styles.team_logo} />
          <div className={styles.team_name}>(主){detail.home_name}</div>
        </div>
        <div className={styles.vs}>
          {matchInfo && matchInfo.status === MATCH_STATUS.WKS ? (
            <>
              <div className={styles.score}>VS</div>
              {/* <div className={styles.status}>未开始</div> */}
            </>
          ) : null}
          {matchInfo &&
          matchInfo.status > MATCH_STATUS.WKS &&
          matchInfo.status < MATCH_STATUS.WC ? (
            <>
              <div className={styles.score}>
                {matchInfo.home}:{matchInfo.away}
              </div>
              <div className={styles.status} style={{ color: '#FA5900' }}>
                进行中
              </div>
            </>
          ) : null}
          {matchInfo && matchInfo.status === MATCH_STATUS.WC ? (
            <>
              <div className={styles.score}>
                {matchInfo.home}:{matchInfo.away}
              </div>
              <div className={styles.status}>已结束</div>
            </>
          ) : null}
          {matchInfo && matchInfo.status > MATCH_STATUS.WC ? (
            <>
              <div className={styles.score}>VS</div>
              <div className={styles.status}>{MATCH_STATUS[matchInfo.status]}</div>
            </>
          ) : null}
        </div>
        <div className={styles.team}>
          <img src={detail.away_logo} className={styles.team_logo} />
          <div className={styles.team_name}>{detail.away_name}</div>
        </div>
      </div>
      <div className={styles.bottom}>
        {map[detail.play].map((item) => {
          return (
            <div
              key={item.key}
              className={cls(
                styles.bottom_item,
                detail.recommend === item.key ? styles.bottom_item_active : {},
              )}
              style={{ flex: item.width, background: item.background }}
            >
              {detail.recommend === item.key ? <div className={styles.push}>推</div> : null}
              {detail.result === item.key ? (
                <img className={styles.hit} src={require('@/assets/hit_logo.png')} />
              ) : null}
              <div className={styles.bottom_item_title}>{item.label}</div>
              <div className={styles.bottom_item_score}>{odds[item.key]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SchemeBlock;
