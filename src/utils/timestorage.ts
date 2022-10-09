const prefix = 'TIME_STORAGE_';

/**
 * set time storage value
 * @param key
 * @param value
 * @param maxAge - ms
 */
export function timeStorageSet(key: string, value: string, maxAge: number) {
  localStorage.setItem(
    `${prefix}${key}`,
    JSON.stringify({
      expireAt: Date.now() + maxAge,
      value,
    }),
  );
}

export function timeStorageGet(key: string) {
  try {
    const v = JSON.parse(localStorage.getItem(`${prefix}${key}`) as string);
    return v.expireAt <= Date.now() ? undefined : v.value;
    // eslint-disable-next-line no-empty
  } catch (e) {}
  return undefined;
}

export function timeStorageRemove(key: string) {
  localStorage.removeItem(`${prefix}${key}`);
}
