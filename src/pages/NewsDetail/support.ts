import { get, set, del } from 'idb-keyval';

export type ObjectType = 'news' | 'comment';

function getKey(type: ObjectType, id: number) {
  return `${type.toUpperCase()}_${id}`;
}

export async function getIsSupported(type: ObjectType, id: number) {
  try {
    const value = await get(getKey(type, id));
    return Boolean(value);
  } catch (e) {
    console.error('Error in getIsSupported:', e);
  }
  return false;
}

export async function setIsSupport(type: ObjectType, id: number, support: boolean) {
  const key = getKey(type, id);
  try {
    if (support) {
      await set(key, 1);
    } else {
      await del(key);
    }
  } catch (e) {
    console.error('Error in setIsSupport:', e);
  }
}
