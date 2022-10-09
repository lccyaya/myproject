import React, { useEffect, useState } from 'react';
import styles from './index.less';
import classNames from 'classnames';
import { useHistory, useLocation, useSelector } from 'umi';
import { ConnectState } from '@/models/connect';
import { UserInfoType } from '@/services/user';
import { ExpertStatus } from '@/utils/scheme';

type Props = {};

type FBMenuItem = {
  key: string;
  title: string;
  path: string;
  regex: RegExp;
}

const HeaderMenu: React.FC = (props: Props) => {

  const user = useSelector<ConnectState, UserInfoType | null | undefined>(
    (s) => s.user.currentUser,
  );

  let items1: FBMenuItem[] = [
    { key: '1', title: '首页', path: '/zh/home', regex: /\/home\/*/, },
  ];

  let items2: FBMenuItem[] = [
    { key: '1', title: '首页', path: '/zh/home', regex: /\/home\/*/, },
    { key: '2', title: '创作中心', path: '/zh/profile/center', regex: /\/profile\/*/, },
  ];

  const history = useHistory()
  const location = useLocation()
  const path = location.pathname
  const [selectedKey, setSelectedKey] = useState('');
  const [items, setItems] = useState<FBMenuItem[]>(items1);

  const onClick = (item: FBMenuItem) => {
    history.push(item.path)
  }

  useEffect(() => {
    let menus = user?.expert?.status == ExpertStatus.Accept ? items2 : items1;
    setItems(menus);

    const _page = items.find(item => item.regex.test(path))
    setSelectedKey(_page?.key || '');
  }, [user, path]);

  return (
    <div className={styles.container}>
      {items.map((item) => (
        <div className={classNames(styles.menu_item)} onClick={() => onClick(item)} key={item.key}>
          <div
            className={classNames(
              styles.item_content,
              selectedKey == item.key ? styles.menu_item_active : null,
            )}
          >
            {item.title}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeaderMenu;
