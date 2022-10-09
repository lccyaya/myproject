import request from '@/utils/request';
import type { Result } from '@/utils/tools';
import { normalizeResponse } from '@/utils/tools';
import { ABTEST_UN_LOGGED_NAME, ABTEST_USER_VERSION_PREFIX } from '@/constants';
import { getAPIHost } from '@/utils/env';
import { getFingerPrint } from '@/utils/fingerprint';
import { isBrowser } from 'umi';

export async function getVersion(nickname?: string) {
  const key = nickname ? `${ABTEST_USER_VERSION_PREFIX}${nickname}` : ABTEST_UN_LOGGED_NAME;
  const localVersion = localStorage.getItem(key);
  if (localVersion === 'A' || localVersion === 'B') {
    return {
      success: true,
      data: localVersion,
    } as Result<'A' | 'B'>;
  }

  const result = await request('/api/ab/distribution');
  // 0-A 1-B
  const normalized = normalizeResponse<0 | 1>(result);
  let mapped: Result<'A' | 'B'>;
  if (normalized.success) {
    const version = (['A', 'B'] as const)[normalized.data];
    mapped = {
      ...normalized,
      data: version,
    };
    localStorage.setItem(key, version);
  } else {
    mapped = normalized;
  }
  return mapped;
}

/**
 * active report
 * @param duration - active seconds
 */
export async function active(duration: number) {
  if (isBrowser()) {
    const blob = new Blob(
      [
        JSON.stringify({
          duration,
          'x-device-id': await getFingerPrint(),
        }),
      ],
      { type: 'application/json; charset=UTF-8' },
    ); // the blob
    const url = `${getAPIHost()}/api/ab/active`;
    return navigator.sendBeacon(url, blob);
  }

}
