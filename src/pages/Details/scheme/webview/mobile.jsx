import React, { useState, useEffect } from 'react';
import { useLocation } from 'umi';
import { schemeAnalyseText } from '@/services/expert';
import styles from './mobile.module.less';
import { timeStorageSet } from '@/utils/timestorage';
import { FOOTBALL_MASTER_TOKEN } from '@/constants';

const Mobile = ({ detail }) => {
  const location = useLocation();
  const [content, setContent] = useState('');
  const { id } = location.query;
  useEffect(() => {
    if (!detail) {
      window.getTokenCallBack = (json) => {
        const { token, refreshToken } = JSON.parse(json);
        timeStorageSet(FOOTBALL_MASTER_TOKEN, token, 864e5 - 10 * 1000);
        schemeAnalyseText({ id }).then((e) => {
          if (e.success) {
            setContent(e.data?.detail);
          } else {
            if (e.code === 401) {
              window?.webkit?.messageHandlers?.tokenInvalid?.postMessage(null);
            }
          }
        });
      };
      window?.webkit?.messageHandlers?.getToken?.postMessage(null);
    }
  }, []);
  return (
    <div className={styles.detail_html}>
      <div dangerouslySetInnerHTML={{ __html: detail || content }} />
    </div>
  );
};

export default Mobile;
