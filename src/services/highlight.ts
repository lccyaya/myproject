import request from '@/utils/request';
import { normalizeResponse } from '@/utils/tools';
import type { Highlight } from '@/services/match';
import { TopInfo } from '@/services/news';

export type HighlightWithMatch = Highlight & {
  title: string;
  home_team_id: number,
  away_team_id: number,
  competition_id: number,
  match_id: number;
};

export type HighlightFilter = {
  logo: string;
  name: string;
  id: number;
};

export type HighlightFilterWithAbbr = HighlightFilter & {
   name_abbr: string;
};

export async function fetchLatestHighlight(page: number, size: number) {
  const result = await request('/api/home/highlights/latest', { params: { page, size } });
  return normalizeResponse<{ high_lights: (Highlight & { match_id: number; })[]; total: number; }>(result);
}

export async function fetchHighlightFilter() {
  const result = await request('/api/video/filter');
  return normalizeResponse<{ competition: HighlightFilter[]; team: HighlightFilter[]; }>(result);
}

export async function fetchAllHighlight(params: {
  page: number;
  size: number;
  // 0-发布时间 1-点击量
  order: 0 | 1;
  competition_ids?: string;
  team_ids?: string;
}) {
  const result = await request('/api/videos', { params });
  return normalizeResponse<{ data: HighlightWithMatch[]; total: number; }>(result);
}

export async function fetchWeekTrendingHighlight() {
  const result = await request('/api/home/hot-highlights');
  return normalizeResponse<(TopInfo & { duration: number; })[]>(result);
}

export async function fetchLeagueFilter() {
  const result = await request('/api/video/pre-filter');
  return normalizeResponse<{ competition: HighlightFilterWithAbbr[]; }>(result);
}
