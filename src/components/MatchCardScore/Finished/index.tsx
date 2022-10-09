import type { matchType } from '@/services/matchPage';
import styles from './index.less';
import { REPORT_CATE } from '@/constants';
import MatchLive from '@/components/MatchLive';
import LiveAnimation from '@/components/LiveAnimation';
import Events from '@/pages/Details/Events';
import { useEffect, useState } from 'react';
import type { MatchDetails } from '@/services/match';
import { matchDetails } from '@/services/match';
import { Spin } from 'antd';

function HasVideo(props: {
  match: matchType;
}) {
  const { match } = props;
  const type = match.has_highlight
    ? 'highlight'
    : 'playback';
  const [matchDetail, setMatchDetail] = useState<MatchDetails | undefined>();
  const getMatch = async () => {
    const res = await matchDetails({ match_id: match.match_id });
    if (res.success) {
      setMatchDetail(res.data);
    }
  };
  useEffect(() => {
    getMatch();
  }, [match]);
  return <div className={`${styles.wrapper} ${styles.hasLive}`}>
    <div className={styles.left}>
      <Spin spinning={!matchDetail}>
        {Boolean(matchDetail) && <MatchLive
          isHighlight
          hideHighlightTab
          hideVideoTeamInfo
          hideVideoTitle
          onlyOne
          matchList={[matchDetail!]}
          reportCate={REPORT_CATE.home}
          leftTopFlag={type}
        />}
      </Spin>
    </div>
    <div className={styles.right}>
      <Events matchId={`${match.match_id}`} smallView />
    </div>
  </div>
}

export default function Finished(props: {
  match: matchType;
}) {
  const { match } = props;
  const hasVideo = match.has_highlight || match.playback_link;
  if (hasVideo) {
    return <HasVideo match={match} />;
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
