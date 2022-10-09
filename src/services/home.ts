import request from '@/utils/request';
import { normalizeResponse } from '@/utils/tools';
import type { matchType } from '@/services/matchPage';

export type tipsType = {
  away_odds: number;
  away_score: number[];
  away_team_id: number;
  away_team_logo: string;
  away_team_name: string;
  away_voted: number;
  bet_type: number;
  bet_value: number;
  competition_name: string;
  confidence: number;
  draw_odds: number;
  draw_voted: number;
  home_odds: number;
  home_score: number[];
  home_team_id: number;
  home_team_logo: string;
  home_team_name: string;
  home_voted: number;
  match_id: number;
  match_time: number;
  result: number;
  round: number;
  season_id: number;
  status: number;
};

export type tips = {
  tips: tipsType[];
};

export type bannerType = {
  id: number;
  img: string;
  landing_page: string;
};

export type banner = {
  banners: bannerType[];
};

export type voteType = {
  away_team_vote: number;
  draw_vote: number;
  home_team_vote: number;
};

export type majorMatchType = {
  match: matchType;
  vote: voteType;
};

export type majorMatch = {
  matches: majorMatchType[];
};

export async function getTipData() {
  const result = await request('/api/tips', {
    method: 'GET',
  });
  return normalizeResponse<tips>(result);
}

export async function getTipHistoryData() {
  const result = await request('/api/tips/history?page=1&size=100');
  return normalizeResponse<tips>(result);
}

export async function getMajorData() {
  const result = await request('/api/match/major', {
    method: 'GET',
  });
  return normalizeResponse<majorMatch>(result);
}

export async function getBanner() {
  const result = await request('/api/banners?position=main');
  return normalizeResponse<banner>(result);
}

export type processInfo = {
  away_logo: string;
  home_logo: string;
  match_state: number;
  start_time: number;
};

export type incident = {
  in_player_id: number;
  in_player_name: string;
  out_player_id: number;
  out_player_name: string;
  player_id: number;
  player_name: string;
  position: 0 | 1 | 2;
  second: number;
  time: number;
  type: number;
  type_v2: number;
}

export type processData = {
  info: processInfo;
  incidents: incident[];
};

export async function getProcessData(id: number) {
  const result = await request(`/api/match/process?match_id=${id}`);
  return normalizeResponse<processData>(result);
}

export type processStatsType = {
  away: number;
  home: number;
  type: number;
};

interface processStats {
  stats: processStatsType[];
}

export async function getProcessStats(id: number) {
  const result = await request(`/api/match/stats?match_id=${id}`);
  return normalizeResponse<processStats>(result);
}

interface subscribe {
  code: number;
  data: any;
  message: string;
}
export async function setSubscribe(id: number) {
  const result = await request('/api/user/subscribe', {
    method: 'POST',
    data: { match_id: id },
  });
  return normalizeResponse<subscribe>(result);
}

export async function cancelSubscribe(id: number) {
  const result = await request('/api/user/unsubscribe', {
    method: 'POST',
    data: { match_id: id },
  });
  return normalizeResponse<subscribe>(result);
}

export type top = {
  tab: 'teams' | 'leagues'
}

export type topDatum = {
  id: number;
  logo: string;
}

export type topData = {
  list: topDatum[];
}

export async function getTop(params: top) {
  const result = await request('/api/top', { params });
  return normalizeResponse<topData>(result);
}
