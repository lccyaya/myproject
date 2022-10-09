import request from '@/utils/request';
import { normalizeResponse } from '@/utils/tools';
export async function getTipsStatus() {
  const result = await request('/api/tips/status', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  });
  return normalizeResponse<{}>(result);
}