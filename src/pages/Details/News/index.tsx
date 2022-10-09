import type { News } from '@/services/news';
import { fetchNewsList } from '@/services/news';
import BizNews from '@/components/BizNews';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import MEmpty from '@/components/Empty';
import { useEffect, useState } from 'react';
import styles from './index.less';
import { Pagination, Spin } from 'antd';
import { checkIsPhone } from '@/utils/utils';

const pageSize = 10;

export default function DetailNews(props: {
  showEmpty: boolean;
  onRecordTotalLoaded: (total: number) => void;
  matchId: number;
}) {
  const { onRecordTotalLoaded, matchId, showEmpty } = props;

  const isMobile = checkIsPhone();
  const [initializing, setInitializing] = useState(true);
  const [data, setData] = useState<News[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const getData = async (pageNO: number) => {
    if (loading) return;
    setLoading(true);
    setPage(pageNO);
    const res = await fetchNewsList({
      page: pageNO,
      size: pageSize,
      match_id: matchId,
    });
    if (res.success) {
      setData(res.data.news);
      setTotal(res.data.total);
    }
    if (initializing) {
      onRecordTotalLoaded(res.success ? res.data.total : 0);
    }
    setInitializing(false);
    setLoading(false);
  };

  const handlePageChange = (value: number) => {
    getData(value);
  };

  useEffect(() => {
    handlePageChange(page);
  }, []);

  if (initializing) {
    return null;
  }

  if (!data.length) {
    return showEmpty ? <MEmpty localeMessage="key_no_info" /> : null;
  }

  return (
    <Spin spinning={loading}>
      <div className={styles.wrapper}>
        {data.map((d) => (
          <BizNews
            news={d}
            key={d.ID}
            borderBottom
            openNewWindow
            hideTime
            reportCate={REPORT_CATE.match_detail}
            reportAction={REPORT_ACTION.news_detail}
          />
        ))}

        {
          <div className={styles.pagination}>
            <Pagination
              current={page}
              size={isMobile ? 'small' : 'default'}
              onChange={handlePageChange}
              showQuickJumper={!isMobile}
              total={total}
              showSizeChanger={false}
              hideOnSinglePage
            />
          </div>
        }
      </div>
    </Spin>
  );
}
