import { getMatchStatus, MatchStatus } from '@/utils/match';
import LiveAnimation from '@/components/LiveAnimation';
import type { MatchDetails } from '@/services/match';
import MEmpty from '@/components/Empty';

export default function Progress(props: {
  match: MatchDetails;
}) {
  const { match: data } = props;
  const status = getMatchStatus(data.status);
  if (status === MatchStatus.Before) {
    return <MEmpty style={{ paddingBottom: '40px' }} localeMessage='key_match_has_not_started' />
  }

  return <LiveAnimation
    match={data}
    liveMatchId={data.match_id}
    immediately
    hideLive
  />;
}
