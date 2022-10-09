import React from 'react';
import { Empty } from 'antd';
import { FormattedMessage } from 'umi';
import styles from './mobile.module.less';
import empty from '@/assets/icon/empty.svg';

const EmptyCom = (props) => <Empty
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
export default EmptyCom;