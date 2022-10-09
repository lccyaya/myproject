import React, { useState, useEffect } from 'react';
import Container from '@/components/Container';
import { Tabs, Avatar } from 'antd';
import { FormattedMessage, connect, history, useIntl } from 'umi';
import defaultAvatar from '@/assets/icon/avatar.svg';
import IconFont from '@/components/IconFont';

import Profile from './profile';
import Setting from './setting';
import MyTeam from './myTeam';
import MyCoupon from './mycoupon/mobile';
import Follow from './follow/mobile';
import MyOrder from './myorder/mobile';
import Recharge from './recharge/mobile';
import RechargeRecord from './rechargeRecord/mobile';
import WarnTip from '@/components/WarmTip/mobile';
import classnames from 'classnames';
import { useParams } from 'umi';
import styles from './mobile.module.less';
import { toShortLangCode, isForChina } from '@/utils/utils';
import { locale } from '@/app';
import { Image, NavBar } from 'antd-mobile';
import { useHistory, useSelector } from 'umi';

const { TabPane } = Tabs;

const Account = (props) => {
  const intl = useIntl();
  const history = useHistory();
  const { type } = useParams();
  const { currentUser } = props;
  const TAB_LIST = isForChina()
    ? {
        setting: intl.formatMessage({ id: 'key_setting' }),
        myteam: intl.formatMessage({ id: 'key_my_teams' }),
        recharge: '金币充值',
        'recharge-record': '交易记录',
        coupon: '我的卡券',
        myorder: '我的订单',
        follow: '我的收藏',
        profile: '个人中心',
      }
    : {
        setting: intl.formatMessage({ id: 'key_setting' }),
        myteam: intl.formatMessage({ id: 'key_my_teams' }),
        profile: intl.formatMessage({ id: 'key_profile' }),
      };
  const back = () => {
    history.goBack();
  };
  return (
    // <Container>
      <div className={styles.container}>
        <NavBar className={styles.navbar} onBack={back}>
          {type === 'coupon' ? '优惠券' : ''}
          {type === 'recharge' ? '充值' : ''}
          {type === 'follow' ? '我的收藏' : ''}
        </NavBar>
        <div className={styles.body}>
          {isForChina() ? (
            <>
              {type === 'recharge' ? (
                <div className={styles.tabContent}>
                  <Recharge coin={currentUser?.coin || 0} />
                  <WarnTip className={styles.warn_tip} />
                </div>
              ) : null}
              {type === 'coupon' ? <MyCoupon /> : null}
              {type === 'myorder' ? <MyOrder /> : null}
              {type === 'follow' ? <Follow /> : null}
              {type === 'recharge-record' ? <RechargeRecord /> : null}
            </>
          ) : null}
          {type === 'myteam' ? <MyTeam /> : null}
          {type === 'profile' ? <Profile onSummit={(e) => console.log(e)} /> : null}
          {type === 'setting' ? <Setting /> : null}
        </div>
      </div>
    // </Container>
  );
};

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(Account);
