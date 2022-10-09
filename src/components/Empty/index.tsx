import type { CSSProperties } from 'react';
import React from 'react';
import { Empty } from 'antd';
import { FormattedMessage } from 'umi';

import empty from '@/assets/icon/empty.svg';
import styles from './index.less';

interface IProps {
  style?: CSSProperties;
  localeMessage?: string;
  textStyle?: CSSProperties;
  pic?: string;
  message?: string;
}

const MEmpty: React.FC<IProps> = (props) => {
  return (
    <Empty
      style={props.style}
      className={styles.empty}
      image={props.pic || empty}
      description={
        <span style={props.textStyle}>
          {props.message ? (
            props.message
          ) : (
            <FormattedMessage id={props.localeMessage || 'key_no_data'} />
          )}
        </span>
      }
    />
  );
};

export default MEmpty;
