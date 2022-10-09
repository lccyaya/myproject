import React, { useState, useEffect } from 'react';

import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { UserInfoType } from '@/services/user';
import Certification from '@/pages/Certification'

import styles from './index.less';

type IProps = {
  currentUser?: UserInfoType | null;
  onLogin: () => void;
  onCancel?: () => void;
  children?: any;
}

const PopupLogin: React.FC<IProps> = (props) => {
  const { children, currentUser, onLogin, onCancel } = props;
  const [visible, setVisible] = useState<boolean>(false);

  const onClickHandler = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }

  const open = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    // 检查是否登录
    if (currentUser) {
      onLogin();
    } else {
      setVisible(true);
    }
  }

  useEffect(() => {
    window.addEventListener('click', onClickHandler);
    return () => {
      window.removeEventListener('click', onClickHandler);
    }

  }, [])


  const trigger = React.cloneElement(React.Children.only(children as any), {
    onClick: open,
  });

  return (
    <>
      {trigger}
      <Certification
        action='login'
        visible={visible}
        onSuccess={() => {
          setVisible(false);
          onLogin();
        }}
        onCancel={() => {
          setVisible(false);
          onCancel?.();
        }}
      />

    </>
  )

}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(PopupLogin);
