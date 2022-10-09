import { connect, useIntl } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { UserInfoType } from '@/services/user';
import * as newsService from '@/services/news';
import { abbrNum, toHumanReadableLocaleStr } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { Comment, Spin } from 'antd';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import defaultAvatar from '@/assets/icon/avatar.svg';
import { FormattedMessage } from 'umi';
import Editor from './editor';
import styles from './index.less';
import msgIcon from '@/assets/icon/message.svg';
import { getIsSupported, setIsSupport } from './support';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';

function NewsComment(props: {
  currentUser?: UserInfoType | null;
  newsId: number;
  showEditor?: boolean;
  isMobile: boolean;
  data: newsService.NewsComment;
  level?: number;
  onAddComment?: () => void;
  appendComment?: (comment: newsService.NewsComment) => void;
}) {
  const { newsId, currentUser, isMobile, data, level, onAddComment } = props;
  const { num, localeStr } = toHumanReadableLocaleStr(new Date(data.CreatedAt));
  const [remain, setRemain] = useState(data.remain_child_comment_count || 0);
  const [children, setChildren] = useState<newsService.NewsComment[]>(data.child_first_comment ? [data.child_first_comment] : []);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [editorValue, setEditorValue] = useState('');
  const [support, setSupport] = useState(data.support);
  const [supported, setSupported] = useState(false);
  const [supportLoading, setSupportLoading] = useState(false);

  const appendComment = !level || level === 1
    ? (comment: newsService.NewsComment) => {
      if (remain > 0) {
        setRemain(p => p + 1);
      } else {
        setChildren(prev => [...prev, comment]);
      }
      onAddComment?.();
    }
    : props.appendComment;

  const getData = async (asc = false) => {
    if (loading || remain <= 0) return;
    const nextPage = page + 1;
    const res = await newsService.fetchCommentList({
      news_id: newsId,
      parent_id: data.ID,
      first_child_comment_id: data.child_first_comment?.ID,
      page: nextPage,
      size: 10,
      asc,
    });
    if (res.success) {
      setChildren(prev => [
        ...prev,
        ...(res.data.comments || [])
          .filter((c) =>
            !prev.some((pc) => pc.ID === c.ID))
      ]);
      setRemain(prev => prev - (res.data.comments || []).length);
      setPage(nextPage);
    }
    setLoading(false);
  };

  const sendComment = async (content: string) => {
    if (commentLoading) return;
    setCommentLoading(true);
    const res = await newsService.comment({
      news_id: newsId,
      comment_id: data.ID,
      words: content,
    });
    if (!res.success) return;
    setEditorValue('');
    setShowEditor(false);
    const comment: newsService.NewsComment = {
      ...res.data.comment,
      user_pic: currentUser!.avatar,
      user_name: currentUser!.nickname,
      reply_to_user_name: data.user_name,
      remain_child_comment_count: 0,
      child_first_comment: null,
    };

    setCommentLoading(false);
    appendComment?.(comment);
  };

  const handleSupport = async () => {
    if (supportLoading) return;
    setSupportLoading(true);
    const res = await newsService.supportComment({
      id: data.ID,
      support: !supported,
    });
    if (!res.success) return;
    if (supported) {
      setSupport(p => Math.max(0, p - 1));
      setSupported(false);
      setIsSupport('comment', data.ID, false);
      report({
        cate: REPORT_CATE.news_detail,
        action: REPORT_ACTION.news_detail_unlink_comment,
      });
    } else {
      setSupport(p => p + 1);
      setSupported(true);
      setIsSupport('comment', data.ID, true);
      report({
        cate: REPORT_CATE.news_detail,
        action: REPORT_ACTION.news_detail_like_comment,
      });
    }
    setSupportLoading(false);
  };

  useEffect(() => {
    getIsSupported('comment', data.ID)
      .then(setSupported);
  }, []);

  const replyTo = useIntl().formatMessage({ id: 'key_reply_to'});

  return <li>
    <Comment
      actions={[
        <div
          className={styles.commentAction}
          onClick={() => {
            setShowEditor(!showEditor);
            report({
              cate: REPORT_CATE.news_detail,
              action: REPORT_ACTION.news_detail_reply_comment,
            });
          }}
          key='replay'
        >
          <img src={msgIcon} alt='' className={styles.icon} />
          <div className={styles.text}>
            <FormattedMessage id='key_reply' />
          </div>
        </div>,
        <div
          className={`${styles.commentAction} ${styles.support} ${supported ? styles.highlight : ''}`}
          onClick={handleSupport}
          key="action"
        >
          {supported
            ? <LikeFilled className={styles.icon} />
            : <LikeOutlined className={styles.icon} />}
          {support > 0
            ? <div className={styles.text}>{abbrNum(support)}</div>
            : null}
        </div>,
      ]}
      author={data.user_name || ''}
      avatar={data.user_pic || defaultAvatar}
      content={level && level > 1 ? <>
      {replyTo} <span style={{color: '#FA5900'}}>{data.reply_to_user_name}: </span>{data.words}
      </> : data.words}
      datetime={<span>{num || ''} <FormattedMessage id={localeStr} /></span>}
    >
      <div className={styles.editorWrapper}>
        {showEditor
          ? <Editor
            onChange={setEditorValue}
            value={editorValue}
            placeholder={`${replyTo} ${data.user_name}`}
            onSend={sendComment}
          />
          : null}
      </div>
      <ul>
        {children.map((c) => <NewsComment
          currentUser={currentUser}
          key={c.ID}
          onAddComment={onAddComment}
          newsId={newsId}
          showEditor={false}
          isMobile={isMobile}
          data={c}
          level={(level ?? 1) + 1}
          appendComment={!level || level === 1 ? appendComment : undefined}
        />)}
      </ul>
      {remain > 0
        ? <Spin spinning={loading}>
          <a
            className={styles.expand}
            onClick={() => getData(true)}
          >
            <FormattedMessage id='key_expand' /> {remain} <FormattedMessage id='key_replies' />
          </a>
        </Spin>
        : null}
    </Comment>
  </li>;
}

export default React.memo(connect(({ user }: ConnectState) => ({ currentUser: user.currentUser }))(NewsComment));
