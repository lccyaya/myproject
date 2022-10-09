import BaseModal from '@/components/BaseModal/pc';
import styles from './pc.module.less';
import React, { useState } from 'react';
export default function Privilege() {
  const [visible, setVisible] = useState(true);
  return (
    <BaseModal visible={visible} closable={false} hideBg>
      <div className={styles.modal_content}>
        <div className={styles.title}>新人专属特权</div>
        <div className={styles.desc}>
          <div className={styles.welfare}>
            <span>6</span>元看方案
          </div>
          <div className={styles.welfare_desc}>
            <span className={styles.line} />
            <span className={styles.value}>超值 105 元大礼包</span>
            <span className={styles.line} />
          </div>
        </div>
        <div className={styles.button}>立即领取</div>
        <div className={styles.condition}>仅限新用户领取</div>
        <div className={styles.close} />
      </div>
    </BaseModal>
  );
}
