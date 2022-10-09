import request from '@/utils/request';
import { normalizeResponse } from '@/utils/tools';
import type { FinalScore, VOTE_TYPE } from './match';

export type hotCompetition = {
  id: any;
  name: string;
};

export type hotCompetitionList = {
  competitions: hotCompetition[];
};

export async function getHotCompetition() {
  const result = await request('/api/competition/hot');
  return normalizeResponse<hotCompetitionList>(result);
}

export type tabs = [];
export async function getMatchesTabs() {
  const result = await request('/api/v1/matches/tabs');
  return normalizeResponse<tabs>(result);
}

export async function getCalendar(data: any) {
  const result = await request('/api/v2/match/calendar', {
    method: 'POST',
    data,
  });
  return normalizeResponse<any>(result);
}

export type odds = {
  away?: number;
  closed?: number;
  draw?: number;
  home?: number;
  match_offset?: string;
  score?: string;
  state?: number;
  updated_at?: number;
};

export type oddsType = {
  asia?: odds;
  bs?: odds;
  eu?: odds;
};

export type VoteType = {
  is_voted: boolean;
  vote_type: VOTE_TYPE;
  home_team_vote: number;
  away_team_vote: number;
  draw_vote: number;
};

export type matchType = {
  away_score: number[];
  home_score: number[];
  home_team_id: number;
  home_team_logo: string;
  home_team_name: string;
  away_team_id: number;
  away_team_logo: string;
  away_team_name: string;
  competition_name: string;
  competition_logo: string;
  high_live_link: string;
  normal_live_link: string;
  live_animation_link: string;
  match_id: number;
  match_time: number;
  round: number;
  season_id: number;
  status: number;
  subscribed: boolean;
  odds: oddsType;
  currentDay?: string;
  vote: VoteType;
  minutes?: string;
  has_live_animation?: boolean;
  has_live?: boolean;
  has_highlight?: 0 | 1;
  playback_link?: string;
  final_scores: FinalScore;
};

export type matchList = {
  matches: matchType[];
};

export async function getMatchList(
  type: string | number,
  timestamp: number,
  count = 20,
  asc = false,
  season_id: string,
) {
  const result = await request(
    `/api/match/scheduler?tab_type=${type}&timestamp=${timestamp}&count=${count}&asc=${asc}&season_id=${season_id}`,
  );
  return normalizeResponse<matchList>(result);
}

export type FetchMatchListForInfoType = {
  tab_type: 0 | 1 | 2; // tab 类型，0：联赛，需要传 下面的 competition_id，1：main，2：all
  competition_id?: number;
  timestamp: number; // 比赛起始时间
  count?: number;
  asc: boolean; // false: 获取历史比赛
  zone?: number;
  tab_competition_ids?: number[];
  day_competitions_ids?: number[];
  keywords?: string;
  season_id?: number;
};

export type NewFetchMatchListParams = {
  // 1-重要 2-所有 3-订阅
  tab_type: 1 | 2 | 3;
  timestamp: number;
  init: 0 | 1;
  is_pre: boolean;
  keywords: string;
  zone: number;
  tab_competition_ids?: number[];
};

export type NewMatchList = {
  matches: matchType[];
  has_pre: boolean;
  has_next: boolean;
  pre_time: string;
  next_time: string;
};

export async function newFetchMatchList(params: NewFetchMatchListParams) {
  const data: any = params;
  if (params.tab_competition_ids) {
    data.tab_competition_ids = JSON.stringify(params.tab_competition_ids);
  }
  const result = await request('/api/v2/matches', {
    method: 'POST',
    data,
  });
  return normalizeResponse<NewMatchList>(result);
}

