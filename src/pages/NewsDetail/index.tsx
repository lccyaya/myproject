import { Col, Divider, List, Row } from 'antd';
import { connect, FormattedMessage, useLocation, useParams } from 'umi';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { EyeFilled, LikeFilled, LikeOutlined } from '@ant-design/icons';
import * as newsService from '@/services/news';
import BizNews from '@/components/BizNews';
import BottomCommentList from './comment-list';
import { getIsSupported, setIsSupport } from './support';
import { abbrNum, checkIsPhone } from '@/utils/utils';

import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { report } from '@/services/ad';

import styles from './index.less';

function NewsDetail(props: {}) {
  const publishTimestamp = null;
  const location = useLocation();
  const isExternal = /\/external\//.test(location.pathname);
  const params = useParams() as Record<string, string>;
  const id = Number(params.id);
  const [isMobile, setIsMobile] = useState(false);
  const [title, setTitle] = useState('');
  const [publishedAt, setPublishedAt] = useState('');
  const [viewCount, setViewCount] = useState(0);
  const [supportCount, setSupportCount] = useState(0);
  const [content, setContent] = useState('');
  const [moreList, setMoreList] = useState<newsService.News[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [supported, setSupported] = useState(false);
  const [supportLoading, setSupportLoading] = useState(false);

  const visit = async () => {
    if (!id || Number.isNaN(id)) return;
    const res = await newsService.visitNews(id);
    if (res.success) {
      setViewCount((p) => p + 1);
    }
  };

  const getMoreList = async (publishTime: string) => {
    if (!publishTime) return;
    const res = await newsService.fetchNewsList({ page: 1, size: 10, published_time: publishTime });
    if (res.success && res.data.news.length) {
      setMoreList(res.data.news);
    }
  };

  const getDetail = async () => {
    if (!id || Number.isNaN(id)) return;
    const res = await newsService.getNews(id);
    if (!res.success) return;
    const { data } = res;
    if (data.title) {
      setTitle(data.title);
    }
    if (data.source_published_at) {
      setPublishedAt(moment(data.source_published_at).format('YYYY/MM/DD HH:mm'));
    }
    if (data.content !== content) {
      setContent(data.content);
    }
    if (data.visit) {
      setViewCount(data.visit);
    }
    if (data.support) {
      setSupportCount(data.support);
    }
    if (data.comment_count) {
      setCommentCount(data.comment_count);
    }
    if (!moreList.length && !isExternal) {
      getMoreList(data.source_published_at);
    }
  };

  const handleSupport = async () => {
    if (supportLoading) return;
    setSupportLoading(true);
    const res = await newsService.supportNews({ id, support: !supported });
    if (!res.success) return;
    if (supported) {
      setSupportCount((p) => Math.max(0, p - 1));
      setSupported(false);
      setIsSupport('news', id, false);
    } else {
      setSupportCount((p) => p + 1);
      setSupported(true);
      setIsSupport('news', id, true);
    }
    setSupportLoading(false);
    report({
      cate: REPORT_CATE.news_detail,
      action: supported ? REPORT_ACTION.news_detail_unlike : REPORT_ACTION.news_detail_like,
    });
  };

  const goToTop = () => {
    document.documentElement.scrollTop = 0;
  };

  useEffect(() => {
    const isPhone = checkIsPhone();
    setIsMobile(isPhone);
    visit();
    getDetail();
    getIsSupported('news', id).then(setSupported);
    if (publishTimestamp) {
      setPublishedAt(moment(publishTimestamp).format('YYYY/MM/DD HH:mm'));
    }
    goToTop();
  }, []);

  const more = moreList.map((n, i) => (
    <BizNews
      reportCate={REPORT_CATE.news_detail}
      reportAction={REPORT_ACTION.news_detail_more_detail}
      key={n.ID}
      news={n}
      noPaddingTop={i === 0}
      borderBottom={false}
      noPaddingBottom
      hideViewer
      hideSupporter
      replaceCurrent
    />
  ));

  return (
    <div className={styles.wrapper}>
      <Row className={`${styles.pc} ${isExternal ? styles.external : ''}`}>
        <Col span={isMobile || isExternal ? 24 : 15}>
          <div className={styles.article}>
            <div className={styles.title}>{title}</div>
            <div className={styles.metadata}>
              {publishedAt ? moment(publishedAt).format('YYYY/MM/DD HH:mm') : <span>&nbsp;</span>}
            </div>
            <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />
          </div>
          {!isExternal && (
            <div className={styles.viewerAndSupport}>
              <div className={styles.view}>
                <EyeFilled className={styles.viewIcon} />
                {viewCount} <FormattedMessage id="key_views" />
              </div>
              <div
                className={`${styles.support} ${supported ? styles.highlight : ''}`}
                onClick={handleSupport}
              >
                {supported ? <LikeFilled /> : <LikeOutlined />}
                {supportCount > 0 ? (
                  <span className={styles.supportCount}>{abbrNum(supportCount)}</span>
                ) : null}
              </div>
            </div>
          )}
          {!isExternal && <Divider style={{ marginTop: '30px' }} />}
        </Col>
        {!isMobile && !isExternal ? (
          <Col span={8} offset={1}>
            <div className={styles.hotTitle}>
              <FormattedMessage id="key_more" />
            </div>
            <div className={styles.hotList}>
              {moreList.map((n, i) => (
                <BizNews
                  reportCate={REPORT_CATE.news_detail}
                  reportAction={REPORT_ACTION.news_detail_more_detail}
                  key={n.ID}
                  news={n}
                  noPaddingTop={i === 0}
                  borderBottom={false}
                  noPaddingBottom
                  hideViewer
                  hideSupporter
                  replaceCurrent
                />
              ))}
            </div>
          </Col>
        ) : null}
      </Row>

      {/* {!isExternal && (
        <BottomCommentList
          commentCount={commentCount}
          newsId={id}
          isMobile={isMobile}
          onAddComment={() => setCommentCount((p) => p + 1)}
        />
      )} */}

      {/* {!isExternal && (
        <div className={styles.mobile}>
          <List
            className={styles.hotListWrapper}
            header={<FormattedMessage id="key_more" />}
            itemLayout="horizontal"
            dataSource={moreList}
          >
            <div className={styles.hotList}>{more}</div>
          </List>
        </div>
      )} */}
    </div>
  );
}

export default connect()(NewsDetail);
