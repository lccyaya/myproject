import type { ReactNode } from 'react';
import React, { useState } from 'react';
import moment from 'moment';
import { connect, FormattedMessage, Link } from 'umi';
import type { ConnectState } from '@/models/connect';
import classnames from 'classnames';
import { Col, message, Row } from 'antd';
import Icon from '@ant-design/icons';
import styles from './index.less';
import type { matchType } from '@/services/matchPage';
import * as homeService from '@/services/home';
import { statesPrams } from '@/pages/Home';
import Disclaimer from '../Disclaimer';
// import { ReactComponent as GoingWithLive } from '../../assets/stats/going_with_live.svg';
// import { ReactComponent as GoingNoLive } from '../../assets/stats/going_no_live.svg';
import { ReactComponent as TBD } from '../../assets/stats/tbd.svg';

import { ReactComponent as NoSubscribe } from '../../assets/stats/subscribe.svg';
import { ReactComponent as Subscribed } from '../../assets/stats/subscribed.svg';
import { ReactComponent as Complete } from '../../assets/stats/complete.svg';
import emptyLogo from '../../assets/emptyLogo.png';
import type { UserInfoType } from '@/services/user';
import LoginModal from './Login';
import { getMatchStatus, getScore, MatchStatus } from '@/utils/match';
import liveVideo from '@/assets/liveVideo.svg';
import liveVideoDisable from '@/assets/liveVideoDisable.svg';
import highlightIcon from '@/assets/highlight.svg';
import playback from '@/assets/playback.svg';
import type { REPORT_CATE } from '@/constants';
import { REPORT_ACTION } from '@/constants';
import { report } from '@/services/ad';
import { checkIsPhone } from '@/utils/utils';
import Notification from '@/components/Notification';
import NotStartedYet from '@/components/MatchCardScore/NotStartedYet';
import Going from '@/components/MatchCardScore/Going';
import Finished from '@/components/MatchCardScore/Finished';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { useIntl } from 'umi';

export function genIcon(match: matchType) {
  const statusFormat = getMatchStatus(match.status);
  if (statusFormat === MatchStatus.Before) {
    // 判断是否订阅
    if (match.subscribed) {
      return Subscribed;
    }
    return NoSubscribe;
  }
  if (statusFormat === MatchStatus.Going) {
    // 有直播
    return '';
  }
  if (statusFormat === MatchStatus.Complete) {
    return Complete;
  }
  return TBD;
}

export function checkIsBefore(match: matchType) {
  return getMatchStatus(match.status) === MatchStatus.Before;
}
//
// function DivWrap(props: ) {
//
// }
//
// function createLink(navigate: boolean) {
//   return navigate ? NavigateLink :
// }

interface matchCardProps {
  data: matchType;
  setParams: (id: number, bool: boolean) => void;
  from?: string;
  handleChangeLiveMatch?: (id: number) => void;
  currentUser?: UserInfoType | null;
  reportCate?: REPORT_CATE;
  whiteBg?: boolean;
  expandable?: boolean;
}

