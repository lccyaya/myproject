import React from 'react';
import { Empty } from 'antd';
import { FormattedMessage } from 'umi';
import styles from './pc.module.less';
import empty from '@/assets/icon/empty.svg';

const EmptyCom = (props) => <div className={styles.empty_box}>
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
</div>
export default EmptyCom;