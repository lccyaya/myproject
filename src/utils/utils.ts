import { parse } from 'querystring';
import { APP_STORE_LINK, GOOGLE_PLAY_LINK, REPORT_CATE } from '@/constants';
import moment from 'moment';
import { isBrowser, getIntl } from 'umi';
import { getLocale } from 'umi';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);


export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const getZone = () => -new Date().getTimezoneOffset() / 60;

export const getReportCate = () => {
  const { href } = window.location;
  // const isPhone = /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent);
  if (href.includes('details')) {
    return REPORT_CATE.details;
    // eslint-disable-next-line no-else-return
  } else if (href.includes('account')) {
    return REPORT_CATE.me;
  } else if (href.includes('home')) {
    return REPORT_CATE.home;
  } else if (href.includes('info')) {
    return REPORT_CATE.info;
  } else if (href.includes('tips')) {
    return REPORT_CATE.tips;
  } else if (href.includes('expert-detail')) {
    return REPORT_CATE.expert_detail;
  } else if (href.includes('expert/rank')) {
    return REPORT_CATE.expert_ranking;
  } else if (href.includes('expert/recommend')) {
    return REPORT_CATE.scheme_match;
  } else if (href.includes('expert')) {
    return REPORT_CATE.expert;
  } else if (href.includes('scheme')) {
    return REPORT_CATE.scheme_detail
  } else if (href.includes('live')) {
    return REPORT_CATE.live
  } else if (href.includes('match')) {
    return REPORT_CATE.match
  }
  
  return REPORT_CATE.home;
};

export const checkIsPhone = () => {
  if (isBrowser()) {
    return /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent);
  } else {
    console.error('是否是手机端【预渲染]', false)
    return false
  }

};

// export const checkIsPhone = () => false;

export const callApp = async (androidUrl = '') => {
  const option = {
    scheme: {
      protocol: 'footballmaster',
    },
    intent: {
      package: 'com.sport007.android',
      scheme: 'footballmaster',
      host: 'detail',
    },
    appstore: APP_STORE_LINK,
    // yingyongbao: '//a.app.qq.com/o/simple.jsp?pkgname=com.zhihu.android',
    fallback: androidUrl || GOOGLE_PLAY_LINK,
    timeout: 2000,
  };
  const CallApp = (await import('callapp-lib')).default;
  const lib = new CallApp(option);


  lib.open({ path: '' });
};


