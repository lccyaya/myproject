import { Avatar } from 'antd';
import React, { HTMLAttributes, useState } from 'react';
import styles from './index.less';
import avatarImg from '@/assets/mine/avatar.png';
import { useSelector } from 'umi';
import { ConnectState } from '@/models/connect';
import { UserInfoType } from '@/services/user';
import { ExpertStatus } from '@/utils/scheme';
import Certification from '@/pages/Certification';
import EventEmitter from '@/utils/event';

interface Props {}

type IProps = Props & HTMLAttributes<HTMLDivElement>;

const UserInfo: React.FC<IProps> = (props) => {
  const { style } = props;
  const user = useSelector<ConnectState, UserInfoType | null | undefined>(
    (s) => s.user.currentUser,
  );
  const [loginVisible, setLoginVisible] = useState<boolean>(false);

  const avatar = user?.expert?.status == ExpertStatus.Accept ? user?.expert?.avatar : user?.avatar;
  const nickname = user?.expert?.status == ExpertStatus.Accept ? user?.expert?.nickname : user?.nickname;

  const onClick = () => {
    if (!user) {
      setLoginVisible(true)
    }
  }

  return (
    <div style={style}>
      <div className={styles.userinfo_box}>
        <Avatar src={(avatar && avatar.length > 0) ? avatar : avatarImg} size={66} />
        <div className={styles.login_txt_box} onClick={onClick}>
          <span className={styles.login_title}>{nickname ?? '登录/注册'}</span>
          <span className={styles.login_des}>{user ? '这个人很懒，还未添加个人信息' : '登录可享更多精彩内容'}</span>
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

export default UserInfo;
