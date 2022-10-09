/* eslint-disable no-nested-ternary */
import React from 'react';
import { Button } from 'antd';
import { FormattedMessage } from 'umi';
// @ts-ignore
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

import styles from '../index.less';


type IProps = {
  onSuccess: (e: { accessToken: string }) => void;
}

const LineLogin: React.FC<IProps> = (props) => {
  const { onSuccess } = props;

  const responseFacebook = (response: any) => {
    const { accessToken } = response;
    onSuccess({ accessToken });
  }

  return <FacebookLogin
    appId="498368014598571"
    autoLoad
    callback={responseFacebook}
    render={(renderProps: any) => (
      <Button onClick={renderProps.onClick}
        type="primary"
        className={styles.yes}><FormattedMessage id="key_yes" /></Button>
    )}
  />
}

export default LineLogin;
