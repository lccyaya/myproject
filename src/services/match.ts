import request from '@/utils/request';
import { normalizeResponse } from '@/utils/tools';
import type { ReactNode } from 'react';

export type TeamRankingItemType = {
  against: number; // 丢球？？？
  position: number; // 排名位置
  pts: number; // 积分
  played: number; // 已完成场次
  won: number; // 胜场
  drawn: number; // 平
  lost: number; // 败场
  goals: number; // 进球
  away_goals: number; // 丢球
  match_state: number; // 未知
  diff: number; // 未知
  team_id: number; // 球队 ID
  team_name: string; // 球队名
  team_logo?: string; // 球队 log
};

type H2HScoreType = {
  team_id: number; // id
  score: number; // 得分数
  team_name: string; // 队名
  team_logo: string; // logo
};

export type TeamHistoryVSItemType = {
  match_id: number; // 比赛 ID
  competition_id: number; // 联赛 ID
  competition_name: string; // 联赛名字
  match_state: number; // 比赛状态 未用到
  match_time: number; // 比赛时间戳
  home: H2HScoreType;
  away: H2HScoreType;
};

export type MatchRankingType = {
  tables: {
    all: TeamRankingItemType[];
    home: TeamRankingItemType[];
    away: TeamRankingItemType[];
  };
  history: {
    vs: TeamHistoryVSItemType[];
    home: TeamHistoryVSItemType[];
    away: TeamHistoryVSItemType[];
  };
};

export type FetchMatchDetailsParams = {
  match_id: number;
};

export async function fetchRankingList(params: FetchMatchDetailsParams) {
  const result = await request('/api/match/table', { params });
  return normalizeResponse<MatchRankingType>(result);
}

export type OddsItemType = {
  away: number; //
  closed: number; //
  draw: number; // 平
  home: number;
  match_offset: string; // 比赛时间
  score: string; // 比分
  state: number; // 状态
  updated_at: number;
};

export type OddsCompanyType = {
  id: number;
  hot: boolean;
  init: OddsItemType;
  name: string;
  spot: OddsItemType;
};

export type OddsType = 'asia' | 'bs' | 'eu';

export type OddDetailsType = {
  asia: OddsCompanyType[];
  bs: OddsCompanyType[];
  eu: OddsCompanyType[];
};

export async function fetchOdds(params: FetchMatchDetailsParams) {
  const result = await request('/api/match/odds', { params });
  return normalizeResponse<OddDetailsType>(result);
}

export type FetchCompanyHistoryOddsParams = {
  match_id: number;
  company_id: number;
};

export async function fetchCompanyHistoryOdds(params: FetchCompanyHistoryOddsParams) {
  const result = await request('/api/match/odds-hist', { params });
  return normalizeResponse<OddDetailsType>(result);
}

export type Highlight = {
  ID: number;
  cover_img_url: string;
  url: string;
  backup_url: string;
  duration: number;
  title: string;
}

export type Round = {
  group_name: string;
  round_name: string;
  stage_name: string;
}

export type FinalScore = {
  // 是否有点球大战
  has_penalty: boolean;
  // 是否有加时赛
  has_ot: boolean;

  // 主队常规时间得分
  home: number;
  // 主队上半场得分
  first_half_home: number;
  // 主队下半场得分
  second_half_home: number;
  // 加时赛主队得分
  ot_home: number;
  // 点球大战主队得分
  penalty_home: number;

  // 客队常规时间得分
  away: number;
  // 客队上半场得分
  first_half_away: number;
  // 客队下半场得分
  second_half_away: number;
  // 加时赛客队得分
  ot_away: number;
  // 点球大战客队得分
  penalty_away: number;
  // 0-平 1-主队胜 2-客队胜
  win: 0 | 1 | 2;
}

export type MatchDetails = {
  has_scheme: boolean; // 是否有方案页面
  season_id: number; // 赛季
  away_score: number[];
  away_team_logo: string;
  away_team_name: string;
  competition_name: string;
  home_score: number[];
  home_team_logo: string;
  home_team_name: string;
  match_time: number;
  match_id: number;
  high_live_link: string;
  normal_live_link: string;
  status: number; // 比赛状态，0 比赛异常，说明：暂未判断具体原因的异常比赛，可能但不限于：腰斩、取消等等，建议隐藏处理，1 未开赛，2 上半场，3 中场，4 下半场，5 加时赛，6 加时赛 (弃用)，7 点球决战，8 完场，9 推迟，10 中断，11 腰斩，12 取消，13 待定
  confidence: number;
  bet_type: number; // 压注的球队类型，1：主赢，2：平局，3：客赢。0 表示没有 tip 信息
  bet_value: number;
  vote_type: VOTE_TYPE;
  is_voted: boolean;
  is_subscribed: boolean;
  live_animation_link?: string;
  away_team_id?: number;
  home_team_id?: number;
  has_live?: boolean;
  has_live_animation?: boolean;
  minutes: string;
  has_highlight: 0 | 1;
  highlights_count: number;
  highlights: Highlight[];
  final_scores: FinalScore;
  playback_link?: string;
  round?: Round;
};

