import IconFont from '@/components/IconFont';
import styles from './mobile.module.less';
import cls from 'classnames';
import React, { useState, useEffect } from 'react';
import { expertUnFollow, expertFollow } from '@/services/expert';
import { message } from 'antd';
import { connect } from 'umi';
import EventEmitter from '@/utils/event';
import { handleReport } from '@/utils/report';

const Watch = ({ id, followed = false, onSuccess = () => {}, currentUser = {}, type = '' }) => {
  const [focus, setFocus] = useState(followed);
  const handleFollow = async (e) => {
    e.stopPropagation();

    if (!currentUser) {
      EventEmitter.emit('login-modal', true);
    }
    let tag = '';
    if (type === 'gmz') {
      tag = 'hit';
    } else if (type === 'glz') {
      tag = 'continuous';
    }
    handleReport({
      action: 'follow',
      tag,
    });
    const resp = focus
      ? await expertUnFollow({ expert_id: id })
      : await expertFollow({ expert_id: id });
    if (resp.success) {
      message.success(focus ? '已取消关注' : '关注成功');
      setFocus(!focus);
      onSuccess(id, !focus);
    }
  };
  useEffect(() => {
    setFocus(followed);
  }, [followed]);
  return (
    <div className={cls(styles.watch, focus ? styles.focus : null)} onClick={handleFollow}>
      {!focus ? <IconFont type="icon-tianjia" className={styles.icon} /> : null}
      {focus ? '已关注' : '关注'}
    </div>
  );
};
export default connect(({ user }) => ({ currentUser: user.currentUser }))(Watch);
