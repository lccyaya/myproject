import { Button, Space } from 'antd';
import type { Settings as ProSettings } from '@ant-design/pro-layout';
// import { QuestionCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import type { ConnectProps } from 'umi';
import { checkIsPhone, isForChina } from '@/utils/utils';
import {
  connect,
  // SelectLang,
  FormattedMessage,
  useHistory,
  useSelector,
  useLocation,
} from 'umi';
import type { UserInfoType } from '@/services/user';
import SelectLang from '@/components/SelectLang';

import Certification from '../../pages/Certification';
import type { ConnectState } from '@/models/connect';
import Avatar from './AvatarDropdown';
// import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import TeamLikeModal from '../TeamLikeModal';
import { REPORT_ACTION } from '@/constants';
import { report } from '@/services/ad';
import { getPageFromPath } from '@/utils/page-info';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import EventEmitter from '@/utils/event';

export type GlobalHeaderRightProps = {
  theme?: ProSettings['navTheme'] | 'realDark';
  currentUser?: UserInfoType | null;
} & Partial<ConnectProps> &
  Partial<ProSettings>;

// const ENVTagColor = {
//   dev: 'orange',
//   test: 'green',
//   pre: '#87d068',
// };

const GlobalHeaderRight: React.FC<GlobalHeaderRightProps> = (props) => {
  const abVersion = useSelector<ConnectState, ConnectState['abtest']['version']>(
    (state) => state.abtest.version,
  );
  const history = useHistory();
  const location = useLocation();
  const path = location.pathname;
  const [page, setPage] = useState('');
  useEffect(() => {
    const _page = getPageFromPath(path);
    setPage(_page?.key || '');
  }, [path]);
  const isPhone = checkIsPhone();
  const { theme, layout, currentUser } = props;
  let className = styles.right;
  const [loginVisible, setLoginVisible] = useState<boolean>(false);
  const [registerVisible, setRegisterVisible] = useState<boolean>(false);
  const [teamlickVisible, setTeamlickVisible] = useState<boolean>(false);

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const dataReport = (action: REPORT_ACTION) => {
    const _page = getPageFromPath(history.location.pathname);
    if (_page && abVersion) {
      report({
        cate: _page.cate,
        action,
        tag: abVersion.toLowerCase(),
      });
    }
  };

  const handleLoginClick = () => {
    dataReport(REPORT_ACTION.login_click);
    setLoginVisible(true);
  };

  const handleDownloadClick = () => {
    dataReport(REPORT_ACTION.download_app);
    const lang = toShortLangCode(locale.getLocale());
    history.push(`/${lang}/download`);
  };

  return (
    <div className={className}>
      {!isForChina() ? (
        <SelectLang globalIconClassName={styles.lang} className={styles.action} />
      ) : null}

      {teamlickVisible && (
        <TeamLikeModal
          isRegister
          open={teamlickVisible}
          onOk={() => setTeamlickVisible(false)}
          close={() => setTeamlickVisible(false)}
        />
      )}
      {currentUser && currentUser.nickname ? (
        <Avatar menu />
      ) : (
        <Space className={styles.loginArea}>
          <Button type="text" className={styles.login} onClick={handleLoginClick}>
            {isPhone ? <FormattedMessage id="key_log_in" /> : "专家登录"}
          </Button>

          {/* {!isPhone ? (
            <Button
              className={styles.signUp}
              type="primary"
              onClick={() => {
                setRegisterVisible(true);
              }}
            >
              <FormattedMessage id="key_sign_up" />
            </Button>
          ) : page !== 'download' ? (
            <Button type="primary" className={styles.downloadBtn} onClick={handleDownloadClick}>
              <div className={styles.icon} />
              <div className={styles.text}>APP</div>
            </Button>
          ) : null} */}
        </Space>
      )}
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
      <Certification
        action="register"
        visible={registerVisible}
        onSuccess={() => {
          setRegisterVisible(false);
          // setTeamlickVisible(true);
        }}
        onCancel={() => {
          setRegisterVisible(false);
        }}
      />
    </div>
  );
};

export default connect(({ settings, user }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  currentUser: user.currentUser,
}))(GlobalHeaderRight);
