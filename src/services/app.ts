import request from '@/utils/request';
import { normalizeResponse } from '@/utils/tools';

export async function getDownloadLinkByChannel(channel: string | "") {
  const result = await request('/api/channel/download_url', { params: { code: channel } });
  return normalizeResponse<{ download_url: string; }>(result);
}
