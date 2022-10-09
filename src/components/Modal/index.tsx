/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'react';

import { Modal, Button } from 'antd';
import GoogleLogin from 'react-google-login';
import { FormattedMessage } from 'react-intl';

import FacebookLogin from './FacebookLogin';
import LineLogin from './LineLogin';
import styles from './index.less';
import Iconfont from '@/components/IconFont';

type IProps = {
  visible: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: (token?: string) => void;
  onFailure?: (e?: string) => void;
  type?: 'google' | 'line' | 'facebook';
  hideCancel?: boolean;
  okLoading?: boolean;
  hideFooter?: boolean;
  closable?: boolean;
  destroyOnClose?: boolean;
};
const Channel: React.FC<IProps> = (props) => {
  const {
    visible,
    onCancel,
    onConfirm,
    title,
    type,
    onFailure,
    hideCancel,
    okLoading,
    hideFooter = false,
    closable = false,
    destroyOnClose = true,
  } = props;

  const onGoogleSuccess = (e: any) => {
    const { tokenId } = e;
    onConfirm(tokenId);
  };

  const onLineSuccess = (e: any) => {
    const { code } = e;
    onConfirm(code);
  };

  const onFacebookSuccess = (e: any) => {
    const { accessToken } = e;
    onConfirm(accessToken);
  };

  const onFailureHandler = (e: any) => {
    onFailure && onFailure(e);
  };

  return (
    <Modal
      destroyOnClose={destroyOnClose}
      closable={closable}
      visible={visible}
      onCancel={onCancel}
      footer={false}
      wrapClassName={styles.modal}
      centered
      closeIcon={<Iconfont type="icon-guanbi" size={32} />}
    >
      <div className={styles.container}>
        {title ? <div className={styles.title}>{title}</div> : null}
        <div className={styles.content}>{props.children}</div>
        {!hideFooter ? (
          <div className={styles.handler}>
            {!hideCancel && (
              <Button onClick={onCancel} type="default" className={styles.cancel}>
                <FormattedMessage id="key_cancel" />
              </Button>
            )}
            {type === 'google' && (
              <GoogleLogin
                clientId="328500312724-429l1mffavbja8qcnlq5n2dhn4rm1gqr.apps.googleusercontent.com"
                buttonText="Login"
                render={(r) => (
                  <Button onClick={r.onClick} type="primary" className={styles.yes}>
                    <FormattedMessage id="key_yes" />
                  </Button>
                )}
                onSuccess={onGoogleSuccess}
                onFailure={(e) => {
                  console.log(e);
                  onFailureHandler(e);
                }}
                cookiePolicy={'single_host_origin'}
              />
            )}
            {type === 'line' && <LineLogin onSuccess={onLineSuccess} />}
            {type === 'facebook' && <FacebookLogin onSuccess={onFacebookSuccess} />}
            {!type && (
              <Button
                loading={okLoading}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onConfirm();
                }}
                type="primary"
                className={styles.yes}
              >
                <FormattedMessage id="key_yes" />
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

export default Channel;
