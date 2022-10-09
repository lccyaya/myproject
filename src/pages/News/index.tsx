import styles from './index.less';
import { Col, Pagination, Row, Spin, Tabs } from 'antd';
import { FormattedMessage } from 'umi';
import React, { useEffect, useState } from 'react';
import * as newsService from '@/services/news';
import BizNews from '@/components/BizNews';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';

const { TabPane } = Tabs;

const pageSize = 10;
function News(props: { ssrLatestList?: newsService.News[]; ssrHotList?: newsService.TopInfo[] }) {
  const [isMobile, setIsMobile] = useState(false);
  const [latestListData, setLatestListData] = useState<newsService.News[]>(
    props.ssrLatestList ?? [],
  );
  const [hotListData, setHotListData] = useState<newsService.TopInfo[]>(props.ssrHotList ?? []);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const getHotData = async () => {
    const res = await newsService.fetchLatestInfo({
      page: 1,
      size: 10,
    });
    if (res.success) {
      setHotListData(res.data);
    }
  };

  const getData = async (pageNO: number) => {
    if (loading) return;
    setLoading(true);
    setPage(pageNO);
    const res = await newsService.fetchNewsList({ page: pageNO, size: pageSize });
    if (res.success) {
      setLatestListData(res.data.news);
      setTotal(res.data.total);
    }
    setLoading(false);
  };

  const handlePageChange = (value: number) => {
    getData(value);
  };

  useEffect(() => {
    const matchMedia = window.matchMedia('(max-width: 480px)');
    matchMedia.addEventListener('change', (e) => {
      setIsMobile(e.matches);
    });
    setIsMobile(document.documentElement.clientWidth <= 480);

    getData(1);
    getHotData();
  }, []);

  // useEffect(() => {
  //   if (page === 0) {
  //     getData(page + 1);
  //   }
  // }, [page]);

  const latest = latestListData.map((n) => (
    <BizNews
      reportCate={REPORT_CATE.news}
      reportAction={REPORT_ACTION.news_detail}
      key={n.ID}
      news={n}
      borderBottom
      openNewWindow
    />
  ));
  const hot = hotListData.map((n, i) => (
    <BizNews
      reportCate={REPORT_CATE.news}
      reportAction={REPORT_ACTION.news_hot_detail}
      key={n.id}
      news={n}
      noPaddingTop={i === 0}
      noPaddingBottom={true}
      hideInfo={true}
      openNewWindow
      seq={i + 1}
    />
  ));

  const pagination = (
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
  );

  return (
    <div className={styles.wrapper}>
      {!isMobile ? (
        <Row className={styles.pc}>
          <Col span={15}>
            <div className={styles.title}>
              <FormattedMessage id="key_latest_news" />
            </div>
            <Spin spinning={loading}>
              <div className={styles.latestList}>
                {latest}
                {pagination}
              </div>
            </Spin>
          </Col>
          <Col span={8} offset={1}>
            <div className={`${styles.title} ${styles.hot}`}>
              <FormattedMessage id="key_hot" />
            </div>
            <div className={styles.hotList}>{hot}</div>
          </Col>
        </Row>
      ) : (
        <div className={styles.mobile}>
          <Tabs
            defaultActiveKey="1"
            animated
            renderTabBar={(p, DefaultTabBar) => <DefaultTabBar {...p} className={styles.tabBar} />}
          >
            <TabPane tab={<FormattedMessage id="key_latest_news" />} key="1">
              <Spin spinning={loading}>
                <div className={styles.latestList}>
                  {latest}
                  {pagination}
                </div>
              </Spin>
            </TabPane>
            <TabPane tab={<FormattedMessage id="key_hot" />} key="2">
              <div className={styles.hotList}>{hot}</div>
            </TabPane>
          </Tabs>
        </div>
      )}
    </div>
  );
}

const newsPage = React.memo(News);
// @ts-ignore
// newsPage.getInitialProps = async () => {
//   const latestRes = await newsService.fetchNewsList({ page: 1, size: pageSize });
//   const hotRes = await newsService.fetchLatestInfo({
//     page: 1,
//     size: 10,
//   });
//   return {
//     ssrLatestList: latestRes.success ? latestRes.data.news : undefined,
//     ssrHotList: hotRes.success ? hotRes.data : undefined,
//   };
// };

export default newsPage;