export async function matchDetails(params: FetchMatchDetailsParams) {
  const result = await request('/api/match', { params });
  return normalizeResponse<MatchDetails>(result);
}

export type Incident = {
  type: number;
  type_v2: number;
  time: string;
  minute: number;
  addtime: number;
  belong: number;
  text: string;
  home_score: number;
  away_score: number;
  in_player: null;
  out_player: null;
  player: {
    id: number;
    name: string;
    logo: string;
  };
};

export type PlayerItem = {
  first: 1 | 0;
  id: number;
  incidents: null | Incident[];
  logo: string;
  name: string | ReactNode;
  position: string;
  rating: string;
  shirt_number: number;
  team_id: number;
  x: number;
  y: number;
};

type AbsenceItem = {
  id: number;
  name: string;
  position: string;
  logo: string;
  reason: string;
  missed_matches: number;
  start_time: number;
  end_time: number;
  type: number;
};

type Coach = {
  id: number;
  logo: string;
  name: string;
};

export type MatchLineup = {
  away: PlayerItem[];
  away_absence: AbsenceItem[];
  away_coach: Coach;
  away_formation: string;
  away_name: string;
  confirmed: boolean;
  home: PlayerItem[];
  home_absence: AbsenceItem[];
  home_coach: Coach;
  home_formation: string;
  home_name: string;
};

export enum MatchEventType {
  // 黄牌
  YellowCard = 3,
  // 红牌
  RedCard = 4,
  // 换人
  Substitution = 9,
  // 进球
  Goal = 1,
  // 点球进球
  PenaltyGoal = 8,
  // 点球未进
  PenaltyMissed = 16,
  // 乌龙球
  OwnGoal = 17,
  // 视频判定
  Var = 28,
  // 中场
  HalfTime = 11,
  // 常规赛结束
  RegularEnd = 12,
  // 半场比分
  HalfTimeScore = 13,
  // 两黄变红
  TwoYellowToRed = 15,
  // 伤停补时
  InjuryTime = 19,
  // 加时赛结束
  OtEnd = 26,
  // 点球大战结束
  PenaltyEnd = 27,
}

export type MatchEvent = {
  time: number;
  type: MatchEventType;
  player_name: string;
  type_v2: number;
  // 0-中立 1-主队 2-客队
  position: number;
  in_player_name: string;
  out_player_name: string;
  var_result: number;
  var_reason: number;
  home_score: number;
  away_score: number;
  assist1_name: string;
  assist2_name: string;
  event_pic_url: string;
  reason_text: string;
}

export async function matchLineup(params: FetchMatchDetailsParams) {
  const result = await request('/api/match/lineup', { params });
  return normalizeResponse<MatchLineup>(result);
}

export enum VOTE_TYPE {
  DRAW = 0,
  HOME = 1,
  AWAY = 2,
}

export type MatchHandler = {
  is_subscribed: boolean;
  is_voted: boolean;
  vote_type: VOTE_TYPE; // ;=0:draw,1:home,2:away
};

export async function matchHandlerInfo(params: FetchMatchDetailsParams) {
  const result = await request('/api/user/match', { params });
  return normalizeResponse<MatchHandler>(result);
}

// vote
export type VoteParams = {
  match_id: number;
  vote_type: VOTE_TYPE;
};
export async function vote(params: VoteParams) {
  const result = await request('/api/user/vote', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse<boolean>(result);
}

export type UnVoteParams = {
  match_id: number;
};
export async function unVote(params: UnVoteParams) {
  const result = await request('/api/user/unvote', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse<boolean>(result);
}

export type OddsItem = {
  updated_at: string;
  match_offset: string;
  home: number;
  draw: number;
  away: number;
  state: number;
  closed: number;
  score: string;
} | null;

export type MatchVoteInfo = {
  home_team_vote: number;
  away_team_vote: number;
  draw_vote: number;
  odds: {
    eu: OddsItem;
    asia: OddsItem;
    bs: OddsItem;
  };
};

export async function matchVote(params: UnVoteParams) {
  const result = await request('/api/match/vote', { params });
  return normalizeResponse<MatchVoteInfo>(result);
}

export type MatchStats = {
  away: number;
  home: number;
  type: number;
};

export async function getMatchStats(match_id: number) {
  const result = await request(`/api/match/stats?match_id=${match_id}`);
  return normalizeResponse<{ stats: MatchStats[]; }>(result);
}

export async function listMatchEvents(match_id: string) {
  const result = await request(`/api/match/events?match_id=${match_id}`);
  return normalizeResponse<{ incidents?: MatchEvent[]; final_scores: FinalScore; info?: { match_state: number; }; }>(result);
}

export async function getSeasonList(competition_id: string) {
  const result = await request(`/api/competition/season?competition_id=${competition_id}`);
  return normalizeResponse<{}>(result);
}
