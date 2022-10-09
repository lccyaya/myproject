import styles from '@/components/MatchLive/index.less';
import {
  DownOutlined,
  PlaySquareFilled,
  PlaySquareOutlined,
  RightOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import MVideo from '@/components/Video';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type * as matchService from '@/services/matchPage';
import type { MatchDetails } from '@/services/match';
import * as matchService2 from '@/services/match';
import { useIntl } from '@@/plugin-locale/localeExports';
import moment from 'moment';
import emptyLogo from '../../assets/emptyLogo.png';
import { getScore } from '@/utils/match';
import { FOOTBALL_DISMISS_LIVE_RISK, REPORT_ACTION, REPORT_CATE, STATS_CODE } from '@/constants';
import { FormattedMessage, Link } from 'umi';
import { isServer } from '@/utils/env';
import Cover from '@/components/MatchLive/video-cover';
import MatchCardHome from '@/components/MatchCardHome';
import { report } from '@/services/ad';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';

interface Channel {
  name: string;
  type: 'video' | 'animation';
  url: string;
}

type TabType = 'highlight' | 'playback';

const Video = React.memo(MVideo);

function getChannels(
  match: {
    normal_live_link?: string;
    high_live_link?: string;
    live_animation_link?: string;
  },
  format: (p: any) => string,
) {
  const { normal_live_link, high_live_link, live_animation_link } = match;
  const channels: Channel[] = [];
  if (normal_live_link) {
    channels.push({
      name: `${format({ id: 'key_live_video' })} 1`,
      type: 'video',
      url: normal_live_link,
    });
  }
  if (high_live_link) {
    channels.push({
      name: `${format({ id: 'key_live_video' })} 2`,
      type: 'video',
      url: high_live_link,
    });
  }
  if (live_animation_link) {
    channels.push({
      name: `${format({ id: 'key_live_animation' })}`,
      type: 'animation',
      url: live_animation_link,
    });
  }
  return channels;
}

const Animation = React.memo((props: { url: string }) => {
  return (
    <div className={styles.animationWrapper}>
      <iframe
        className={styles.iframe}
        width="100%"
        height="100%"
        frameBorder={0}
        src={props.url}
      />
    </div>
  );
});

function LeftTopFlag(props: { type: 'highlight' | 'live' | 'playback' }) {
  const { type } = props;
  if (type === 'live') {
    return (
      <div className={styles.leftTopFlag}>
        <div className={styles.flagIcon}>
          <div className={styles.live}>
            <div className={styles.line} />
            <div className={styles.line} />
            <div className={styles.line} />
          </div>
        </div>
        <div className={styles.flagText}>
          <FormattedMessage id="key_live" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.leftTopFlag}>
      <div className={styles.flagIcon}>
        {type === 'highlight' ? <StarFilled /> : <PlaySquareFilled />}
      </div>
      <div className={styles.flagText}>
        <FormattedMessage id={type === 'highlight' ? 'key_highlight' : 'key_playback'} />
      </div>
    </div>
  );
}

function VideoArea(props: {
  isHighlight?: boolean;
  hideHighlightTab?: boolean;
  showHighlightTag?: boolean;
  match: matchService.matchType | MatchDetails;
  showTopInfo: boolean;
  reportCate?: REPORT_CATE;
  videoHeight?: string;
  leftTopFlag?: 'highlight' | 'live' | 'playback';
}) {
  const {
    showTopInfo,
    isHighlight,
    match,
    reportCate,
    hideHighlightTab,
    showHighlightTag,
    videoHeight,
    leftTopFlag,
  } = props;
  const { competition_name, match_time, minutes, match_id } = match;
  const { highlights, playback_link } =
    isHighlight && 'highlights' in match ? match : { highlights: null, playback_link: '' };
  const intl = useIntl();
  const tipTimer = useRef<number>();
  const [highlightPlaying, setHighlightPlaying] = useState(false);
  const [tabType, setTabType] = useState<TabType>(highlights?.length ? 'highlight' : 'playback');
  const [tipText, setTipText] = useState('');
  const [tipVisible, setTipVisible] = useState(false);
  const channels = !isHighlight ? getChannels(match, intl.formatMessage) : [];
  const [channelIndex, setChannelIndex] = useState(0);
  const [channelListVisible, setChannelListVisible] = useState(false);
  const [acceptedRisk, setAcceptedRisk] = useState(
    !isServer ? localStorage.getItem(FOOTBALL_DISMISS_LIVE_RISK) === 'yes' : false,
  );
  const channel = channels[channelIndex];
  const lastVideoUrl = useRef('');
  const videoUrl: string = useMemo(() => {
    if (!channel) return '';
    if (channel.url.split('?')[0] === lastVideoUrl.current.split('?')[0]) {
      return lastVideoUrl.current;
    }
    lastVideoUrl.current = channel.url;
    return channel.url;
  }, [channel]);
  const handleChannelClick = (index: number) => {
    if (reportCate) {
      report({
        cate: reportCate,
        action: REPORT_ACTION.match_detail_choose_live + (index + 1),
      });
    }
    setChannelIndex(index);
  };

  const handleTabClick = (type: TabType) => {
    const map = {
      highlight: {
        url: highlights?.[0]?.url,
        tip: 'key_no_highlights',
        clickAction: REPORT_ACTION.match_detail_tab_highlight,
        displayAction: REPORT_ACTION.match_detail_highlight_display,
      },
      playback: {
        url: playback_link,
        tip: 'key_no_playback',
        clickAction: REPORT_ACTION.match_detail_tab_playback,
        displayAction: REPORT_ACTION.match_detail_playback_display,
      },
    };
    const { url, tip, clickAction, displayAction } = map[type];
    if (reportCate) {
      report({
        cate: reportCate,
        action: clickAction,
      });
    }
    if (!url) {
      setTipText(tip);
      setTipVisible(true);
      clearTimeout(tipTimer.current);
      tipTimer.current = window.setTimeout(() => {
        setTipVisible(false);
      }, 2000);
    } else {
      setTabType(type);
      if (reportCate) {
        report({
          cate: reportCate,
          action: displayAction,
        });
      }
    }
  };

  // 曝光埋点
  const displayReport = () => {
    if (!reportCate) return;
    if (!isHighlight) {
      if (videoUrl) {
        // 直播曝光
        report({
          cate: reportCate,
          action: REPORT_ACTION.match_detail_live_display,
        });
      }
    } else {
      report({
        cate: reportCate,
        action:
          tabType === 'highlight'
            ? REPORT_ACTION.match_detail_highlight_display
            : REPORT_ACTION.match_detail_playback_display,
      });
    }
  };

  useEffect(() => {
    setTabType(highlights?.length ? 'highlight' : 'playback');
  }, [match]);

  useEffect(() => {
    const hideChannelList = () => {
      setChannelListVisible(false);
    };
    document.documentElement.addEventListener('click', hideChannelList);

    displayReport();
    return () => {
      document.documentElement.removeEventListener('click', hideChannelList);
      clearTimeout(tipTimer.current);
    };
  }, []);
  const tabs = [
    {
      type: 'highlight' as TabType,
      icon: <StarOutlined className={styles.icon} />,
      activeIcon: <StarFilled className={styles.icon} />,
      name: 'key_highlights',
    },
    {
      type: 'playback' as TabType,
      icon: <PlaySquareOutlined className={styles.icon} />,
      activeIcon: <PlaySquareFilled className={styles.icon} />,
      name: 'key_live_playback',
    },
  ];
  const highlightUrl = tabType === 'highlight' ? highlights?.[0]?.url || '' : playback_link || '';
  const videoSrc = !isHighlight ? videoUrl : highlightUrl;
  return (
    <>
      {showTopInfo && (
        <div className={styles.topInfo}>
          <div className={styles.time}>{moment(match_time * 1000).format('DD/MM HH:mm')}</div>
          <div className={styles.league}>{competition_name}</div>
          <div className={styles.progress}>{minutes}</div>
        </div>
      )}
      {isHighlight && !hideHighlightTab && (
        <div className={styles.highlightTab}>
          {tabs.map((tab) => {
            return (
              <div
                className={`${styles.tab} ${tabType === tab.type ? styles.active : ''}`}
                onClick={() => handleTabClick(tab.type)}
                key={tab.name}
              >
                {tabType === tab.type ? tab.activeIcon : tab.icon}
                <div className={styles.text}>
                  <FormattedMessage id={tab.name} />
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className={styles.videoWrapper}>
        {leftTopFlag ? <LeftTopFlag type={leftTopFlag} /> : null}
        {(channel?.type === 'video' || (isHighlight && Boolean(highlightUrl))) &&
          (acceptedRisk && (!isHighlight || highlightPlaying) ? (
            <Video
              style={videoHeight ? { height: videoHeight } : undefined}
              url={videoSrc}
              key={videoSrc}
              autoplay
              volume={30}
              needExpand
              needVolume
              needPause
              isLive={props.match.has_live}
              needShowError
              onFullScreenChange={() => {
                report({
                  cate: REPORT_CATE.live,
                  action: REPORT_ACTION.match_detail_fullscreen_live,
                });
              }}
            />
          ) : (
            <Cover
              height={videoHeight}
              src={isHighlight && tabType === 'highlight' ? highlights?.[0]?.cover_img_url : ''}
              matchId={match_id}
              showHighlightTag={showHighlightTag}
              duration={
                isHighlight && tabType === 'highlight' && highlights?.[0]?.duration
                  ? highlights[0].duration
                  : undefined
              }
              dontNeedDismissLiveRisk={(isHighlight && tabType === 'highlight') || showHighlightTag}
              hideTipText={isHighlight}
              onPlayClick={() => {
                if (reportCate) {
                  let tag: string | undefined;
                  let action = REPORT_ACTION.match_detail_live_play;
                  if (isHighlight) {
                    tag = String(match_id);
                    if (tabType === 'highlight') {
                      action = REPORT_ACTION.match_detail_highlight_play;
                    } else {
                      action = REPORT_ACTION.match_detail_playback_play;
                    }
                  }
                  report({
                    cate: reportCate,
                    action,
                    tag,
                  });
                }
              }}
              onPlay={() => {
                setAcceptedRisk(true);
                if (isHighlight) {
                  setHighlightPlaying(true);
                  if (reportCate && tabType === 'highlight') {
                    report({
                      cate: reportCate,
                      action: REPORT_ACTION.match_detail_highlight_played,
                      tag: String(match_id),
                      payload:
                        highlights && highlights.length > 0
                          ? {
                              highlight_id: highlights[0].ID.toString(),
                            }
                          : undefined,
                    });
                  }
                }
              }}
            />
          ))}
        {channel?.type === 'animation' && <Animation url={channel.url} />}
        {acceptedRisk && channels.length > 1 && !isHighlight && (
          <div className={styles.channelWrapper}>
            <div className={styles.trigger}>
              <div
                className={styles.channelInfo}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setChannelListVisible((p) => !p);
                }}
              >
                <div className={styles.dot} />
                <div className={styles.text}>{channel.name}</div>
                <DownOutlined className={styles.arrow} />
              </div>
              {channelListVisible && (
                <div className={styles.list}>
                  {channels.map((c, i) => (
                    <div
                      onClick={() => handleChannelClick(i)}
                      key={c.name}
                      className={`${styles.item} ${i === channelIndex ? styles.selected : ''}`}
                    >
                      {c.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <div className={`${styles.tip} ${tipVisible ? styles.show : ''}`}>
          {!!tipText && <FormattedMessage id={tipText} />}
        </div>
      </div>
    </>
  );
}

function TeamScoreArea(props: {
  match: matchService.matchType;
  reportCate?: REPORT_CATE;
  indexView?: boolean;
}) {
  const { reportCate, match, indexView } = props;
  const {
    home_team_logo,
    home_team_name,
    away_team_logo,
    away_team_name,
    match_id,
    home_score,
    away_score,
  } = match;
  const homeScore = getScore(home_score);
  const awayScore = getScore(away_score);
  const [hCorner, setHCorner] = useState(0);
  const [hRCard, setHRCard] = useState(0);
  const [hYCard, setHYCard] = useState(0);

  const [aCorner, setACorner] = useState(0);
  const [aRCard, setARCard] = useState(0);
  const [aYCard, setAYCard] = useState(0);
  const timer = useRef<number>();

  const getDetail = async () => {
    const res = await matchService2.getMatchStats(match_id);
    if (!res.success) return;
    res.data.stats.forEach((stats) => {
      if (!stats) return;
      // eslint-disable-next-line default-case
      switch (stats.type) {
        case STATS_CODE.Corner:
          setHCorner(stats.home);
          setACorner(stats.away);
          return;
        case STATS_CODE.RedCard:
          setHRCard(stats.home);
          setARCard(stats.away);
          return;
        case STATS_CODE.YellowCard:
          setHYCard(stats.home);
          setAYCard(stats.away);
      }
    });
  };

  useEffect(() => {
    timer.current = window.setInterval(getDetail, 10000);
    getDetail();
    return () => {
      clearInterval(timer.current);
    };
  });
  const lang = toShortLangCode(locale.getLocale());
  return (
    <div className={styles.matchInfo}>
      {indexView ? (
        <MatchCardHome smallView reportCate={reportCate} data={match} setParams={() => {}} />
      ) : (
        <Link
          to={`/${lang}/details/${props.match.match_id}`}
          className={styles.matchInfoWrapper}
          onClick={() => {
            if (reportCate) {
              report({
                cate: reportCate,
                action: REPORT_ACTION.match_enter,
              });
            }
          }}
        >
          <div className={styles.team}>
            <div className={styles.top}>
              <img className={styles.logo} src={home_team_logo || emptyLogo} />
              <div className={styles.name} title={home_team_name}>
                {home_team_name}
              </div>
            </div>
            <div className={styles.bottom}>
              <div className={styles.item}>
                <div className={styles.icon}>
                  <div className={styles.corner} />
                </div>
                <div className={styles.text}>{hCorner}</div>
              </div>
              <div className={styles.item}>
                <div className={styles.icon}>
                  <div className={`${styles.card} ${styles.red}`} />
                </div>
                <div className={styles.text}>{hRCard}</div>
              </div>
              <div className={styles.item}>
                <div className={styles.icon}>
                  <div className={`${styles.card} ${styles.yellow}`} />
                </div>
                <div className={styles.text}>{hYCard}</div>
              </div>
            </div>
          </div>
          <div className={styles.score}>
            <div className={styles.num}>{homeScore}</div>
            <div className={styles.line} />
            <div className={styles.num}>{awayScore}</div>
            <RightOutlined className={styles.arrow} />
          </div>

          <div className={`${styles.team} ${styles.reverse}`}>
            <div className={styles.top}>
              <img className={styles.logo} src={away_team_logo || emptyLogo} />
              <div className={styles.name} title={away_team_name}>
                {away_team_name}
              </div>
            </div>
            <div className={styles.bottom}>
              <div className={styles.item}>
                <div className={styles.icon}>
                  <div className={styles.corner} />
                </div>
                <div className={styles.text}>{aCorner}</div>
              </div>
              <div className={styles.item}>
                <div className={styles.icon}>
                  <div className={`${styles.card} ${styles.red}`} />
                </div>
                <div className={styles.text}>{aRCard}</div>
              </div>
              <div className={styles.item}>
                <div className={styles.icon}>
                  <div className={`${styles.card} ${styles.yellow}`} />
                </div>
                <div className={styles.text}>{aYCard}</div>
              </div>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}

function Left(props: {
  match: matchService.matchType | MatchDetails;
  reportCate?: REPORT_CATE;
  indexView?: boolean;
  showTopInfo: boolean;
  hideVideoTeamInfo?: boolean;
  isHighlight?: boolean;
  hideHighlightTab?: boolean;
  showHighlightTag?: boolean;
  videoHeight?: string;
  leftTopFlag?: 'highlight' | 'live' | 'playback';
}) {
  return (
    <div className={styles.left}>
      <VideoArea
        match={props.match}
        showTopInfo={props.showTopInfo}
        isHighlight={props.isHighlight}
        reportCate={props.reportCate}
        hideHighlightTab={props.hideHighlightTab}
        showHighlightTag={props.showHighlightTag}
        videoHeight={props.videoHeight}
        leftTopFlag={props.leftTopFlag}
      />
      {/* @ts-ignore */}
      {!props.hideVideoTeamInfo && 'competition_logo' in props.match && (
        <TeamScoreArea {...props} />
      )}
    </div>
  );
}

export default Left;
