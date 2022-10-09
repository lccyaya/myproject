import IconFont from '@/components/IconFont';
import { ConnectState } from '@/models/connect';
import { UserInfoType } from '@/services/user';
import { NavBar } from 'antd-mobile';
import React from 'react';
import { useHistory, useSelector } from 'umi';
import styles from './index.less';

type Props = {};

const SecuritySetting: React.FC<Props> = (props) => {
  const user = useSelector<ConnectState, UserInfoType | null | undefined>(
    (s) => s.user.currentUser,
  );
  const history = useHistory();

  const phone = user?.phone ?? '';
  const securityPhone = `******${phone.substring(phone.length - 4, phone.length)}`;

  const back = () => {
    history.goBack();
  };

  const settingItems = [
    {
      title: '手机号',
      key: 'phone',
    },
    {
      title: '修改密码',
      key: 'password',
    },
  ];

  return (
    <div className={styles.container}>
      <NavBar className={styles.navbar} onBack={back}>
        安全设置
      </NavBar>
      <div className={styles.items_container}>
        {settingItems.map((settingItem) => (
          <div className={styles.item_box} key={settingItem.key}>
            <div className={styles.item_content}>
              <div className={styles.item_title}>{settingItem.title}</div>
              {settingItem.key == 'phone' ? (
                <div className={styles.item_title}>{securityPhone}</div>
              ) : null}
            </div>
            {settingItem.key == 'phone' ? null : (
              <IconFont
                className={styles.arrow_icon}
                type="icon-jiantouyou"
                color="#BBBBBB"
                size={14}
              ></IconFont>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecuritySetting;
