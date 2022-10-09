import { toShortLangCode, isForChina } from '@/utils/utils';
import { locale } from '@/app';

import firstSlideAppImgZhChina from '@/assets/page_download/first_slide_app__zh_china.png';
import firstSlideAppImgEn from '@/assets/page_download/first_slide_app.png';
import firstSlideAppImgZh from '@/assets/page_download/first_slide_app__zh.png';
import firstSlideAppImgTh from '@/assets/page_download/first_slide_app__th.png';

import mobileFirstSlideAppImgZhChina from '@/assets/page_download/m_first_slide_app__zh_china.png';
import mobileFirstSlideAppImgEn from '@/assets/page_download/m_first_slide_app.png';
import mobileFirstSlideAppImgZh from '@/assets/page_download/m_first_slide_app__zh.png';
import mobileFirstSlideAppImgTh from '@/assets/page_download/m_first_slide_app__th.png';

import matchSlideAppImgEn from '@/assets/page_download/match_slide_app.png';
import matchSlideAppImgZh from '@/assets/page_download/match_slide_app__zh.png';
import matchSlideAppImgTh from '@/assets/page_download/match_slide_app__th.png';

import liveSlideAppImgEn from '@/assets/page_download/live_slide_app.png';
import liveSlideAppImgZh from '@/assets/page_download/live_slide_app__zh.png';
import liveSlideAppImgTh from '@/assets/page_download/live_slide_app__th.png';

import betSlideAppImgEn from '@/assets/page_download/bet_slide_app.png';
import betSlideAppImgZh from '@/assets/page_download/bet_slide_app__zh.png';
import betSlideAppImgTh from '@/assets/page_download/bet_slide_app__th.png';

import infoSlideAppImgEn from '@/assets/page_download/info_slide_app.png';
import infoSlideAppImgZh from '@/assets/page_download/info_slide_app__zh.png';
import infoSlideAppImgTh from '@/assets/page_download/info_slide_app__th.png';

import matchSlideWebImgEn from '@/assets/page_download/match_slide_web.png';
import matchSlideWebImgZh from '@/assets/page_download/match_slide_web__zh.png';
import matchSlideWebImgTh from '@/assets/page_download/match_slide_web__th.png';
const supportLang = ['en', 'zh', 'th']
const shortLanCode = toShortLangCode(locale.getLocale())
const lang = supportLang.includes(shortLanCode) ? shortLanCode : 'en';

export const firstSlideAppImg = {
  en: firstSlideAppImgEn,
  zh: isForChina() ? firstSlideAppImgZhChina :firstSlideAppImgZh,
  th: firstSlideAppImgTh,
}[lang];

export const mobileFirstSlideAppImg = {
  en: mobileFirstSlideAppImgEn,
  zh: isForChina() ? mobileFirstSlideAppImgZhChina : mobileFirstSlideAppImgZh,
  th: mobileFirstSlideAppImgTh,
}[lang];

export const matchSlideAppImg = {
  en: matchSlideAppImgEn,
  zh: matchSlideAppImgZh,
  th: matchSlideAppImgTh,
}[lang];

export const matchSlideWebImg = {
  en: matchSlideWebImgEn,
  zh: matchSlideWebImgZh,
  th: matchSlideWebImgTh,
}[lang];

export const liveSlideAppImg = {
  en: liveSlideAppImgEn,
  zh: liveSlideAppImgZh,
  th: liveSlideAppImgTh,
}[lang];

export const betSlideAppImg = {
  en: betSlideAppImgEn,
  zh: betSlideAppImgZh,
  th: betSlideAppImgTh,
}[lang];

export const infoSlideAppImg = {
  en: infoSlideAppImgEn,
  zh: infoSlideAppImgZh,
  th: infoSlideAppImgTh,
}[lang];
