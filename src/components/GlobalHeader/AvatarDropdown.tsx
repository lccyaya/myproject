import { Avatar, Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import { FormattedMessage, useSelector } from 'umi';
import { history, connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import defaultAvatar from '@/assets/icon/avatar.svg';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { report } from '@/services/ad';
import { checkIsPhone, toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { sliceStr, isForChina } from '@/utils/utils';
import EventEmitter from '@/utils/event';
import cls from 'classnames';
import { UserInfoType } from '@/services/user';
import { ExpertStatus } from '@/utils/scheme';

const AvatarDropdown = (props) => {
  const { currentUser } = props;
  const [visible, setVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState('');
  const isPhone = checkIsPhone();
  const user = useSelector<ConnectState, UserInfoType | null | undefined>(
    (s) => s.user.currentUser,
  );

  const logout = () => {
    EventEmitter.emit('login-status-change');
    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'user/logout',
      });
    }
  };
  const onMenuClick = (event) => {
    const lang = toShortLangCode(locale.getLocale());
    const { key } = event;
    const reportAction = {
      profile: REPORT_ACTION.me_info_enter,
      myteam: REPORT_ACTION.me_my_team_enter,
      logout: REPORT_ACTION.me_logout,
      recharge: REPORT_ACTION.me_recharge,
      coupon: REPORT_ACTION.me_coupon,
      follow: REPORT_ACTION.me_collect,
      myorder: REPORT_ACTION.me_myorder,
      setting: REPORT_ACTION.me_setting,
    }[key];
    if (reportAction) {
      report({
        cate: REPORT_CATE.me,
        action: reportAction,
      });
    }
    if (key === 'logout') {
      if (history.location.pathname.includes(`/${lang}/account/`) || history.location.pathname.includes(`/${lang}/profile/`)) {
        history.push(`/${lang}/home`);
      } else {
        location.reload();
      }
      logout();
      return;
    }
    if (key === 'profile_center') {
      history.push(`/${lang}/profile/center`);
      return;
    }
    history.push(`/${lang}/account/${key}`);
    setVisible(false);
  };

  const menuList = isPhone
    ? [
        {
          key: 'profile',
          title: '个人中心',
        },
        {
          key: 'myteam',
          title: <FormattedMessage id="key_my_teams" />,
        },
        {
          key: 'recharge',
          title: '金币充值',
        },
        {
          key: 'coupon',
          title: '我的卡券',
        },
        {
          key: 'myorder',
          title: '我的订单',
        },
        {
          key: 'follow',
          title: '我的收藏',
        },
        {
          key: 'setting',
          title: <FormattedMessage id="key_setting" />,
        },
        {
          key: 'logout',
          title: <FormattedMessage id="key_log_out" />,
        },
      ]
    : [
        {
          key: 'profile_center',
          title: <FormattedMessage id="key_profile_center" />,
        },
        {
          key: 'logout',
          title: <FormattedMessage id="key_log_out" />,
        },
      ];
  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[selectedKey]} onClick={onMenuClick}>
      {menuList.map((item) => {
        return <Menu.Item key={item.key}>{item.title}</Menu.Item>;
      })}
    </Menu>
  );
  useEffect(() => {
    const { pathname } = history.location;
    const pathnameList = pathname.split('/');
    const key = pathnameList[pathnameList.length - 1];
    if (key) {
      if (key === 'recharge-record') {
        setSelectedKey('recharge');
      } else {
        setSelectedKey(key);
      }
    }
  }, [history.location]);

  const avatar = user?.expert?.status == ExpertStatus.Accept ? user.expert.avatar : user?.avatar;
  const nickname = user?.expert?.status == ExpertStatus.Accept ? user.expert.nickname : user?.nickname;

  return (
    currentUser &&
    currentUser.nickname && (
      <HeaderDropdown
        overlay={menuHeaderDropdown}
        visible={visible}
        trigger={[isPhone ? 'click' : 'hover']}
        align={isPhone ? 'center' : ''}
        onVisibleChange={(val) => {
          setVisible(val);
        }}
      >
        <span
          className={cls(styles.action, isPhone ? styles.mobile : styles.account)}
          onClick={() => {
            if (visible) {
              setVisible(false);
            }
          }}
        >
          <Avatar
            size="small"
            className={styles.avatar}
            src={avatar || defaultAvatar}
            alt="avatar"
          />
          <span className={`${styles.name} anticon`}>{sliceStr(nickname || '', 6)}</span>
        </span>
      </HeaderDropdown>
    )
  );
};

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
