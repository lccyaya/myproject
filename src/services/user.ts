import request from '@/utils/request';
import { normalizeResponse } from '@/utils/tools';

type SocialItem = {
  name: string;
  bound: boolean;
}

export type UserInfoType = {
  email: string;
  nickname: string;
  avatar: string;
  google: SocialItem;
  line: SocialItem;
  facebook: SocialItem;
  coin: number;
  coupon: number;
  favorite: number;
  phone: string;
  expert: {
    id: string;
    avatar: string;
    nickname: string;
    status: string;
  };
}

export async function queryCurrent() {
  const result = await request('/api/v5/user-infos');
  return normalizeResponse<UserInfoType>(result);
}

export async function uploadPic(key: string) {
  const result = await request('/api/v1/pre-sign-url', { params: { key } });
  return normalizeResponse<string>(result);
}