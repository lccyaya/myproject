import React from 'react';
import styles from './pc.module.less';
import moment from 'moment';
import { formatTime } from '@/utils/utils';
import Collect from '@/components/collect/pc';

const SchemeDesc = ({ describe, published_at, collected, id }) => {
  return (
    <div className={styles.scheme_desc}>
      <div className={styles.scheme_desc_text}>
        <span>{describe}</span>
        <Collect collected={collected} id={id} />
      </div>
      <div className={styles.publish_at}>
        {published_at ? `${formatTime(published_at)}发布` : ''}
      </div>
      <div className={styles.line} />
    </div>
  );
};

export default SchemeDesc;
