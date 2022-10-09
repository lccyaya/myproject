import React from 'react';
import { Avatar, Space, Row, Col } from 'antd';
import classnames from 'classnames';
import styles from './index.less';
import defaultAvatar from '@/assets/icon/avatar.svg';

import * as matchService from '@/services/match';
import Status from '../Status';

export type ItemPropsType = matchService.PlayerItem & { isHome: boolean };

const Item: React.FC<ItemPropsType> = (props) => {
  const { isHome, shirt_number, name, logo } = props;
  return (
    <div className={styles.item}>
      {isHome ? (
        <div className={classnames(styles.itemHome, styles.itemWrapper)}>
          <Space className={styles.info}>
            <Avatar className={styles.avatar} src={logo || defaultAvatar} />
            {shirt_number && <span className={styles.number}>{shirt_number}</span>}
            {name && <span className={styles.name}>{name}</span>}
          </Space>
          <div className={styles.status}>
            {props.incidents && <Status noBackground data={props.incidents} />}
          </div>
        </div>
      ) : (
        <div className={classnames(styles.itemAway, styles.itemWrapper)}>
          <Space className={styles.info}>
            {name && <span className={styles.name}>{name}</span>}

            {shirt_number && <span className={styles.number}>{shirt_number}</span>}
            <Avatar className={styles.avatar} src={logo || defaultAvatar} />
          </Space>
          <div className={styles.status}>
            {props.incidents && <Status noBackground data={props.incidents} />}
          </div>
        </div>
      )}
    </div>
  );
};

type GroupType = {
  type: 'coach' | 'bench' | 'absence';
  name: any;
  home: ItemPropsType[];
  away: ItemPropsType[];
};

const Group: React.FC<GroupType> = (props) => {
  const { name, home, away } = props;
  return (
    <div className={styles.group}>
      <div className={styles.label}>{name}</div>
      <Row className={styles.content}>
        <Col className={styles.home} span={12}>
          <span className={styles.tag} />
          {home && home.map((i) => (
            <Item {...i} />
          ))}
        </Col>
        <Col className={styles.away} span={12}>
          <span className={styles.tag} />
          {away && away.map((i) => (
            <Item {...i} />
          ))}
        </Col>
      </Row>
    </div>
  );
};

interface ICourt {
  data: GroupType[];
}

const PlayerList: React.FC<ICourt> = (props) => {
  const { data } = props;
  return (
    <div className={styles.container}>
      {data.map((i) => (
        <div>
          {
            ((i.home && i.home.length > 0) || (i.away && i.away.length > 0)) ? <Group {...i} /> : null
          }
        </div>
      ))}
    </div>
  );
};

export default PlayerList;
