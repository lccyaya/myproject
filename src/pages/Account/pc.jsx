import React, { useState, useEffect } from 'react';
import Container from '@/components/Container';
import { Tabs, Avatar, Divider } from 'antd';
import { FormattedMessage, connect, history, useIntl } from 'umi';
import defaultAvatar from '@/assets/icon/avatar.svg';
import IconFont from '@/components/IconFont';
import { useParams } from 'umi';
import Profile from './profile';
import Setting from './setting';
import MyTeam from './myTeam';
import MyCoupon from './mycoupon/pc';
import Follow from './follow';
import MyOrder from './myorder/pc';
import Recharge from './recharge/pc';
import RechargeRecord from './rechargeRecord/pc';
import WarnTip from '@/components/WarmTip/pc';
import classnames from 'classnames';
import styles from './index.less';
import { toShortLangCode, isForChina } from '@/utils/utils';
import { locale } from '@/app';
import { handleReport } from '@/utils/report';
import { REPORT_ACTION } from '@/constants';
const { TabPane } = Tabs;

const Account = (props) => {
  const intl = useIntl();
  const { type } = useParams();
  const { currentUser } = props;
  const [activeKey, setActiveKey] = useState(type);

  const onTabChange = (key) => {
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
    setActiveKey(key);
    const lang = toShortLangCode(locale.getLocale());
    history.push(`/${lang}/account/${key}`);
    reportAction &&
      handleReport({
        action: reportAction,
      });
  };
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
  useEffect(() => {
    setActiveKey(type);
  }, [type]);
  return (
    <Container>
      <div className={styles.container}>
        <div className={styles.header}>
          <Avatar className={styles.avatar} src={currentUser?.avatar || defaultAvatar} />
          <div className={styles.info}>
            <div className={styles.nicknameWrapper}>
              <span className={classnames(styles.nickname, styles.item)}>
                {currentUser?.nickname}
              </span>
              <span className={classnames(styles.item, styles.divide)}>/</span>
              <span className={classnames(styles.item, styles.type)}>{TAB_LIST[type]}</span>
            </div>
            <div className={styles.email}>{currentUser?.email || currentUser?.phone}</div>
          </div>
        </div>
        <Divider className={styles.divide} />
        <div className={styles.body}>
          {type === 'myteam' ? (
            <MyTeam />
          ) : (
            <Tabs
              tabPosition="left"
              activeKey={activeKey === 'recharge-record' ? 'recharge' : activeKey}
              onChange={onTabChange}
            >
              {isForChina() ? (
                <>
                  <TabPane
                    tab={
                      <div className={styles.tab}>
                        <IconFont className={styles.icon} type="icon-jinbichongzhi" size={20} />
                        <span className={styles.tabName}>金币充值</span>
                      </div>
                    }
                    key="recharge"
                  >
                    {activeKey === 'recharge' ? (
                      <>
                        <div className={styles.tabContent}>
                          <Recharge coin={currentUser?.coin || 0} />
                        </div>
                        <WarnTip className={styles.warn_tip} />
                      </>
                    ) : (
                      <div className={styles.tabContent}>
                        <div className={styles.record_header}>
                          <div
                            onClick={() => {
                              history.goBack();
                            }}
                            className={styles.icon}
                          >
                            <IconFont type="icon-jiantouzuo" />
                          </div>

                          <div className={styles.title}>交易记录</div>
                          <div className={styles.right} />
                        </div>
                        <RechargeRecord />
                      </div>
                    )}
                  </TabPane>
                  <TabPane
                    tab={
                      <div className={styles.tab}>
                        <IconFont className={styles.icon} type="icon-kaquan" size={20} />
                        <span className={styles.tabName}>我的卡券</span>
                      </div>
                    }
                    key="coupon"
                  >
                    <div className={styles.tabContent}>
                      <MyCoupon />
                    </div>
                  </TabPane>
                  <TabPane
                    tab={
                      <div className={styles.tab}>
                        <IconFont className={styles.icon} type="icon-dingdan" size={20} />
                        <span className={styles.tabName}>我的订单</span>
                      </div>
                    }
                    key="myorder"
                  >
                    <div className={styles.tabContent}>
                      <MyOrder />
                    </div>
                  </TabPane>
                  <TabPane
                    tab={
                      <div className={styles.tab}>
                        <IconFont className={styles.icon} type="icon-shoucang" size={20} />
                        <span className={styles.tabName}>我的收藏</span>
                      </div>
                    }
                    key="follow"
                  >
                    <div className={styles.tabContent}>
                      <Follow />
                    </div>
                  </TabPane>
                </>
              ) : null}
              <TabPane
                tab={
                  <div className={styles.tab}>
                    <IconFont className={styles.icon} type="icon-gerenzhongxin" size={20} />
                    <span className={styles.tabName}>
                      {isForChina() ? '个人中心' : <FormattedMessage id="key_profile" />}
                    </span>
                  </div>
                }
                key="profile"
              >
                <div className={styles.tabContent}>
                  <Profile onSummit={(e) => console.log(e)} />
                </div>
              </TabPane>
              <TabPane
                tab={
                  <div className={styles.tab}>
                    <IconFont className={styles.icon} type="icon-shezhi" size={20} />
                    <span className={styles.tabName}>
                      <FormattedMessage id="key_setting" />
                    </span>
                  </div>
                }
                key="setting"
              >
                <div className={styles.tabContent}>
                  <Setting />
                </div>
              </TabPane>
            </Tabs>
          )}
        </div>
      </div>
    </Container>
  );
};

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(Account);
