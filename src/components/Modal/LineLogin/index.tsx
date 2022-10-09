/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import { Button } from 'antd';
import { FormattedMessage } from 'umi';
import { FOOTBALL_MASTER_LINE_CODE } from '@/constants';
import styles from '../index.less';
import { isServer } from '@/utils/env';

type IProps = {
  onSuccess: (e: { code: string }) => void;
}


const hiddenProperty = isServer ? '' : ('hidden' in document ? 'hidden' :
  'webkitHidden' in document ? 'webkitHidden' :
    'mozHidden' in document ? 'mozHidden' :
      null);

const visibilityChangeEvent = hiddenProperty!.replace(/hidden/i, 'visibilitychange');

const LineLogin: React.FC<IProps> = (props) => {
  const { onSuccess } = props;
  const onClick = () => {
    let URL = 'https://access.line.me/oauth2/v2.1/authorize?';
    URL += 'response_type=code';
    URL += '&client_id=1655933154';
    URL += `&redirect_uri=${window.location.origin}`;
    URL += '&state=abcdes';
    URL += '&bot_prompt=normal';
    URL += '&scope=openid%20profile';
    window.open(URL);
  }

  const onVisibilityChange = () => {
    const code = localStorage.getItem(FOOTBALL_MASTER_LINE_CODE);
    if (code) {
      onSuccess({ code });
      localStorage.removeItem(FOOTBALL_MASTER_LINE_CODE);
    }
  }

  useEffect(() => {
    localStorage.removeItem(FOOTBALL_MASTER_LINE_CODE);
    document.addEventListener(visibilityChangeEvent, onVisibilityChange);
    return () => {
      document.removeEventListener(visibilityChangeEvent, onVisibilityChange);
    }
  }, []);



  return <Button onClick={onClick}
    type="primary"
    className={styles.yes}><FormattedMessage id="key_yes" /></Button>
}

export default LineLogin;
