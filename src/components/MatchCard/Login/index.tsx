import React from 'react';

import { connect, FormattedMessage, useIntl } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { UserInfoType } from '@/services/user';
import Certification from '@/pages/Certification'

import styles from './index.less';

type IProps = {
  currentUser?: UserInfoType | null;
  onLogin: () => void;
  onCancel?: () => void;
  children?: any;
  visible: boolean;
}

const PopupLogin: React.FC<IProps> = (props) => {
  const { onLogin, onCancel, visible } = props;

  return (
    <>
      <Certification
        action='login'
        visible={visible}
        onSuccess={() => {
          onLogin();
        }}
        onCancel={() => {
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
