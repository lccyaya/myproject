/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 *
 * @see You can view component api by: https://github.com/ant-design/ant-design-pro-layout
 */
// import 'lib-flexible';
import type {
  BasicLayoutProps as ProLayoutProps,
  MenuDataItem,
  Settings,
} from '@ant-design/pro-layout';
import ProLayout from '@ant-design/pro-layout';
import classnames from 'classnames';
import 'moment-timezone';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Dispatch } from 'umi';
import { getLocale } from 'umi';
import { connect, FormattedMessage, history, Link, useIntl, useSelector } from 'umi';
// import { GithubOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { parse } from 'query-string';
// @ts-ignore
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import type { ConnectState } from '@/models/connect';
import { getMatchMenu } from '@umijs/route-utils';
import GoogleLogin from 'react-google-login';
import MobileLayout from './NewMobileLayout';
import ADPopup from '@/components/ADPopup';
import { checkIsPhone, getLangFromPath, toShortLangCode } from '@/utils/utils';
import { FOOTBALL_MASTER_LINE_CODE } from '@/constants';

import styles from './BasicLayout.less';
import OpenApp from '@/components/OpenApp';
import { report } from '@/services/ad';
import { locale } from '@/app';
import { getPageFromPath } from '@/utils/page-info';
import { PageActive } from '@/utils/page-active';
import { active } from '@/services/abtest';
import FixedBtns from '@/components/FixedBtns/pc';
import FixedBtnsMobile from '@/components/FixedBtns/mobile';
import { getTipsStatus } from '@/services/tips';
import LoginModal from '@/components/MatchCard/Login';

