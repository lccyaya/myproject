import { useEffect, useState } from 'react';
import type { MatchDetails, TeamHistoryVSItemType} from '@/services/match';
import { fetchRankingList, matchDetails, matchVote, vote } from '@/services/match';
import type { matchType } from '@/services/matchPage';
import styles from './index.less';
import { Col, Row, Spin } from 'antd';
import { FormattedMessage } from '@@/plugin-locale/localeExports';
import { BarChart } from '@/components/MajorMatchCard';
import MEmpty from '@/components/Empty';
import { LikeOutlined } from '@ant-design/icons';
import type { ConnectState } from '@/models/connect';
import { useSelector } from 'umi';
import type { REPORT_CATE } from '@/constants';
import { REPORT_ACTION } from '@/constants';
import { report } from '@/services/ad';
import LoginModal from '@/components/MatchCard/Login';
import IndexTab from '@/pages/Details/IndexTab';

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

function ChartPanel(props: {
  match: matchType;
  matchDetail?: MatchDetails;
  reportCate?: REPORT_CATE;
}) {
  const { reportCate, matchDetail } = props;
  const { match_id, home_team_name, away_team_name } = props.match;
  const [loading, setLoading] = useState(true);
  const [h2hData, setH2hData] = useState<HomeAwayRecord | undefined>();
  const [recentData, setRecentData] = useState<typeof h2hData>();
  const [voteAndOddsData, setVoteAndOddsData] = useState<{
    homeSupport: number;
    awaySupport: number;
    drawSupport: number;
    homeOdds: number;
    awayOdds: number;
    drawOdds: number;
  } | undefined>();
  const [loginVisible, setLoginVisible] = useState(false);
  const [votedType, setVotedType] = useState(-1);
  const user = useSelector<ConnectState>((s) => s.user.currentUser);
  const getWinDrawLose = (record: TeamHistoryVSItemType[] = []) => {
    if (!record) return [0, 0, 0]
    let w = 0;
    let d = 0;
    let l = 0;
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
  }

  const getHistoryMatch = async () => {
    const res = await Promise.all([
      fetchRankingList({ match_id }),
      matchVote({ match_id }),
    ]);
    setLoading(false);
    if( res[0].success) {
      const { history } = res[0].data;
      const [h2hHomeWin, h2hDraw, h2hAwayWin] = getWinDrawLose(history.vs);
      const [recentHomeWin, recentHomeDraw, recentHomeLose] = getWinDrawLose(history.home);
      const [recentAwayWin, recentAwayDraw, recentAwayLose] = getWinDrawLose(history.away);

      const h2hTotal = h2hHomeWin + h2hAwayWin;
      const h2hHomeWinPercent = h2hTotal !== 0 ? Math.round(h2hHomeWin / h2hTotal * 100) : 0;
      const h2hAwayWinPercent = h2hTotal !== 0 ? 100 - h2hHomeWinPercent : 0;
      const recentHomeWinPercent = history.home?.length !== 0 ? Math.round(recentHomeWin / Math.min(20, history.home?.length) * 100) : 0;
      const recentAwayWinPercent = history.away?.length !== 0 ? Math.round(recentAwayWin / Math.min(20, history.away?.length) * 100) : 0;
      const recentHomeAwayTotalPercent = recentHomeWinPercent + recentAwayWinPercent;
      const recentHomeLinePercent = recentHomeAwayTotalPercent !== 0 ? recentHomeWinPercent / recentHomeAwayTotalPercent * 100 : 0;
      const recentAwayLinePercent = recentHomeAwayTotalPercent !== 0 ? 100 - recentHomeLinePercent : 0;
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
    }
    if (res[1].success) {
      const { home_team_vote, away_team_vote, draw_vote, odds } = res[1].data;
      const total = home_team_vote + away_team_vote + draw_vote;
      const homePercent = Math.floor(home_team_vote / total * 100);
      const awayPercent = Math.floor(away_team_vote / total * 100);
      const drawPercent = 100 - awayPercent - homePercent;
      setVoteAndOddsData({
        homeSupport: homePercent,
        awaySupport: awayPercent,
        drawSupport: drawPercent,
        homeOdds: odds?.eu?.home ?? 0,
        awayOdds: odds?.eu?.away ?? 0,
        drawOdds: odds?.eu?.draw ?? 0,
      });
    }
  };

  const handleVote = (type: number) => {
    if (votedType >= 0) return;
    if (!user) {
      setLoginVisible(true);
      return;
    }
    setVotedType(type);
    vote({
      match_id,
      vote_type: type,
    });
    if (reportCate) {
      report({
        cate: reportCate,
        action: [REPORT_ACTION.major_match_vote_d, REPORT_ACTION.major_match_vote_h, REPORT_ACTION.major_match_vote_a][type],
      });
    }
  };

  useEffect(() => {
    if (matchDetail?.is_voted) {
      setVotedType(matchDetail.vote_type);
    }
  }, [matchDetail]);

  useEffect(() => {
    getHistoryMatch();
  }, []);
  return <div className={styles.chartPanel}>
    <LoginModal
      visible={loginVisible}
      onLogin={() => {}}
      onCancel={() => { setLoginVisible(false); }}
    />
    <div className={styles.title}>
      {home_team_name}
      <span className={styles.vs}>VS</span>
      {away_team_name}
    </div>
    <Spin spinning={loading}>
      {!h2hData && !recentData && !voteAndOddsData
        ? (!loading ? <MEmpty /> : null)
        : <div className={styles.body}>
          {Boolean(h2hData) && <>
            <Row>
              <Col span={16} offset={4} className={styles.barChartTitle}>
                <FormattedMessage id='key_past_battle' />
              </Col>
            </Row>
            <BarChart
              homeLabel={`${h2hData!.h.percent}%`}
              homePercent={h2hData!.h.percent}
              awayLabel={`${h2hData!.a.percent}%`}
              awayPercent={h2hData!.a.percent}
            />
            <Row>
              <Col span={16} offset={4} className={styles.barChartInfo}>
                <div className={`${styles.info} ${styles.home}`}>
                  <span className={styles.num}>{h2hData!.h.w}</span>
                  <span>W</span>
                  <span className={styles.num}>{h2hData!.h.d}</span>
                  <span>D</span>
                  <span className={styles.num}>{h2hData!.h.l}</span>
                  <span>L</span>
                </div>
                <div className={`${styles.info} ${styles.away}`}>
                  <span className={styles.num}>{h2hData!.a.w}</span>
                  <span>W</span>
                  <span className={styles.num}>{h2hData!.a.d}</span>
                  <span>D</span>
                  <span className={styles.num}>{h2hData!.a.l}</span>
                  <span>L</span>
                </div>
              </Col>
            </Row>
          </>}
          {Boolean(recentData) && <>
            <Row>
              <Col span={16} offset={4} className={styles.barChartTitle}>
                <FormattedMessage id='key_recent_record' />
              </Col>
            </Row>
            <BarChart
              homeLabel={`${recentData!.h.percent}%`}
              homePercent={recentData!.h.linePercent}
              awayLabel={`${recentData!.a.percent}%`}
              awayPercent={recentData!.a.linePercent}
            />
            <Row>
              <Col span={16} offset={4} className={styles.barChartInfo}>
                <div className={`${styles.info} ${styles.home}`}>
                  <span className={styles.num}>{recentData!.h.w}</span>
                  <span>W</span>
                  <span className={styles.num}>{recentData!.h.d}</span>
                  <span>D</span>
                  <span className={styles.num}>{recentData!.h.l}</span>
                  <span>L</span>
                </div>
                <div className={`${styles.info} ${styles.away}`}>
                  <span className={styles.num}>{recentData!.a.w}</span>
                  <span>W</span>
                  <span className={styles.num}>{recentData!.a.d}</span>
                  <span>D</span>
                  <span className={styles.num}>{recentData!.a.l}</span>
                  <span>L</span>
                </div>
              </Col>
            </Row>
          </>}
          {Boolean(voteAndOddsData) && <>
            <Row>
              <Col span={16} offset={4} className={styles.barChartTitle}>
                <FormattedMessage id='key_who_will_win' />
              </Col>
            </Row>
            <BarChart
              homeLabel={`${voteAndOddsData!.homeSupport}%`}
              homePercent={voteAndOddsData!.homeSupport}
              awayLabel={`${voteAndOddsData!.awaySupport}%`}
              awayPercent={voteAndOddsData!.awaySupport}
              drawPercent={voteAndOddsData!.drawSupport}
            />
            <Row>
              <Col span={16} offset={4} className={`${styles.barChartInfo} ${styles.voteAndOdds}`}>
                <div className={`${styles.info} ${styles.home}`}>
                  <span className={styles.num}>H {voteAndOddsData!.homeOdds}</span>
                </div>
                <div className={`${styles.info} ${styles.home}`}>
                  D {voteAndOddsData!.drawOdds}
                </div>
                <div className={`${styles.info} ${styles.away}`}>
                  <span className={styles.num}>A {voteAndOddsData!.awayOdds}</span>
                </div>
              </Col>
              <Col span={16} offset={4}>
                <div className={styles.voteBtns}>
                  {[{type: 1, name: 'key_home'}, {type: 0, name: 'key_draw'}, {type: 2, name: 'key_away'}].map((d) => <div
                    key={d.type}
                    onClick={() => handleVote(d.type)}
                    className={`${styles.btn} ${votedType >= 0 ? styles.disabled : ''} ${votedType === d.type ? styles.active : ''}`}
                  >
                    <LikeOutlined />
                    <div className={styles.text}>
                      <FormattedMessage id={d.name} />
                    </div>
                  </div>)}
                </div>
              </Col>
            </Row>
          </>}
        </div>}
    </Spin>
  </div>
}

function TablePanel(props: {
  matchDetail?: MatchDetails;
}) {
  const { matchDetail } = props;
  return <div className={styles.tablePanel}>
    <Spin spinning={!matchDetail}>
      {Boolean(matchDetail) && <IndexTab
        smallView
        match={matchDetail!}
        matchId={matchDetail!.match_id}
      />}
    </Spin>
  </div>;
}

export default function NotStartedYet(props: {
  match: matchType;
}) {
  const { match } = props;
  const [matchDetail, setMatchDetail] = useState<MatchDetails | undefined>();
  const getMatchDetail = async () => {
    const res = await matchDetails({ match_id: match.match_id });
    if (res.success) {
      setMatchDetail(res.data);
    }
  };
  useEffect(() => {
    getMatchDetail();
  }, []);
  return <div className={styles.wrapper}>
    <ChartPanel match={match} matchDetail={matchDetail} />
    <TablePanel matchDetail={matchDetail} />
  </div>
}
