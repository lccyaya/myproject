import request from '@/utils/request';
import { normalizeResponse } from '@/utils/tools';

export async function mySchemeList(params: any) {
  const result = await request('/api/v5/scheme/list', { params });
  return normalizeResponse<{}>(result);
}

export async function getOddsList(params: any) {
  const result = await request('/api/v5/expert/match-list', { params });
  return normalizeResponse<{}>(result);
}

export async function getMatchOdds(params: any) {
  const result = await request('/api/v5/scheme/match-odds', { params });
  return normalizeResponse<{}>(result);
}

export async function addScheme(params: any) {
  const result = await request('/api/v5/scheme/add', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse<{}>(result);
}