function MobileBody(props: { match: matchType }) {
  const {
    match: {
      status: matchStatus,
      final_scores: final,
      home_team_name,
      home_team_logo,
      away_team_name,
      away_team_logo,
      playback_link,
      has_highlight,
      has_live,
    },
  } = props;
  const status = getMatchStatus(matchStatus);
  const going = status === MatchStatus.Going;
  const showScore = [MatchStatus.Going, MatchStatus.Complete].includes(status);
  const icons = [];
  if (status === MatchStatus.Complete) {
    if (playback_link) {
      icons.push(
        <div key="playback" className={styles.item}>
          <img src={liveVideo} alt="" />
          <div className={styles.text}>
            <FormattedMessage id="key_playback" />
          </div>
        </div>,
      );
    }
    if (has_highlight) {
      icons.push(
        <div key="Highlight" className={styles.item}>
          <img src={highlightIcon} alt="" />
          <div className={styles.text}>
            <FormattedMessage id="key_highlight" />
          </div>
        </div>,
      );
    }
  } else if (has_live) {
    const cls = status !== MatchStatus.Going ? styles.disabled : '';
    icons.push(
      <div key="LiveVideo" className={`${styles.item} ${styles.isLive} ${cls}`}>
        <img src={liveVideo} alt="" />
        <div className={styles.text}>
          <FormattedMessage id="key_live_video" />
        </div>
      </div>,
    );
  }
  return (
    <div className={styles.body}>
      <div className={styles.left}>
        <div className={`${styles.row} ${final.home >= final.away ? styles.winner : ''}`}>
          <img className={styles.logo} src={home_team_logo} />
          <div className={styles.name}>{home_team_name}</div>
          <div className={`${styles.score} ${going ? styles.active : ''}`}>
            {showScore ? final.home : '-'}
          </div>
        </div>
        <div className={`${styles.row} ${final.away >= final.home ? styles.winner : ''}`}>
          <img className={styles.logo} src={away_team_logo} />
          <div className={styles.name}>{away_team_name}</div>
          <div className={`${styles.score} ${going ? styles.active : ''}`}>
            {showScore ? final.away : '-'}
          </div>
        </div>
      </div>
      <div className={styles.right}>{icons}</div>
    </div>
  );
}

function MobileHeader(props: {
  time: string;
  match: matchType;
  onSubscribeClick: React.MouseEventHandler<HTMLElement>;
}) {
  const { time, match, onSubscribeClick } = props;
  const { competition_name, final_scores: final } = match;
  const status = getMatchStatus(match.status);
  const score = [];
  if (final.has_ot) {
    score.push(
      <span className={styles.score} key="aet">
        AET：{final.ot_home || 0}-{final.ot_away || 0}
      </span>,
    );
  }
  if (final.has_penalty) {
    score.push(
      <span className={styles.score} key="pen">
        PEN：{final.penalty_home || 0}-{final.penalty_away || 0}
      </span>,
    );
  }
  let statusEl: ReactNode | undefined;
  if (status === MatchStatus.TBD) {
    statusEl = 'TBD';
  } else if (status === MatchStatus.Complete) {
    statusEl = 'FT';
  } else if (status === MatchStatus.Going) {
    statusEl = <span className={styles.active}>{match.minutes}</span>;
  } else if (status === MatchStatus.Before) {
    statusEl = (
      <Icon className={styles.icon} component={genIcon(match)} onClick={onSubscribeClick} />
    );
  }
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        {time}
        <span className={styles.leagueName}>{competition_name}</span>
      </div>
      <div className={styles.right}>
        {score}
        <div className={styles.status}>{statusEl}</div>
      </div>
    </div>
  );
}

function MobileCard(props: {
  time: string;
  match: matchType;
  onSubscribeClick: React.MouseEventHandler<HTMLElement>;
}) {
  return (
    <div className={styles.mobileContainer}>
      <MobileHeader {...props} />
      <MobileBody {...props} />
    </div>
  );
}

