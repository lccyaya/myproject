import React from 'react';
import { Avatar, Space } from 'antd';
import styles from './index.less';
import * as matchService from '@/services/match';
import defaultAvatar from '@/assets/icon/avatar.svg';
import classnames from 'classnames';
import Status from './Status';
import { checkIsPhone } from '@/utils/utils';

export type ICourt = matchService.PlayerItem & { isHome: boolean, isPhone?: boolean };
const Court: React.FC<ICourt> = (props) => {
  const { incidents } = props;
  const isPhone = checkIsPhone()
  return (
    <div
      style={
        isPhone ? (
          props.isHome
            ? { left: `${props.x}%`, top: `${(props.y - 20) / 2.25}%` }
            : { right: `${props.x}%`, bottom: `${(props.y - 20) / 2.25}%` }
        ) : (
          props.isHome
            ? { bottom: `${props.x}%`, left: `${props.y / 2.25}%` }
            : { top: `${props.x}%`, right: `${props.y / 2.25}%` }
        )

      }
      className={classnames(styles.container, props.isHome ? styles.home : styles.away)}
      title={`${props.shirt_number} ${props.name}`}
    >

      <div className={styles.status}>
        {incidents && <Status data={incidents} />}
      </div>
      <Avatar className={styles.avatar} src={props.logo || defaultAvatar} />
      <div className={styles.info}>
        <span className={styles.number}>{props.shirt_number}</span>
        <span className={styles.name}>{props.name}</span>
      </div>
    </div>
  );
};

export default Court;