export type V3MatchListParams = {
  tab_type: 1 | 2 | 3; // 取 /api/v1/matches/tabs 接口的 param_value
  zone: number;
  timestamp: number;
  // competition_id: number; // 取 /api/v1/matches/tabs 接口的 param_value
  // competition_ids: number[]; // 选中的联赛id
  page: number;
  size: number;
};
export type V3MatchList = {
  matches: matchType[];
  timestamp: number;
  competition_ids?: number[];
};
export async function MatchListV3(params: any) {
  const data: any = params;
  const result = await request('/api/v3/matches', {
    method: 'POST',
    data,
  });
  return normalizeResponse<V3MatchList>(result);
}
export async function MatchByIds(params: any) {
  const result = await request('/api/v1/matches/by-ids', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse<any>(result);
}

export async function fetchMatchListForInfo(params: FetchMatchListForInfoType) {
  const data: any = params;
  if (params.tab_competition_ids) {
    data.tab_competition_ids = JSON.stringify(params.tab_competition_ids);
  }
  if (params.day_competitions_ids) {
    data.day_competitions_ids = JSON.stringify(params.day_competitions_ids);
  }
  const result = await request('/api/match/scheduler', { params: data });
  return normalizeResponse<matchList>(result);
}

export type liveMatchListType = {
  timestamp: number;
  page: number;
  size: number;
};
export async function fetchLiveMatchList(params: liveMatchListType) {
  const result = await request('/api/match/live', { params });
  return normalizeResponse<matchList>(result);
}

export async function sortCompetitions(params: number[]) {
  const result = await request('/api/user/competitions', {
    method: 'POST',
    data: { competition_ids: params },
  });
  return normalizeResponse<matchList>(result);
}

export type getSubscribeListType = {
  timestamp: number; // 比赛起始时间
  count?: number;
  asc: boolean; // false: 获取历史比赛
  zone?: number;
  tab_competition_ids?: number[];
  day_competitions_ids?: number[];
  keywords?: string;
};

export async function getSubscribeList(params: getSubscribeListType) {
  const data: any = params;
  if (params.tab_competition_ids) {
    data.tab_competition_ids = JSON.stringify(params.tab_competition_ids);
  }
  if (params.day_competitions_ids) {
    data.day_competitions_ids = JSON.stringify(params.day_competitions_ids);
  }
  const result = await request('/api/user/subscribe', { params: data });
  return normalizeResponse<matchList>(result);
}

export type subscribeTeams = {
  page: number;
  size: number;
};

export type subscribeTeamsType = {
  id: number;
  logo: string;
  name: string;
  follow?: boolean;
};

export async function getSubscribeTeams(params: subscribeTeams) {
  const result = await request('/api/user/subscribe/teams', { params });
  return normalizeResponse<{ team: subscribeTeamsType[] }>(result);
}

export type team = {
  team_id: number;
  team_logo: string;
  team_name: string;
  subscribed: boolean;
};

export type competitionList = {
  name: string;
  teams: team[];
};

export type competitionTab = {
  list: competitionList[];
};

export async function getCompetitionTab() {
  const result = await request('/api/competition/tab');
  return normalizeResponse<competitionTab>(result);
}

export type subscribeype = {
  id: number;
  logo: string;
  name: string;
};

export type subscribeTeamType = {
  team: subscribeype[];
};

export async function subscribeTeam(params: number[]) {
  const result = await request('/api/user/subscribe_team', {
    method: 'POST',
    data: { team_ids: params },
  });
  return normalizeResponse<subscribeTeamType>(result);
}

export async function unsubscribeTeam(params: number) {
  const result = await request('/api/user/unsubscribe_team', {
    method: 'POST',
    data: { team_id: params },
  });
  return normalizeResponse<subscribeTeamType>(result);
}

export async function teamSearch(params: { name: string }) {
  const result = await request('/api/team/search', { params });
  return normalizeResponse<{ list: team[] }>(result);
}

export type info = {
  founded: number;
  website: string;
};

export type infoType = { info: info; honor_ids: number[]; honor: any };

export async function teamInfo(params: { team_id: number }) {
  const result = await request('/api/team/info', { params });
  return normalizeResponse<infoType>(result);
}

export type schedulerType = {
  team_id: number;
  timestamp: number;
  asc: boolean;
  count: number;
  zone: number;
};

export type teamSchedulerType = {
  subscribed: boolean;
  team_logo: string;
  team_name: string;
  matches: matchType[];
};

export async function teamScheduler(params: schedulerType) {
  const result = await request('/api/team/scheduler', { params });
  return normalizeResponse<teamSchedulerType>(result);
}

export type teamPlayersInputType = {
  team_id: number;
};

export type coachType = {
  age: number;
  id: number;
  logo: string;
  name: string;
  nationality: string;
};

export type playerType = {
  age: number;
  assists: number;
  goals: number;
  id: number;
  logo: string;
  matches: number;
  mkt_val: number;
  mkt_val_currency: string;
  name: string;
  nationality: string;
  position: string;
  shirt_number: number;
};

export type teamPlayersType = {
  coach: coachType[];
  squad: playerType[];
};
export type expertRecommendListParam = {
  page: number;
  size: number;
  league_id: number;
};
export type expertRecommend = {
  match_id: number;
  match_time: number;
  home_name: string;
  home_logo: string;
  away_name: string;
  away_logo: string;
  scheme_num: number;
  league_name: string;
};
export type expertRecommendList = {
  total: number;
  list: expertRecommend[];
};

export async function teamPlayers(params: teamPlayersInputType) {
  const result = await request('/api/team/players', { params });
  return normalizeResponse<teamPlayersType>(result);
}

export async function recommendList(params: expertRecommendListParam) {
  const result = await request('/api/expert/recommend-list', { params });
  return normalizeResponse<expertRecommendList>(result);
}
