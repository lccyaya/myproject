import request from '@/utils/request';
import { normalizeResponse } from '@/utils/tools';

export async function sign(key: string) {
  const result = await request('/api/v1/pre-sign-url', { params: { key } });
  return normalizeResponse<string>(result);
}
export async function signUrl(key: string) {
  const result = await request('/api/v1/pre-sign-url', { params: { key } });
  return normalizeResponse<string>(result);
}
