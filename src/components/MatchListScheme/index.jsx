import styles from './index.less';
import Empty from '@/components/Empty';
import { toShortLangCode, formatMatchTime } from '@/utils/utils';
import { locale } from '@/app';
import { history } from 'umi';
import cls from 'classnames';
import { handleReport } from '@/utils/report';
import EmptyLogo from '@/assets/emptyLogo.png';
export default function MatchListProgram({ style, list = [], query = {} }) {
  return (
    <div className={styles.panel} style={style}>
      {list.length > 0 ? (
        list.map((item) => {
          return (
            <div
              className={styles.item}
              key={item.match_id}
              onClick={() => {
                handleReport({
                  action: 'match_enter',
                });
                const lang = toShortLangCode(locale.getLocale());
                history.push(`/${lang}/details/${item.match_id}?tab=scheme`);
              }}
            >
              <div className={styles.match}>
                <div className={styles.team}>
                  <div className={styles.team_name}>{item.home_name}</div>
                  <div className={styles.logo}>
                    <img
                      src={item.home_logo || EmptyLogo}
                      alt=""
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = EmptyLogo;
                      }}
                    />
                  </div>
                </div>
                <div className={styles.info}>
                  <span className={styles.league_name}>{item.competition_name}</span>
                  <span className={styles.scheme_num}>{item.scheme_num}个方案</span>
                  <span className={styles.match_time}>{formatMatchTime(item.match_time)}</span>
                </div>
                <div className={cls(styles.team, styles.away_team)}>
                  <div className={styles.logo}>
                    <img
                      src={item.away_logo || EmptyLogo}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = EmptyLogo;
                      }}
                    />
                  </div>
                  <div className={styles.team_name}>{item.away_name}</div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <Empty />
      )}
    </div>
  );
}
