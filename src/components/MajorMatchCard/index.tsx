import type { CSSProperties, MutableRefObject } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { Link, connect, FormattedMessage, useIntl } from 'umi';
import moment from 'moment';
import classnames from 'classnames';
import { Row, Col, message, Rate } from 'antd';
import Icon from '@ant-design/icons';
import styles from './index.less';
import type { matchType } from '@/services/matchPage';
import { statesPrams } from '../../pages/Home';
import * as homeService from '@/services/home';
import { checkIsBefore } from '../MatchCard';
import type { UserInfoType } from '@/services/user';
import emptyLogo from '../../assets/emptyLogo.png';
// import PopupLogin from '@/components/PopupLogin';
import type { ConnectState } from '@/models/connect';
import { genIcon } from '@/components/MatchCardScore';
import { handleReport } from '@/utils/report';
import LoginModal from '../MatchCard/Login';

import { getScore, getMatchStatus, MatchStatus } from '@/utils/match';
import { normalizeFloat } from '@/utils/tools';
import liveVideo from '@/assets/liveVideo.svg';
import liveVideoDisable from '@/assets/liveVideoDisable.svg';
import playback from '@/assets/playback.svg';

import * as matchService from '@/services/match';
import type { REPORT_CATE } from '@/constants';
import { REPORT_ACTION } from '@/constants';
import { report } from '@/services/ad';
import { locale } from '@/app';
import type { tipsType } from '@/services/home';
import type { TeamHistoryVSItemType } from '@/services/match';
import { fetchRankingList } from '@/services/match';
import { createPortal } from 'react-dom';
import lightTipImg from '@/assets/icon/light.png';
import { toShortLangCode, formatDateMMDD } from '@/utils/utils';

// https://www.showdoc.com.cn/fbmaster?page_id=6787664606626111
export type maojorMatchProps = {
  data: matchType;
  handleChangeLiveMatch: (id: number) => void;
  setParams: (id: number, bool: boolean) => void;
  currentUser?: UserInfoType | null;
  reportCate?: REPORT_CATE;
  reportTag?: number;
  hideOdds?: boolean;
  style?: CSSProperties;
  tips?: tipsType;
};

type Record = {
  w: number;
  d: number;
  l: number;
  // 实际百分比
  percent: number;
  // 画线用的百分比
  linePercent: number;
};

type HomeAwayRecord = {
  h: Record;
  a: Record;
};

const betType = {
  1: 'H',
  2: 'D',
  3: 'A',
};

export function BarChart(props: {
  homeLabel: string;
  homePercent: number;
  awayLabel: string;
  awayPercent: number;
  drawPercent?: number;
}) {
  const showDraw = typeof props.drawPercent === 'number';
  return (
    <Row className={styles.barContainer} style={{ marginTop: '4px' }}>
      <Col className={styles.homePercent} span={3} style={{ textAlign: 'right' }}>
        {props.homeLabel}
      </Col>
      <Col
        className={styles.bar}
        style={{ backgroundColor: `${showDraw ? '#fff' : '#999'}` }}
        span={16}
        offset={1}
      >
        <div style={{ width: `${props.homePercent}%` }} className={styles.barH} />
        {showDraw && (
          <div
            style={{ width: `${props.drawPercent}%`, left: `${props.homePercent}%` }}
            className={styles.barD}
          />
        )}
        <div style={{ width: `${props.awayPercent}%` }} className={styles.barA} />
      </Col>
      <Col className={styles.opponentPercent} span={3} offset={1} style={{ textAlign: 'left' }}>
        {props.awayLabel}
      </Col>
    </Row>
  );
}

