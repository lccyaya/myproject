import { NavBar } from 'antd-mobile';
import React from 'react';
import { useDispatch, useHistory } from 'umi';
import styles from './index.less';
import IconFont from '@/components/IconFont';
import { Button } from 'antd';
import EventEmitter from '@/utils/event';

type Props = {};
interface Item {
  title: string,
  path: string,
}

const Setting: React.FC<Props> = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const settingItems: Item[] = [
    {
      title: '个人设置',
      path: '/zh/personal/setting',
    },
    // {
    //   title: '安全设置',
    //   path: '/zh/security/setting',
    // },
    {
      title: '用户协议',
      path: '/zh/terms',
    },
    {
      title: '隐私协议',
      path: '/zh/privacy',
    },
    // {
    //   title: '关于我们',
    //   path: '/zh/about',
    // },
  ];

  const back = () => {
    history.goBack();
  };

  const logout = () => {
    if (dispatch) {
      dispatch({
        type: 'user/logout',
      });
    }
    EventEmitter.emit('login-status-change');
  };

  const confirmLogout = () => {
    logout();
    history.push(`/zh/home`);
    // if (history.location.pathname.includes(`/zh/account/`) || history.location.pathname.includes(`/zh/profile/`)) {
    //   history.push(`/zh/home`);
    // } else {
    //   location.reload();
    // }
  };

  const clickItem = (item: Item) => {
    history.push(item.path)
  };

  return (
    <div className={styles.container}>
      <NavBar className={styles.navbar} onBack={back}>
        设置
      </NavBar>
      <div className={styles.items_container}>
        {settingItems.map((settingItem) => (
          <div
            className={styles.item_box}
            key={settingItem.path}
            onClick={() => {
              clickItem(settingItem);
            }}
          >
            <div className={styles.item_title}>{settingItem.title}</div>
            <IconFont
              className={styles.arrow_icon}
              type="icon-jiantouyou"
              color="#BBBBBB"
              size={14}
            ></IconFont>
          </div>
        ))}
      </div>
      <div className={styles.items_container}>
        <Button className={styles.button} type="text" onClick={confirmLogout}>
          <span className={styles.title}>退出登录</span>
        </Button>
      </div>
    </div>
  );
};

export default Setting;
