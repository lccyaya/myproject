import React, { useEffect, useState } from 'react';
import Container from '@/components/Container';
import Iframe from 'react-iframe';

import { RouteComponentProps } from 'react-router';
import ScrollView from 'react-custom-scrollbars';
import { Tabs, Avatar, Divider } from 'antd';
import { FormattedMessage, connect, history, useHistory } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { UserInfoType } from '@/services/user';

import styles from './index.less';
import { NavBar } from 'antd-mobile';

interface MatchParams {
  type: 'profile' | 'setting';
}

interface AccountType extends RouteComponentProps<MatchParams> {
  currentUser?: UserInfoType | null;
}

const Account: React.FC<AccountType> = (props: AccountType) => {
  const [url, setUrl] = useState('');
  const history = useHistory();
  useEffect(() => {
    // @ts-ignore
    setUrl(`${window.publicPath}privacy.html`);
  }, []);

  const back = () => {
    history.goBack();
  };

  return (
    // <Container>
      <div className={styles.container}>
        <NavBar className={styles.navbar} onBack={back}>
          隐私协议
        </NavBar>
        <ScrollView>
          <Iframe
            url={url}
            // width="100%"
            // height="100%"
            id="myId"
            className={styles.iframe}
            // display="initial"
            position="relative"
          />
        </ScrollView>
      </div>
    // </Container>
  );
};

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(Account);