function TipsPanel(props: {
  tips: tipsType;
  h2hRecord: HomeAwayRecord;
  record: HomeAwayRecord;
  parentRef: MutableRefObject<HTMLElement | null>;
}) {
  const { tips, record, h2hRecord, parentRef } = props;
  if ((tips.bet_type !== 1 && tips.bet_type !== 3) || !parentRef.current) return null;
  let teamName = '';
  let teamLogo = '';
  if (tips.bet_type === 1) {
    teamName = tips.home_team_name;
    teamLogo = tips.home_team_logo;
  } else {
    teamName = tips.away_team_name;
    teamLogo = tips.away_team_logo;
  }
  const betValue = `${betType[tips.bet_type]} ${tips.bet_value}`;
  const { x, y, width } = parentRef.current.getBoundingClientRect();
  const elWidth = width * 1.21;
  const left = x - (elWidth - width) / 2;
  const top = y + 85;
  return createPortal(
    <div
      className={styles.tipsCard}
      style={{ left: `${left}px`, top: `${top}px`, width: `${elWidth}px` }}
    >
      <div className={styles.header}>
        <img className={styles.logo} src={teamLogo} />
        <div className={styles.name}>{teamName}</div>
        <div className={styles.value}>{betValue}</div>
        <div className={`${styles.value} ${styles.confidence}`}>{tips.confidence}</div>
        <div className={styles.rate}>
          <Rate allowHalf defaultValue={tips.confidence} style={{ color: '#D80000' }} disabled />
        </div>
      </div>
      <div className={styles.body}>
        <Row>
          <Col span={16} offset={4} className={styles.barChartTitle}>
            <FormattedMessage id="key_past_battle" />
          </Col>
        </Row>
        <BarChart
          homeLabel={`${h2hRecord.h.percent}%`}
          homePercent={h2hRecord.h.percent}
          awayLabel={`${h2hRecord.a.percent}%`}
          awayPercent={h2hRecord.a.percent}
        />
        <Row>
          <Col span={16} offset={4} className={styles.barChartInfo}>
            <div className={`${styles.info} ${styles.home}`}>
              <span className={styles.num}>{h2hRecord.h.w}</span>
              <span>W</span>
              <span className={styles.num}>{h2hRecord.h.d}</span>
              <span>D</span>
              <span className={styles.num}>{h2hRecord.h.l}</span>
              <span>L</span>
            </div>
            <div className={`${styles.info} ${styles.away}`}>
              <span className={styles.num}>{h2hRecord.a.w}</span>
              <span>W</span>
              <span className={styles.num}>{h2hRecord.a.d}</span>
              <span>D</span>
              <span className={styles.num}>{h2hRecord.a.l}</span>
              <span>L</span>
            </div>
          </Col>
        </Row>

        <Row>
          <Col span={16} offset={4} className={styles.barChartTitle}>
            <FormattedMessage id="key_recent_record" />
          </Col>
        </Row>
        <BarChart
          homeLabel={`${record.h.percent}%`}
          homePercent={record.h.linePercent}
          awayLabel={`${record.a.percent}%`}
          awayPercent={record.a.linePercent}
        />
        <Row>
          <Col span={16} offset={4} className={styles.barChartInfo}>
            <div className={`${styles.info} ${styles.home}`}>
              <span className={styles.num}>{record.h.w}</span>
              <span>W</span>
              <span className={styles.num}>{record.h.d}</span>
              <span>D</span>
              <span className={styles.num}>{record.h.l}</span>
              <span>L</span>
            </div>
            <div className={`${styles.info} ${styles.away}`}>
              <span className={styles.num}>{record.a.w}</span>
              <span>W</span>
              <span className={styles.num}>{record.a.d}</span>
              <span>D</span>
              <span className={styles.num}>{record.a.l}</span>
              <span>L</span>
            </div>
          </Col>
        </Row>
      </div>
    </div>,
    document.body,
  );
}

