import request from '@/utils/request';
import { normalizeResponse } from '@/utils/tools';
import { getZone } from '@/utils/utils';
import type { POP_POSITION_MOBILE, POP_POSITION_PC, BANNER_POSITION_MOBILE, BANNER_POSITION_PC } from '@/constants';

export type IPosition = POP_POSITION_MOBILE | POP_POSITION_PC;
export type IBannerPosition = BANNER_POSITION_MOBILE | BANNER_POSITION_PC;

export type IListPopup = {
  position: IPosition;
  zone?: string;
}

export type PopupResult = {
  popup: {
    id: number;
    img: string;
    landing_page: string;
    display_url: string;
    click_url: string;
  }
}

export async function listPopup(params: IListPopup) {
  const zone = getZone();
  const { position } = params;
  const result = await request('/api/popup', { params: { zone, position } });
  return normalizeResponse<PopupResult>(result);
}

export interface IReportParams {
  cate: string;
  action: string;
  tag?: string | number;
  payload?: Record<string, number | string>;
}

export async function report(params: IReportParams) {
  const result = await request('/api/stats/report', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse<boolean>(result);
}

export type bannerType = {
  id: number;
  img: string;
  landing_page: string;
};

export type banner = {
  banners: bannerType[];
};

export async function getBanner(params: { position: IBannerPosition }) {
  const result = await request('/api/banners', { params });
  return normalizeResponse<banner>(result);
}