import EventEmitter from '@/utils/event';
import pageConfig from '@/utils/pageConfig';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
export type BasicLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
  isPhone: boolean;
  showTips: boolean;
} & ProLayoutProps;
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: Record<string, MenuDataItem>;
};

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    showTips,
  } = props;
  const [pathname, setPathname] = useState<string>();
  const [code, setCode] = useState('');
  const [loginVisible, setLoginVisible] = useState(false);
  /** Use Authorized check all menu item */

  const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => {
    const result = menuList
      .filter((item) => {
        return item.locale === 'key_home_tab' || item.locale === 'key_profile_center'
      })
      .filter((item) => {
        if (showTips) {
          return true;
        }
        return item.key !== '/:locale/tips';
      })
      .map((item) => {
        const localItem = {
          ...item,
          // children: item.children ? menuDataRender(item.children) : undefined,
        };
        return Authorized.check(item.authority, localItem, null) as MenuDataItem;
      });
    
    return result;
  };

  // const [divice, setDivice] = useState<DiviceType>(false);
  const fetchData = async () => {
    const resp = await getTipsStatus();
    if (resp.success) {
      if (/\/tips\/*/.test(history.location.pathname) && resp.data.status) {
        history.replace('/home');
      }
      if (dispatch) {
        dispatch({
          type: 'tips/setShowTips',
          payload: !resp.data.status,
        });
      }
    }
  };

  useEffect(() => {
    const lang = getLangFromPath();
    dayjs.locale(lang);
    if (getLangFromPath() === 'ar') {
      moment.locale('en');
    } else {
      moment.locale(lang);
    }
    const isPhone = /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent);
    if (dispatch) {
      dispatch({
        type: 'divice/isPhone',
        payload: isPhone,
      });
    }
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const menuDataRef = useRef<MenuDataItem[]>([]);

  /** Init variables */

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };
  // get children authority
  const authorized = useMemo(() => {
    console.log('当前的语言是', getLocale());
    return (
      getMatchMenu(pathname || '/', menuDataRef.current).pop() || {
        authority: undefined,
      }
    );
  }, [pathname]);

  const onPageChangeHandle = (e: any) => {
    console.log('页面发送变化', e);
    const { pathname: _pn } = e;
    setPathname(_pn);
  };

  const { formatMessage } = useIntl();
  const [checkCurrentIsPhone, setCheckCurrentIsPhone] = useState(false);
  // const checkCurrentIsPhone = checkIsPhone();

  const handlePageActive = useCallback(() => {
    // eslint-disable-next-line no-new
    new PageActive((duration) => {
      const s = Math.round(duration / 1000);
      if (s > 0) {
        active(s);
      }
    });
  }, []);

  useEffect(() => {
    console.log('渲染-----BasicLayout', props);
    try {
      document.getElementsByClassName('ant-menu-overflow-item')?.forEach((el) => {
        el.setAttribute('title', '');
      });
    } catch (error) {}

    setCheckCurrentIsPhone(checkIsPhone());
    const query = parse(window?.location.search);

    if (query.code) {
      setCode(query.code as string);
      localStorage.removeItem(FOOTBALL_MASTER_LINE_CODE);
      localStorage.setItem(FOOTBALL_MASTER_LINE_CODE, query.code as string);
      setTimeout(() => {
        window?.close();
      }, 1000);
    }
    handlePageActive();
  }, []);

  // const nickname = useSelector<ConnectState, string | undefined>(
  //   (state) => state.user.currentUser?.nickname,
  // );
  // const userGotResult = useSelector<ConnectState, boolean>((state) => state.user.gotResult);

  // const getVersion = () => {
  //   dispatch({
  //     type: 'abtest/fetchVersion',
  //     payload: {
  //       nickname,
  //     },
  //   });
  // };

  // useEffect(() => {
  //   if (userGotResult) {
  //     getVersion();
  //   }
  // }, [userGotResult]);

  // useEffect(() => {
  //   if (nickname) {
  //     // 用户登录后或者切换用户
  //     getVersion();
  //   }
  // }, [nickname]);
  const openLoginModal = (open) => {
    setLoginVisible(open);
  };
  useEffect(() => {
    EventEmitter.on('login-modal', openLoginModal);
    return () => {
      EventEmitter.off('login-modal', openLoginModal);
    };
  }, []);

  return (
    <>
      {code ? (
        <div>
          <FormattedMessage id="key_being_certified" />
          ...
        </div>
      ) : (
        <>
          {/* {checkCurrentIsPhone && <OpenApp />} */}
          {/* <ProLayout
            logo={() => (
              <img
                src={pageConfig.logo}
                onClick={() => {
                  const lang = toShortLangCode(locale.getLocale(location.pathname));
                  history.push(`/${lang}/home`);
                }}
              />
            )}
            className={classnames(styles.layout, checkCurrentIsPhone && styles.mobileLayout)}
            formatMessage={formatMessage}
            collapsedButtonRender={() => null}
            {...{
              ...props,
              isPhone: checkCurrentIsPhone,
            }}
            {...settings}
            title={false}
            onCollapse={handleMenuCollapse}
            contentWidth="Fixed"
            menuItemRender={(menuItemProps, defaultDom) => {
              const lang = toShortLangCode(locale.getLocale(location.pathname));
              if (
                menuItemProps.isUrl ||
                !menuItemProps.path ||
                location.pathname === menuItemProps.path.replace('/:locale', `/${lang}`)
              ) {
                return (
                  <span
                    className={
                      menuItemProps.locale === 'key_download'
                        ? classnames(styles.selecteItem, styles.hot)
                        : styles.selecteItem
                    }
                  >
                    {defaultDom}
                  </span>
                );
              }
              return (
                <Link
                  className={
                    menuItemProps.locale === 'key_download'
                      ? classnames(styles.classItem, styles.hot)
                      : styles.classItem
                  }
                  to={menuItemProps.path.replace('/:locale', `/${lang}`)}
                  onClick={() => {
                    const page = getPageFromPath(history.location.pathname);
                    if (!page) return;
                    report({
                      cate: page.cate,
                      action: menuItemProps.cate,
                    });
                  }}
                >
                  {defaultDom}
                </Link>
              );
            }}
            menuDataRender={menuDataRender}
            onPageChange={onPageChangeHandle}
            menuProps={{ className: styles.menu, selectable: false }}
            rightContentRender={() => <RightContent /> }
            fixedHeader={!checkCurrentIsPhone}
            // contentStyle={props.isPhone ? { minWidth: 0, maxHeight: 1024, margin: '0 auto' } : { minWidth: 1200, margin: 0, background: '#fff' }}
            contentStyle={{
              minWidth: checkCurrentIsPhone ? 0 : 1200,
              maxWidth: 1200,
              margin: checkCurrentIsPhone ? 0 : '0 auto',
            }}
          > */}
            <Authorized authority={authorized!.authority} noMatch={noMatch}>
              {/* <GoogleLogin
                clientId="328500312724-429l1mffavbja8qcnlq5n2dhn4rm1gqr.apps.googleusercontent.com"
                buttonText="Login"
                render={() => <span />}
                cookiePolicy={'single_host_origin'}
              /> */}
              {/* <FacebookLogin appId="498368014598571" autoLoad={false} render={() => <span />} /> */}

              {checkCurrentIsPhone ? (
                <MobileLayout onPageChange={onPageChangeHandle} {...props}>
                  {children}
                </MobileLayout>
              ) : (
                children
              )}
            </Authorized>
            {/* <ADPopup pathname={pathname} /> */}
            {/* {checkCurrentIsPhone ? <FixedBtnsMobile /> : null} */}
            {!checkCurrentIsPhone ? <FixedBtns /> : null}
            <LoginModal
              visible={loginVisible}
              onLogin={() => {
                setLoginVisible(false);
                EventEmitter.emit('login-status-change');
              }}
              onCancel={() => {
                setLoginVisible(false);
              }}
            />
          {/* </ProLayout> */}
        </>
      )}
    </>
  );
  // if (code) {
  //   return (
  //     <div>
  //       <FormattedMessage id="Being certified" />
  //       ...
  //     </div>
  //   );
  // }
};

export default connect(({ global, tips, settings, divice, user }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
  isPhone: divice.isPhone,
  showTips: tips.showTips,
  currentUser: user.currentUser,
}))(BasicLayout);