const MajorMatchCard: React.FC<maojorMatchProps> = (props) => {
  const intl = useIntl();
  const { data, currentUser, reportCate, reportTag, hideOdds, style, tips } = props;
  const vote = data.vote || { home_team_vote: 0, draw_vote: 0, away_team_vote: 0 };
  const home = vote.home_team_vote || 0;
  const draw = vote.draw_vote || 0;
  const away = vote.away_team_vote || 0;
  const total = home + draw + away || 1;
  const homePercent = Math.floor((home / total) * 100);
  const awayPercent = Math.floor((away / total) * 100);
  const drawPercent = draw ? 100 - awayPercent - homePercent : 0;

  const oddsEu = data && data.odds && data.odds.eu ? data.odds.eu : { away: 0, home: 0, draw: 0 };

  const stats = statesPrams[data.status];
  const isMatchStats = stats === 'subscribe' || stats === 'going';
  const isShowScore = stats === 'going' || stats === 'finish';
  const homeScore = getScore(data.home_score);
  const awayScore = getScore(data.away_score);
  const [loginVisible, setLoginVisible] = useState<boolean>(false);
  const [isVoted, setIsVoted] = useState<boolean>(vote.is_voted);
  const [voteType, setVoteType] = useState<number>(vote.vote_type);

  const [h2hData, setH2hData] = useState<HomeAwayRecord | undefined>();
  const [recentData, setRecentData] = useState<typeof h2hData>();
  const [tipsVisible, setTipsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const lang = toShortLangCode(locale.getLocale());

  const handleSubscribe = async () => {
    if (data.subscribed) {
      const result = await homeService.cancelSubscribe(data.match_id);
      if (result.success) {
        message.success(intl.formatMessage({ id: 'key_unsubscribed' }));
      }
      props.setParams(data.match_id, false);
    } else {
      if (reportCate) {
        report({
          cate: reportCate,
          action: REPORT_ACTION.major_match_remind,
          tag: `${reportTag}`,
        });
      }
      const result = await homeService.setSubscribe(data.match_id);
      handleReport({ action: 'subscribe', tag: data.status });
      if (result.success) {
        message.success(intl.formatMessage({ id: 'key_subscribed' }));
      }
      props.setParams(data.match_id, true);
    }
  };

  const handleLiveMatch = async () => {
    if (props.handleChangeLiveMatch) {
      props.handleChangeLiveMatch(data.match_id);
    }
  };

  const onSubscribeHandle = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubscribe();
    // handleLiveMatch();
    // if (getMatchStatus(data.status) === MatchStatus.Before) {
    //   // 登录后
    //   if (currentUser) {
    //     handleSubscribe();
    //   } else {
    //     setLoginVisible(true);
    //   }
    // } else {
    //   handleLiveMatch();
    // }
  };

  const onLoginHandler = () => {
    setLoginVisible(false);
    checkIsBefore(data) ? handleSubscribe() : handleLiveMatch();
  };

  const handleClick = (key: number) => {
    if (!currentUser) {
      setLoginVisible(true);
      return;
    }
    setIsVoted(true);
    setVoteType(key);
    matchService.vote({ match_id: +data.match_id, vote_type: key });
    if (reportCate) {
      report({
        cate: reportCate,
        action: [
          REPORT_ACTION.major_match_vote_d,
          REPORT_ACTION.major_match_vote_h,
          REPORT_ACTION.major_match_vote_a,
        ][key],
        tag: `${reportTag}`,
      });
    }
  };

  const getWinDrawLose = (record: TeamHistoryVSItemType[]) => {
    let w = 0;
    let d = 0;
    let l = 0;
    if (!record) return [w, d, l];
    record.slice(0, 20).forEach((t) => {
      if (t.home.score > t.away.score) {
        w += 1;
      } else if (t.home.score < t.away.score) {
        l += 1;
      } else {
        d += 1;
      }
    });
    return [w, d, l] as const;
  };

  const getHistoryMatch = async (matchId: number) => {
    const res = await fetchRankingList({
      match_id: matchId,
    });
    if (!res.success) return;
    const { history } = res.data;
    const [h2hHomeWin, h2hDraw, h2hAwayWin] = getWinDrawLose(history.vs);
    const [recentHomeWin, recentHomeDraw, recentHomeLose] = getWinDrawLose(history.home);
    const [recentAwayWin, recentAwayDraw, recentAwayLose] = getWinDrawLose(history.away);

    const h2hTotal = h2hHomeWin + h2hAwayWin;
    const h2hHomeWinPercent = h2hTotal !== 0 ? Math.round((h2hHomeWin / h2hTotal) * 100) : 0;
    const h2hAwayWinPercent = h2hTotal !== 0 ? 100 - h2hHomeWinPercent : 0;
    const recentHomeWinPercent =
      history.home?.length !== 0
        ? Math.round((recentHomeWin / Math.min(20, history.home?.length)) * 100)
        : 0;
    const recentAwayWinPercent =
      history.away?.length !== 0
        ? Math.round((recentAwayWin / Math.min(20, history.away?.length)) * 100)
        : 0;
    const recentHomeAwayTotalPercent = recentHomeWinPercent + recentAwayWinPercent;
    const recentHomeLinePercent =
      recentHomeAwayTotalPercent !== 0
        ? (recentHomeWinPercent / recentHomeAwayTotalPercent) * 100
        : 0;
    const recentAwayLinePercent =
      recentHomeAwayTotalPercent !== 0 ? 100 - recentHomeLinePercent : 0;
    setH2hData({
      h: {
        w: h2hHomeWin,
        d: h2hDraw,
        l: h2hAwayWin,
        percent: h2hHomeWinPercent,
        linePercent: h2hHomeWinPercent,
      },
      a: {
        w: h2hAwayWin,
        d: h2hDraw,
        l: h2hHomeWin,
        percent: h2hAwayWinPercent,
        linePercent: h2hAwayWinPercent,
      },
    });
    setRecentData({
      h: {
        w: recentHomeWin,
        d: recentHomeDraw,
        l: recentHomeLose,
        percent: recentHomeWinPercent,
        linePercent: recentHomeLinePercent,
      },
      a: {
        w: recentAwayWin,
        d: recentAwayDraw,
        l: recentAwayLose,
        percent: recentAwayWinPercent,
        linePercent: recentAwayLinePercent,
      },
    });
  };

  useEffect(() => {
    if (props.tips) {
      getHistoryMatch(props.tips.match_id);
    }
  }, [props.tips?.match_id]);

  return (
    <div
      className={styles.card}
      style={style}
      ref={cardRef}
      // onMouseEnter={() => setTipsVisible(true)}
      onMouseLeave={() => setTipsVisible(false)}
    >
      {tipsVisible && Boolean(tips && h2hData && recentData) && (
        <TipsPanel tips={tips!} h2hRecord={h2hData!} record={recentData!} parentRef={cardRef} />
      )}
      <LoginModal
        visible={loginVisible}
        onLogin={onLoginHandler}
        onCancel={() => {
          setLoginVisible(false);
        }}
      />
      <Link to={`/${lang}/details/${data.match_id}`} className={styles.cardContainer}>
        <Row className={styles.headContainer}>
          <Col span={3}>
            <img className={styles.matchLogo} src={data.competition_logo} />
          </Col>
          <Col span={18} className={styles.match}>
            <span className={styles.matchName}>{data.competition_name}</span>
          </Col>
          <Col span={3}>
            {/* <PopupLogin onLogin={
              () => {
                stats === 'subscribe' ? handleSubscribe() : handleLiveMatch()
              }
            }> */}
            <Icon
              className={isMatchStats ? styles.icon : styles.iconDisabled}
              component={genIcon(data)}
              onClick={(e) => {
                onSubscribeHandle(e);
              }}
            />
            {/* </PopupLogin> */}
          </Col>
        </Row>
        <Row className={styles.logoContainer}>
          <Col className={styles.logoBox} span={8}>
            <img className={styles.logo} src={data.home_team_logo || emptyLogo} />
            <div className={styles.logoText}>
              <span className={styles.logoInnerText}>{data.home_team_name}</span>
            </div>
            {tips?.bet_type === 1 && (
              <img
                onMouseEnter={() => setTipsVisible(true)}
                className={styles.lightTip}
                src={lightTipImg}
              />
            )}
          </Col>
          <Col className={styles.dateContainer} span={8}>
            {isShowScore ? (
              <div className={styles.dateText}>
                {formatDateMMDD(data.match_time, ' HH:mm')}
              </div>
            ) : (
              <div className={styles.dateText}>
                {formatDateMMDD(data.match_time)}
                {/* {moment(new Date(data.match_time * 1000)).format('DD MMM')} */}
              </div>
            )}
            {isShowScore ? (
              <div className={styles.score}>{`${homeScore} : ${awayScore}`}</div>
            ) : (
              <div className={styles.dateText}>
                {moment(new Date(data.match_time * 1000)).format('HH:mm a')}
              </div>
            )}
          </Col>
          <Col className={styles.logoBox} span={8}>
            <img className={styles.logo} src={data.away_team_logo || emptyLogo} />
            <div className={styles.logoText}>
              <span className={styles.logoInnerText}>{data.away_team_name}</span>
            </div>
            {tips?.bet_type === 3 && (
              <img
                onMouseEnter={() => setTipsVisible(true)}
                className={`${styles.lightTip} ${styles.away}`}
                src={lightTipImg}
              />
            )}
          </Col>
        </Row>
        <Row className={styles.videoContainer}>
          <img
            className={styles.videoIcon}
            src={data.playback_link ? playback : data.minutes ? liveVideo : liveVideoDisable}
          />
          <div
            className={classnames(
              styles.videoText,
              data.playback_link
                ? styles.playback
                : data.minutes
                ? styles.hasVideo
                : styles.noVideo,
            )}
          >
            {data.playback_link ? (
              <FormattedMessage id="key_live_playback" />
            ) : data.has_live ? (
              <FormattedMessage id="key_live_video" />
            ) : data.has_live_animation ? (
              <FormattedMessage id="key_live_ani" />
            ) : (
              <FormattedMessage id="key_live_video" />
            )}
          </div>
        </Row>
        <div className={styles.barContainer}>
          <div className={styles.homePercent}>{`${homePercent}%`}</div>
          <div className={styles.bar}>
            <div style={{ width: `${homePercent}%` }} className={styles.barH} />
            <div
              style={{ width: `${drawPercent}%`, left: `${homePercent}%` }}
              className={styles.barD}
            />
            <div style={{ width: `${awayPercent}%` }} className={styles.barA} />
          </div>
          <div className={styles.opponentPercent}>{`${awayPercent}%`}</div>
        </div>
        <Row className={styles.cardContainer}>
          <Col className={styles.handicap} span={8}>
            <div
              className={classnames(
                styles.home,
                isVoted ? (voteType === 1 ? styles.voted : styles.notvoted) : styles.abled,
              )}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                !isVoted && handleClick(1);
              }}
            >
              {hideOdds ? <FormattedMessage id="key_home" /> : `H ${normalizeFloat(oddsEu.home)}`}
            </div>
          </Col>
          <Col className={styles.handicap} span={8}>
            <div
              className={classnames(
                styles.draw,
                isVoted ? (voteType === 0 ? styles.voted : styles.notvoted) : styles.abled,
              )}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                !isVoted && handleClick(0);
              }}
            >
              {hideOdds ? <FormattedMessage id="key_draw" /> : `D ${normalizeFloat(oddsEu.draw)}`}
            </div>
          </Col>
          <Col className={styles.handicap} span={8}>
            <div
              className={classnames(
                styles.away,
                isVoted ? (voteType === 2 ? styles.voted : styles.notvoted) : styles.abled,
              )}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                !isVoted && handleClick(2);
              }}
            >
              {hideOdds ? <FormattedMessage id="key_away" /> : `A ${normalizeFloat(oddsEu.away)}`}
            </div>
          </Col>
        </Row>
      </Link>
    </div>
  );
};

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(MajorMatchCard);
