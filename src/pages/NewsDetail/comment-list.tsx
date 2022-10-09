import { connect, FormattedMessage, useIntl } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { UserInfoType } from '@/services/user';
import { useEffect, useState } from 'react';
import * as newsService from '@/services/news';
import { Col, Comment, Divider, List, Row, Spin } from 'antd';
import styles from '@/pages/NewsDetail/index.less';
import defaultAvatar from '@/assets/icon/avatar.svg';
import Editor from '@/pages/NewsDetail/editor';
import NewsComment from '@/pages/NewsDetail/news-comment';
import MEmpty from '@/components/Empty';
import leaveComment from '@/assets/image/leave_comment.png';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';

function CommentList(props: {
  currentUser?: UserInfoType | null;
  newsId: number;
  isMobile: boolean;
  commentCount: number;
  onAddComment?: () => void;
}) {
  const intl = useIntl()
  const pageSize = 5;
  const { newsId, isMobile, commentCount, currentUser, onAddComment } = props;
  const [page, setPage] = useState(0);
  const [list, setList] = useState<newsService.NewsComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [asc, setAsc] = useState(false);
  const [editorValue, setEditorValue] = useState('');

  const getData = async (isAsc: boolean, reset = false) => {
    if (loading || (done && !reset)) return;
    setLoading(true);
    const nextPage = reset ? 1 : page + 1;
    const res = await newsService.fetchCommentList({
      news_id: newsId,
      page: nextPage,
      size: pageSize,
      asc: isAsc,
    });
    if (res.success) {
      const resList = res.data.comments || [];
      if (reset) {
        setList([...resList]);
        setDone(
          resList.length < pageSize ||
          resList.length >= res.data.total
        );
      } else {
        const length = list.length + resList.length;
        setDone(
          resList.length < pageSize ||
           length >= res.data.total
        );
        setList(prev => [
          ...prev,
          ...resList
            .filter((c) =>
              !prev.some((pc) => pc.ID === c.ID))
        ]);
      }

      setPage(nextPage);
    }
    setLoading(false);
  };

  const handleOrderClick = () => {
    if (loading) return;
    const v = !asc;
    setAsc(v);
    getData(v, true);
    report({
      cate: REPORT_CATE.news_detail,
      action: v ? REPORT_ACTION.news_detail_comment_order_earliest : REPORT_ACTION.news_detail_comment_order_latest,
    });
  };

  const sendComment = async (content: string) => {
    if (commentLoading) return;
    setCommentLoading(true);
    const res = await newsService.comment({
      news_id: newsId,
      words: content,
    });
    if (!res.success) return;
    setEditorValue('');
    const comment: newsService.NewsComment = {
      ...res.data.comment,
      user_pic: currentUser!.avatar,
      user_name: currentUser!.nickname,
      reply_to_user_name: '',
      remain_child_comment_count: 0,
      child_first_comment: null,
    };
    if (asc) {
      if (!done) return;
      setList(prev => [...prev, comment]);
    } else {
      setList(prev => [comment, ...prev]);
    }
    setCommentLoading(false);
    onAddComment?.();
    report({
      cate: REPORT_CATE.news_detail,
      action: REPORT_ACTION.news_detail_send_comment,
      tag: `${newsId}`,
    });
  };

  useEffect(() => {
    getData(asc);
  }, []);

  return <Row>
    <Col span={isMobile ? 24 : 15}>
      <div className={styles.commentList}>
        <List dataSource={['']} header={<div className={styles.header}>
          <div className={styles.count}>
            <FormattedMessage id='key_comments' /> ({commentCount})
          </div>
          <div className={styles.order} onClick={handleOrderClick}>
            <FormattedMessage id={asc ? 'key_latest' : 'key_earliest'} />&nbsp;
            {asc ? '↓' : '↑'}
          </div>
        </div>}>
          <Comment
            avatar={currentUser?.avatar || defaultAvatar}
            content={<Editor
              placeholder={intl.formatMessage({ id: 'key_add_a_comment'})}
              value={editorValue}
              onChange={setEditorValue}
              onSend={sendComment}
              onFocus={() => {
                report({
                  cate: REPORT_CATE.news_detail,
                  action: REPORT_ACTION.news_detail_add_comment,
                  tag: `${newsId}`,
                });
              }}
            />} />
        </List>
        {loading || list.length ? <List
          loading={loading}
          itemLayout="horizontal"
          dataSource={list}
          renderItem={(item, i) => (
            <NewsComment
              key={item.ID}
              onAddComment={onAddComment}
              newsId={newsId}
              isMobile={isMobile}
              data={item}
              showEditor={i === 0}
            />
          )}
        /> : <MEmpty
          pic={leaveComment}
          localeMessage={intl.formatMessage({id: 'key_say_something'})}
          textStyle={{color: '#666', fontSize: '16px'}}
        />}
        <div className={styles.loadMore}>
          {!done && list.length && !loading ? 
            <a onClick={() => getData(asc)}>
              <FormattedMessage id='key_load_more_comments' />
            </a>
          : null}
          {done && list.length
            ? <Divider>
              <FormattedMessage id='key_the_end' />
          </Divider>
            : null}
        </div>
      </div>
    </Col>
  </Row>;
}

export default connect(({ user }: ConnectState) => ({ currentUser: user.currentUser }))(CommentList);
