import { REPORT_CATE } from '@/constants';

type PageInfo = {
  key: string;
  regex: RegExp;
  cate: REPORT_CATE;
  isNav?: boolean;
};

function createPageInfoArray<T extends readonly PageInfo[] & { key: V }[], V extends string>(
  ...args: T
) {
  return args;
}

export const pages = createPageInfoArray(
  {
    key: 'home',
    regex: /\/home\/*/,
    cate: REPORT_CATE.home,
    isNav: true,
  },
  {
    key: 'live',
    regex: /\/live\/*/,
    cate: REPORT_CATE.live,
    isNav: true,
  },
  {
    key: 'match',
    regex: /\/match\/*/,
    cate: REPORT_CATE.match,
    isNav: true,
  },
  {
    key: 'views_match',
    regex: /\/views\/match\/*/,
    cate: REPORT_CATE.match,
    isNav: true,
  },
  {
    key: 'match_detail',
    regex: /\/details\//,
    cate: REPORT_CATE.match_detail,
  },
  {
    key: 'tips',
    regex: /\/tips\/*/,
    cate: REPORT_CATE.tips,
    isNav: true,
  },
  {
    key: 'info',
    regex: /\/info\/*/,
    cate: REPORT_CATE.info,
    isNav: true,
  },
  {
    key: 'team_detail',
    regex: /\/teamdetails\//,
    cate: REPORT_CATE.teamdetails,
  },
  {
    key: 'download',
    regex: /\/download\/*/,
    cate: REPORT_CATE.download,
  },
  {
    key: 'acccount',
    regex: /\/account\/*/,
    cate: REPORT_CATE.me,
  },
  {
    key: 'news',
    regex: /\/news\/*$/,
    cate: REPORT_CATE.news,
    isNav: true,
  },
  {
    key: 'recommend',
    regex: /\/recommend\/*$/,
    cate: REPORT_CATE.recommend,
    isNav: true,
  },
  {
    key: 'expert',
    regex: /\/expert\/*/,
    cate: REPORT_CATE.expert,
    isNav: true,
  },
  {
    key: 'mine',
    regex: /\/mine\/*/,
    cate: REPORT_CATE.mine,
    isNav: true,
  },
  {
    key: 'news_detail',
    regex: /\/newsdetail\/*/,
    cate: REPORT_CATE.news_detail,
  },
  {
    key: 'highlight',
    regex: /\/highlight\/*/,
    cate: REPORT_CATE.highlight,
    isNav: true,
  },
);

// 把 pages 数组中的 key 字段转成 union 类型，home | live | match | ...
export type Page = typeof pages[number]['key'];

export const pageRegex: Map<Page, RegExp> = new Map(pages.map((p) => [p.key, p.regex]));

export function getPageFromPath(path: string) {
  return pages.find((p) => p.regex.test(path));
}
