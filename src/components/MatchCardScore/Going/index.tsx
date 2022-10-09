import type { matchType } from '@/services/matchPage';
import styles from './index.less';
import { REPORT_CATE } from '@/constants';
import MatchLive from '@/components/MatchLive';
import Events from '@/pages/Details/Events';
import LiveAnimation from '@/components/LiveAnimation';

function HasLive(props: {
  match: matchType;
}) {
  const { match } = props;
  return <div className={`${styles.wrapper} ${styles.hasLive}`}>
    <div className={styles.left}>
      <MatchLive
        hideHighlightTab
        hideVideoTeamInfo
        hideVideoTitle
        onlyOne
        matchList={[match]}
        reportCate={REPORT_CATE.home}
        leftTopFlag='live'
      />
    </div>
    <div className={styles.right}>
      <Events matchId={`${match.match_id}`} smallView />
    </div>
  </div>
}

export default function Going(props: {
  match: matchType;
}) {
  const { match } = props;
  const hasLive = Boolean(match.has_live &&
    (match.normal_live_link || match.high_live_link));
  if (hasLive) {
    return <HasLive match={match} />
  }
  return <div className={styles.wrapper}>
    <LiveAnimation
      liveMatchId={match.match_id}
      immediately
      hideLive
      hideAttackStatistics
      hideFoulStatistics
      showMore
      italicTitle
    />
  </div>;
}