let MatchCardScore: React.FC<matchCardProps> = (props) => {
  const intl = useIntl();
  const isPhone = checkIsPhone();
  const { data, setParams, currentUser, reportCate, whiteBg, expandable } = props;
  const dateFormat = 'DD/MM HH:mm';
  const time = moment(new Date(data.match_time * 1000)).format(dateFormat);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loginVisible, setLoginVisible] = useState<boolean>(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [expand, setExpand] = useState(false);

  const handleSubscribe = async () => {
    if (data.subscribed) {
      const result = await homeService.cancelSubscribe(data.match_id);
      if (result.success) {
        message.success(intl.formatMessage({ id: 'key_unsubscribed' }));
      }
      setParams(data.match_id, false);
    } else {
      const result = await homeService.setSubscribe(data.match_id);
      if (result.success) {
        message.success(intl.formatMessage({ id: 'key_subscribed' }));
      }
      setParams(data.match_id, true);
      if (reportCate) {
        report({
          action: REPORT_ACTION.match_remind,
          cate: reportCate,
        });
      }
    }
  };

  const changeLiveMatch = () => {
    if (props.handleChangeLiveMatch) {
      props.handleChangeLiveMatch(data.match_id);
    }
  };

  const handleLiveMatch = () => {
    changeLiveMatch?.();
  };

  const onSubscribeHandle = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (getMatchStatus(data.status) === MatchStatus.Before) {
      // 登录后
      if (currentUser) {
        handleSubscribe();
        if (!data.subscribed) {
          setNotificationVisible(true);
        }
      } else {
        setLoginVisible(true);
      }
    } else {
      handleLiveMatch();
    }
  };

  const onLoginHandler = () => {
    setLoginVisible(false);
    if (checkIsBefore(data)) {
      handleSubscribe();
      setNotificationVisible(true);
    } else {
      handleLiveMatch();
    }
  };

  const stats = statesPrams[data.status];

  const isShowScore = stats === 'going' || stats === 'finish';
  const homeScore = getScore(data.home_score);
  const awayScore = getScore(data.away_score);

  const isMatchStats = stats === 'subscribe';
  const playImgSrc = data.minutes
    ? data.has_live || data.has_live_animation
      ? liveVideo
      : ''
    : data.has_live || data.has_live_animation
    ? liveVideoDisable
    : data.playback_link
    ? playback
    : liveVideoDisable;
  const matchStatus = getMatchStatus(data.status);
  const subscribeIcon = genIcon(data);
  const hasHighlight = Boolean(matchStatus === MatchStatus.Complete && data.has_highlight);
  const lang = toShortLangCode(locale.getLocale());
  return (
    <div
      className={`${styles.card} ${whiteBg ? styles.whiteBg : ''} ${isPhone ? styles.mobile : ''}`}
    >
      <Notification
        visible={notificationVisible}
        onCancel={() => setNotificationVisible(false)}
        onOk={() => setNotificationVisible(false)}
      />
      <LoginModal
        visible={loginVisible}
        onLogin={onLoginHandler}
        onCancel={() => {
          setLoginVisible(false);
        }}
      />
      <Disclaimer
        open={openModal}
        close={() => {
          changeLiveMatch();
          setOpenModal(false);
        }}
      />
      <Link
        to={`/${lang}/details/${data.match_id}`}
        className={styles.cardContainer}
        onClick={(e) => {
          if (expandable) {
            e.preventDefault();
            e.stopPropagation();
            setExpand((p) => !p);
            return;
          }

          if (reportCate) {
            report({
              action: REPORT_ACTION.match_enter,
              cate: reportCate,
              tag: `${data.match_id}`,
            });
          }
        }}
      >
        {isPhone && <MobileCard match={data} time={time} onSubscribeClick={onSubscribeHandle} />}
        {!isPhone && (
          <Row className={styles.row}>
            <Col span={4} className={styles.competitionCon}>
              <div className={styles.time}>{time}</div>
              <div className={styles.competition}>
                <span className={styles.competitionText}>{data.competition_name}</span>
              </div>
            </Col>
            <Col span={14}>
              <div className={styles.team_info}>
                <div className={styles.top_wrap}>
                  <div className={classnames(styles.homeTeam, styles.team)}>
                    <span
                      className={classnames(
                        styles.teamText,
                        isShowScore ? (homeScore >= awayScore ? styles.win : styles.lose) : '',
                      )}
                    >
                      {data.home_team_name}
                    </span>
                    <img
                      loading="lazy"
                      className={styles.logoCon}
                      src={data.home_team_logo || emptyLogo}
                    />
                  </div>
                  <div className={styles.vs}>
                    {data.minutes && <div className={styles.minutes}>{data.minutes}</div>}
                    {isShowScore ? (
                      <div className={styles.scoreCon}>
                        <span
                          className={classnames(
                            data.minutes
                              ? styles.going
                              : homeScore >= awayScore
                              ? styles.win
                              : styles.lose,
                          )}
                        >
                          {homeScore}
                        </span>
                        <span
                          className={classnames(
                            styles.line,
                            data.minutes ? styles.going : styles.win,
                          )}
                        >
                          -
                        </span>
                        <span
                          className={classnames(
                            data.minutes
                              ? styles.going
                              : awayScore >= homeScore
                              ? styles.win
                              : styles.lose,
                          )}
                        >
                          {awayScore}
                        </span>
                      </div>
                    ) : (
                      'vs'
                    )}
                  </div>
                  <div className={classnames(styles.awayTeam, styles.team)}>
                    <img
                      loading="lazy"
                      className={styles.logoCon}
                      src={data.away_team_logo || emptyLogo}
                    />
                    <span
                      className={classnames(
                        styles.teamText,
                        isShowScore ? (awayScore >= homeScore ? styles.win : styles.lose) : '',
                      )}
                    >
                      {data.away_team_name}
                    </span>
                  </div>
                </div>
                <div className={styles.score_wrap}>
                  {data?.final_scores?.has_ot ? (
                    <span className={styles.score} key="aet">
                      AET：{data?.final_scores.ot_home || 0}-{data?.final_scores.ot_away || 0}
                    </span>
                  ) : null}
                  {data?.final_scores?.has_penalty ? (
                    <span className={styles.score} key="pen">
                      PEN：{data?.final_scores.penalty_home || 0}-
                      {data?.final_scores.penalty_away || 0}
                    </span>
                  ) : null}
                </div>
              </div>
            </Col>
            <Col span={5} className={styles.video}>
              {Boolean(
                (data.minutes || data.has_live || data.has_live_animation || data.playback_link) &&
                  playImgSrc,
              ) && (
                <div className={styles.videoTip}>
                  {(data.minutes ||
                    data.has_live ||
                    data.has_live_animation ||
                    data.playback_link) &&
                  playImgSrc ? (
                    <img className={styles.videoIcon} src={playImgSrc} />
                  ) : null}
                  <div
                    className={classnames(
                      styles.videoText,
                      data.minutes
                        ? data.has_live || data.has_live_animation
                          ? styles.hasVideo
                          : ''
                        : data.has_live || data.has_live_animation
                        ? styles.noVideo
                        : data.playback_link
                        ? styles.playback
                        : styles.noVideo,
                    )}
                  >
                    <span className={styles.textType}>
                      {data.minutes ? (
                        data.has_live ? (
                          <FormattedMessage id="key_live_video" />
                        ) : data.has_live_animation ? (
                          <FormattedMessage id="key_live_ani" />
                        ) : (
                          ''
                        )
                      ) : data.has_live ? (
                        <FormattedMessage id="key_live_video" />
                      ) : data.has_live_animation ? (
                        <FormattedMessage id="key_live_ani" />
                      ) : data.playback_link ? (
                        <FormattedMessage id="key_playback" />
                      ) : null}
                    </span>
                  </div>
                </div>
              )}
              {hasHighlight && (
                <div className={styles.videoTip}>
                  <img className={styles.videoIcon} src={highlightIcon} />
                  <div className={classnames(styles.videoText, styles.playback)}>
                    <FormattedMessage id="key_highlight" />
                  </div>
                </div>
              )}
            </Col>
            <Col span={1} className={styles.iconContainer}>
              {!subscribeIcon && data.minutes && (
                <div className={`${styles.minutes} ${styles.minutesSmall}`}>{data.minutes}</div>
              )}
              {subscribeIcon ? (
                <Icon
                  className={isMatchStats ? styles.icon : styles.iconDisabled}
                  component={genIcon(data)}
                  onClick={(e) => {
                    onSubscribeHandle(e);
                  }}
                />
              ) : null}
            </Col>
          </Row>
        )}
      </Link>
      {expand && (
        <div className={styles.expandContainer}>
          {[MatchStatus.Before, MatchStatus.TBD].includes(matchStatus) && (
            <NotStartedYet match={data} />
          )}
          {matchStatus === MatchStatus.Going && <Going match={data} />}
          {matchStatus === MatchStatus.Complete && <Finished match={data} />}
        </div>
      )}
    </div>
  );
};

MatchCardScore = React.memo(MatchCardScore);
// export default MatchCard;
export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(MatchCardScore);
