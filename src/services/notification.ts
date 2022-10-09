import request from '@/utils/request';
import type { Result } from '@/utils/tools';
import { normalizeResponse } from '@/utils/tools';
import { getMsgToken } from '@/services/firebase';

export async function refreshMessageToken() {
  const granted = Notification.permission === 'granted';
  const token = granted ? await getMsgToken() : '';
  return token
    ? await uploadMessageToken(token)
    : {
      success: false,
      err: new Error('Cannot get fcm token'),
      message: 'Cannot get fcm token',
    } as Result<never>;
}

export async function uploadMessageToken(token: string) {
  const result = await request('/api/upload-message-token', {
    method: 'POST',
    data: {
      token,
      platform: 'web',
    },
  });
  return normalizeResponse<Record<string, never>>(result);
}
