import IconFont from '@/components/IconFont';
import styles from './mobile.module.less';
import cls from 'classnames';
import React, { useState, useEffect } from 'react';
import { toggleCollect } from '@/services/expert';
import { message } from 'antd';
import { connect } from 'umi';
import EventEmitter from '@/utils/event';
import CollectIcon from '@/assets/collected.png';
import UnCollectIcon from '@/assets/uncollect.png';
import { handleReport } from '@/utils/report';

const Collect = ({ id, collected = false, onSuccess = () => {}, currentUser = {} }) => {
  const [focus, setFocus] = useState(collected);
  const handleCollect = async (e) => {
    e.stopPropagation();
    handleReport({
      action: focus ? 'favorite' : 'unfavorite',
    });
    if (!currentUser) {
      EventEmitter.emit('login-modal', true);
      return;
    }

    const resp = await toggleCollect({ scheme_id: +id, favorite: focus ? 0 : 1 });
    if (resp.success) {
      message.success(focus ? '已取消收藏' : '收藏成功');
      setFocus(!focus);
      onSuccess(id, !focus);
    }
  };
  useEffect(() => {
    setFocus(collected);
  }, [collected]);
  return (
    <div className={cls(styles.collect)} onClick={handleCollect}>
      <img src={focus ? CollectIcon : UnCollectIcon} alt="" />
    </div>
  );
};
export default connect(({ user }) => ({ currentUser: user.currentUser }))(Collect);