export function getLangFromPath(pathname?: string) {
  if (isForChina()) {
    return 'zh-CN'
  }
  if (isBrowser()) {
    const lang = (pathname || window.location.pathname)
      ?.match(/^\/[a-zA-Z]+\//)?.[0]
      ?.replace(/\//g, '');
    return toStandardLangCode(lang) || localStorage.getItem('umi_locale') || 'th';
  } else {

    const lang = (global?.pathname)
      ?.match(/^\/[a-zA-Z]+\//)?.[0]
      ?.replace(/\//g, '');
    console.log('预渲染的路径', global?.pathname, toStandardLangCode(lang) || 'th')
    return toStandardLangCode(lang) || 'th';
  }
}


// export function setDefaultLangLocal() {
//   if (isServer) return;
//   if (!localStorage.getItem('umi_locale')) {
//     localStorage.setItem('umi_locale', 'en-US');
//     window.location.reload();
//   }
// }

export const randomHex = (size: number) =>
  [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('') +
  '_' +
  new Date().getTime();

export function toStandardLangCode(lang?: string) {
  if (!lang) return '';
  const supportedLangs = {
    'en-US': ['en', 'en-US'],
    'zh-CN': ['zh', 'zh-CN'],
    'th': ['th', 'th-TH'],
    'ar': ['ar'],
    'id': ['id', 'id-ID'],
    'ms': ['ms'],
    'vi': ['vi'],
    'ko': ['ko', 'ko-KR'],
    'ja': ['ja', 'ja-JP'],
    'pt': ['pt'],
    'es': ['es']
  };
  return Object.keys(supportedLangs).find((k) => supportedLangs[k].includes(lang));
}

export function toShortLangCode(lang?: string) {
  if (!lang) return '';
  return lang.replace(/-[a-zA-Z]*$/, '');
}

export function toHumanReadableLocaleStr(date: Date | number) {
  /**
   * 1 分钟以内的展示 Just now
   * 1 小时内的展示* mins ago
   * 今日内超过 1 小时的展示* hours ago
   * 昨日展示 Yesterday
   * 昨日之前的展示* days ago
   */
  const sameDaySteps = [
    {
      high: 60 * 1000,
      desc: 'key_just_now',
    },
    {
      high: 60 * 60 * 1000,
      desc: 'key_mins_ago',
    },
    {
      high: 24 * 60 * 60 * 1000,
      desc: 'key_hours_ago',
    },
  ];
  const tTs = new Date(date).getTime();
  const nTs = Date.now();
  const t = moment(date);
  const n = moment(nTs);

  const dDay = Math.max(Math.ceil((nTs - tTs) / 864e5), 0);

  let num = 0;
  let localeStr = '';
  if (t.isSame(n, 'day')) {
    const dMs = Math.max(nTs - tTs, 0);
    sameDaySteps.some((s, i, ary) => {
      if (dMs < s.high) {
        if (i !== 0) {
          num = Math.floor(dMs / ary[i - 1].high);
        }
        localeStr = s.desc;
        return true;
      }
      return false;
    });
  } else if (dDay === 1) {
    localeStr = 'key_yesterday';
  } else {
    num = dDay;
    localeStr = 'key_days_ago';
  }

  return {
    num,
    localeStr,
  };
}

export function abbrNum(num: number) {
  const keepOneDigit = (n: number) => Math.floor(n * 10) / 10;
  const steps = [
    {
      // 百万以下显示按 k 显示
      min: 10000,
      max: 1000000,
      base: 1000,
      unit: 'k',
    },
    {
      // 百万 (包含) 以上
      min: 1000000,
      max: Infinity,
      base: 1000000,
      unit: 'M',
    },
  ];

  if (num < steps[0].min) {
    return num.toString();
  }
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < steps.length; i++) {
    const c = steps[i];
    if (num >= c.min && num < c.max) {
      return `${keepOneDigit(num / c.base)}${c.unit}`;
    }
  }

  return num.toString();
}

export function formatDuration(duration: number) {
  let seconds = Math.floor(duration / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  seconds = seconds - hours * 3600 - minutes * 60;
  const s = `${seconds > 9 ? '' : 0}${seconds}`;
  let res = `${minutes}:${s}`;
  if (hours) {
    res = `${hours}:${res}`;
  }
  return res;
}

export function checkPhone(value: string) {
  if (!value) return false
  const codes = ['+1', '+66'];
  const code = value.split('-')[0];
  let phoneReg = /^\+[0-9]+-[0-9]{1,}$/g;
  if (codes.includes(code)) {
    phoneReg = /^\+[0-9]+-[0-9]{10}$/g;
  } else if (code === '+86') {
    phoneReg = /^\+[0-9]+-[0-9]{11}$/g;
  }
  return phoneReg.test(value)
}

export const sliceStr = (str: string, length = 6) => {
  if (typeof str !== 'string') return '';
  if (str.length > length) {
    return str.slice(0, length) + '...';
  }
  return str;
};

export const isForChina = () => {
  return DEPLOY_TARGET === 'cn'
}


export const isToday = (time) => {
  return (
    moment(time * 1000).format('YYYY-MM-DD') ===
    moment(new Date()).format('YYYY-MM-DD')
  );
};
export const isTomorrow = (time) => {
  const date = new Date();
  date.setTime(date.getTime() + 1000 * 60 * 60 * 24);
  return (
    moment(time * 1000).format('YYYY-MM-DD') ===
    moment(date).format('YYYY-MM-DD')
  );
};
export const isYesterday = (time) => {
  const date = new Date();
  date.setTime(date.getTime() - 1000 * 60 * 60 * 24);
  return (
    moment(time * 1000).format('YYYY-MM-DD') ===
    moment(date).format('YYYY-MM-DD')
  );
};
export const formatMatchTime = (time) => {
  if (!time) {
    return '';
  }
  const intl = getIntl();
  if (isToday(time)) {
    return intl.formatMessage(
      { id: 'key_today' },
    )+ ' ' + moment(time * 1000).format('HH:mm')
  }
  if (isTomorrow(time)) {
    return intl.formatMessage(
      { id: 'key_tomorrow' },
    )+ ' ' + moment(time * 1000).format('HH:mm')
  }
  return moment(time * 1000).format('MM-DD HH:mm')
};


export const formatTime = (time) => {
  if (!time) {
    return '';
  }
  const intl = getIntl();
  const now = new Date();
  const nowTime = now.getTime() / 1000;
  const diff = nowTime - time;
  if (diff > 60 * 60 * 24 * 7) {
    // 超过一周
    return moment(time * 1000).format('YYYY-MM-DD');
  }
  if (diff < 60) {
    // 一分钟
    return intl.formatMessage({ id: 'key_just_now' });
  } else if (diff < 60 * 60) {
    // 一个小时内
    const mins = Math.floor(diff / 60);
    return mins + intl.formatMessage(
      { id: 'key_mins_ago' },
    );
  } else if (diff > 60 * 60) {
    if (diff <= 24 * 60 * 60) {
      const hours = Math.floor(diff / 60 / 60);
      return hours + intl.formatMessage(
        { id: 'key_hours_ago' },
      );
    } else {
      const days = Math.floor(diff / 60 / 60 / 24);
      return days + intl.formatMessage(
        { id: 'key_days_ago' },
      );
    }
  }
};

export const formatGoldCoin = (val:any) => {
  if (isNaN(val)) {
    return val;
  }
  if (val * 1 > 10000) {
    return ((val * 1) / 1000).toFixed(1) + 'k';
  }
  return val + '';
};

// 时间格式化
export const formatDate = (date:any) => {
  if (getLocale() === 'zh-CN') {
    return moment(date * 1000).format('ddd,YYYY-MM-DD');
  }
  return moment(date * 1000).format('ddd,DD/MM YYYY');
};

// 时间格式化 
export const formatDateMMDD = (date:any, extra:string = '') => {
  if (getLocale() === 'zh-CN') {
    return moment(date * 1000).format('MM-DD' + extra);
  }
  return moment(date * 1000).format('DD/MM' + extra);
};

// 时间格式化
export const formatDateMMMYYYY = (date:any) => {
  return moment(date * 1000).format('MMM YYYY');
};

// 获取监听滚动的方法
export const getScrollDirection = (values: any) => {
  const { scrollTop, scrollHeight, clientHeight } = values;
  const isScroll = scrollHeight > clientHeight;
  const isBottom = scrollTop + clientHeight + 10 >= scrollHeight; // 留一点偏差的余量
  let dir = scrollTop === 0 ? 'top' : '';
  if (dir !== 'top' && isScroll && isBottom) {
    dir = 'bottom';
  }
  return dir;
}

export const getTheSame = (Aarr:any, Barr:any) => {
  let result = new Array();
  let c = Barr.toString();
  for (let i = 0; i < Aarr.length; i++) {
      if (c.indexOf(Aarr[i].toString()) > -1) { 
          for (let j = 0; j < Barr.length; j++) { 
              if (Aarr[i] == Barr[j]) { 
                  result.push(Aarr[i]);
                  break;
              }
          }
      }
  }
  return result;
}

// 是否在里面 兼容大小写
export const includes = (val:string, keyword: string) => {
  try {
    val = val.toLocaleUpperCase();
    keyword = keyword.toLocaleUpperCase();
    return val.includes(keyword);
  } catch (error) {
    return false;
  }
}