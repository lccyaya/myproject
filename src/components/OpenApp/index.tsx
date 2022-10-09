import React, { useState, useEffect } from 'react';
import { Button } from 'antd';

import { useIntl, useLocation, useSelector, history } from 'umi';
import { callApp } from '@/utils/utils';
import pageConfig from '@/utils/pageConfig';
import { report } from '@/services/ad';
import { REPORT_ACTION } from '@/constants';
import { getPageFromPath } from '@/utils/page-info';
import type { ConnectState } from '@/models/connect';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { checkIsPhone } from '@/utils/utils';
import styles from './index.less';

type IProps = {};

const OpenApp: React.FC<IProps> = () => {
  const intl = useIntl();
  const isPhone = checkIsPhone();
  const abVersion = useSelector<ConnectState, ConnectState['abtest']['version']>(
    (state) => state.abtest.version,
  );
  const location = useLocation();
  const path = location.pathname;
  const [page, setPage] = useState('');
  useEffect(() => {
    const _page = getPageFromPath(path);
    setPage(_page?.key || '');
  }, [path]);
  const handleOpenClick = () => {
    const _page = getPageFromPath(history.location.pathname);
    if (_page) {
      report({
        cate: _page.cate,
        action: REPORT_ACTION.download_global_open,
      });
    }
    if (page !== 'download' && abVersion) {
      const lang = toShortLangCode(locale.getLocale());
      history.push(`/${lang}/download`);
    }
    // callApp();
  };
  if (page === 'download' && isPhone) {
    return null;
  }
  return (
    <div className={styles.wrapper} id="global-open-app-header">
      <div className={styles.left}>
        <img src={pageConfig.min_logo} />
        <div className={styles.info}>
          <div className={styles.title}>{intl.formatMessage({ id: 'key_most_active' })}</div>
          <div className={styles.desc}>{intl.formatMessage({ id: 'key_open_app' })}</div>
        </div>
      </div>
      {/* <div onClick={handleOpenClick} className={styles.right}>
        <Button size="small" type="primary" className={styles.open}>
          {intl.formatMessage({ id: 'key_open' })}
        </Button>
      </div> */}
    </div>
  );
};

export default OpenApp;
