import pageConfig from '@/utils/pageConfig';
import { toShortLangCode } from '@/utils/utils';
import React, { useState } from 'react';
import styles from './index.less';
import { locale } from '@/app';
import { useHistory, useSelector } from 'umi';
import { Button, Menu, MenuProps, Space } from 'antd';
import HeaderMenu from './HeaderMenu';
import Avatar from '../GlobalHeader/AvatarDropdown';
import { ConnectState } from '@/models/connect';
import Certification from '@/pages/Certification';
import EventEmitter from '@/utils/event';

type MenuItem = Required<MenuProps>['items'][number];
type Props = {};

const PCHeader: React.FC<Props> = (props) => {
  const history = useHistory();
  const [loginVisible, setLoginVisible] = useState<boolean>(false);
  const user = useSelector<ConnectState>((s) => s.user.currentUser);

  const handleLoginClick = () => {
    setLoginVisible(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <img
          className={styles.logo}
          src={pageConfig.logo_34sport_white}
          onClick={() => {
            const lang = toShortLangCode(locale.getLocale(history.location.pathname));
            history.push(`/${lang}/home`);
          }}
        />
        <div className={styles.right_container}>
          <HeaderMenu></HeaderMenu>
          <div className={styles.user_box}>
            {user ? (
              <Avatar menu />
            ) : (
              <Space className={styles.loginArea}>
                <Button
                  type="primary"
                  size="small"
                  className={styles.login}
                  onClick={handleLoginClick}
                >
                  登录
                </Button>
              </Space>
            )}
          </div>
        </div>
      </div>
      <Certification
        action="login"
        visible={loginVisible}
        onSuccess={() => {
          setLoginVisible(false);
          EventEmitter.emit('login-status-change');
        }}
        onCancel={() => {
          setLoginVisible(false);
        }}
      />
    </div>
  );
};

export default PCHeader;
