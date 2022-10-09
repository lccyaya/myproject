import request from '@/utils/request';
import { normalizeResponse } from '@/utils/tools';
import type { MatchRankingType } from '@/services/match';

export type CompetitionItemType = {
  id: number;
  name: string;
}

export type CompetitionsCategoryItemType = {
  name: string;
  competitions: CompetitionItemType[];
}

export type CompetitionCategoryType = {
  categories: CompetitionsCategoryItemType[];
}

export async function category() {
  const result = await request('/api/competition/category');
  return normalizeResponse<CompetitionCategoryType>(result);
}

export type FetchRankingParams = {
  competition_id: number;
  season_id?: number
}
export async function ranking(params: FetchRankingParams) {
  const result = await request('/api/competition/table', { params });
  return normalizeResponse<MatchRankingType>(result);
}

export type ClassifiedCompetitionItem = {
  id: number;
  name: string;
  logo: string;
}

export type ClassifiedCompetition = {
  name: string;
  competitions: ClassifiedCompetitionItem[];
}

export type ClassifiedCompetitionRes = {
  categories: ClassifiedCompetition[];
}

export async function classify() {
  const result = await request('/api/competition/filter');
  return normalizeResponse<ClassifiedCompetitionRes>(result);
}

// v2 联赛分类列表
export type FetchFilterParams = {
  tab?: string
}
export async function competitionFilter(params: FetchFilterParams) {
  const result = await request('/api/v2/competition/filter', { params });
  return normalizeResponse<any>(result);
}

export async function save(competition_ids: number[]) {
  const result = await request('/api/competition/filter/save', {
    method: 'POST',
    data: { competition_ids, }
  });
  return normalizeResponse<{}>(result);
}
