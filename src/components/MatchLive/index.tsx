import styles from './index.less';
import type * as matchService from '@/services/matchPage';
import type { MatchDetails } from '@/services/match';
import Left from './left';
import Right from './right';
import { useEffect, useState } from 'react';
import type { REPORT_CATE } from '@/constants';

function MatchLive(props: {
  matchList: (matchService.matchType | MatchDetails)[];
  reportCate?: REPORT_CATE;
  indexView?: boolean;
  onlyOne?: boolean;
  hideVideoTitle?: boolean;
  hideVideoTeamInfo?: boolean;
  isHighlight?: boolean;
  hideHighlightTab?: boolean;
  showHighlightTag?: boolean;
  videoHeight?: string;
  leftTopFlag?: 'highlight' | 'live' | 'playback';
}) {
  const {
    reportCate,
    indexView,
    onlyOne,
    hideVideoTitle,
    hideVideoTeamInfo,
    isHighlight,
    hideHighlightTab,
    showHighlightTag,
    videoHeight,
    leftTopFlag,
  } = props;
  const matchList = props.matchList.sort((a, b) => {
    return a.match_time !== b.match_time ? a.match_time - b.match_time : a.match_id - b.match_id;
  });
  const [match, setMatch] = useState<matchService.matchType | MatchDetails | null>(matchList[0]);
  useEffect(() => {
    // @ts-ignore
    const newMatch = matchList.find((m) => m.match_id === match?.match_id) || matchList[0] || null;
    setMatch(newMatch ? { ...newMatch } : null);
  }, [matchList]);
  if (!match) return null;
  return (
    <div className={styles.wrapper}>
      <Left
        videoHeight={videoHeight}
        showTopInfo={!hideVideoTitle && (onlyOne || matchList.length === 1)}
        match={match}
        reportCate={reportCate}
        indexView={indexView}
        hideVideoTeamInfo={hideVideoTeamInfo}
        isHighlight={isHighlight}
        hideHighlightTab={hideHighlightTab}
        showHighlightTag={showHighlightTag}
        leftTopFlag={leftTopFlag}
      />
      {!onlyOne && matchList.length > 1 && (
        <Right
          matchList={matchList as matchService.matchType[]}
          selectedIndex={matchList.findIndex((m) => m.match_id === match.match_id)}
          onChange={(i) => setMatch(matchList[i])}
        />
      )}
    </div>
  );
}

export default MatchLive;
