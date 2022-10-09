import News from '@/components/News';
import type * as newsService from '@/services/news';
import type { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { report } from '@/services/ad';
import type { CSSProperties } from 'react';

export default function BizNews(props: {
  news: newsService.News | newsService.TopInfo;
  borderTop?: boolean;
  borderBottom?: boolean;
  hideInfo?: boolean;
  noPaddingTop?: boolean;
  noPaddingBottom?: boolean;
  openNewWindow?: boolean;
  hideTime?: boolean;
  hideViewer?: boolean;
  hideSupporter?: boolean;
  replaceCurrent?: boolean;
  reportCate?: REPORT_CATE;
  reportAction?: REPORT_ACTION;
  reportTag?: string;
  coverRight?: boolean;
  style?: CSSProperties;
  titleHoverEffect?: boolean;
  seq?: number;
}) {
  const { news: n, reportCate, reportAction, reportTag } = props;
  const handleClick = () => {
    if (reportCate && reportAction) {
      report({
        cate: reportCate,
        action: reportAction,
        tag: reportTag || '',
      })
    }
  };
  return <News
    id={`${'ID' in n ? n.ID : n.id}`}
    title={n.title}
    viewer={n.visit}
    publishedAt={'source_published_at' in n
      ? new Date(n.source_published_at)
      : Date.now()}
    supporter={n.support}
    thumb={n.cover_img_url}
    onClick={handleClick}
    {...props}
  />;
}
