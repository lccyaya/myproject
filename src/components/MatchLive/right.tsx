import styles from '@/components/MatchLive/index.less';
import type * as matchService from '@/services/matchPage';
import { FormattedMessage } from 'umi';
import emptyLogo from '../../assets/emptyLogo.png';
import { getScore } from '@/utils/match';
import moment from 'moment';

export default function Right(props: {
  matchList: matchService.matchType[];
  selectedIndex: number;
  onChange: (index: number) => void;
}) {
  const { matchList, selectedIndex, onChange } = props;
  return <div className={styles.right}>
    <div className={styles.rightWrapper}>
      <div className={styles.title}>
        <FormattedMessage id='key_live_matches' />
      </div>
      <div className={styles.list}>
        {matchList.map((m, i) => <div
          className={`${styles.item} ${selectedIndex === i ? styles.selected : ''}`}
          key={m.match_id}
          onClick={() => onChange(i)}
        >
          <div className={styles.top}>
            <div className={styles.progress}>{m.minutes}</div>
            <div className={styles.team}>
              <div className={styles.name} title={m.home_team_name}>{m.home_team_name}</div>
              <img className={styles.logo}
                   src={m.home_team_logo || emptyLogo} />
            </div>
            <div className={styles.score}>
              {getScore(m.home_score)}
              <div className={styles.line} />
              {getScore(m.away_score)}
            </div>
            <div className={`${styles.team} ${styles.reverse}`}>
              <div className={styles.name} title={m.away_team_name}>{m.away_team_name}</div>
              <img className={styles.logo}
                   src={m.away_team_logo || emptyLogo} />
            </div>
          </div>
          <div className={styles.bottom}>
            {moment(m.match_time * 1000).format('DD/MM HH:mm')} <span className={styles.league}>{m.competition_name}</span>
          </div>
        </div>)}
      </div>
    </div>
  </div>
}
