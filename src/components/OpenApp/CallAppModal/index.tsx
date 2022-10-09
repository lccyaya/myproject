import React, { useState } from 'react';

import { Modal, Button } from 'antd';
import { callApp } from '@/utils/utils';
import classnames from 'classnames';
import { checkIsPhone } from '@/utils/utils';

import styles from './index.less';
import { FormattedMessage } from 'react-intl';
import { report } from '@/services/ad';
import { useLocation } from 'umi';
import { getPageFromPath } from '@/utils/page-info';
import { REPORT_ACTION } from '@/constants';
import { getDownloadLinkByChannel } from '@/services/app';
import pageConfig from '@/utils/pageConfig';
import Iconfont from '@/components/IconFont';

type IProps = {
  title: string;
};
const Channel: React.FC<IProps> = (props) => {
  const { title, children } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const location = useLocation();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const channel = query.get('channel');
  const path = location.pathname;

  const handleClick = () => {
    setVisible(true);
    const page = getPageFromPath(path);
    if (page) {
      report({
        cate: page.cate,
        action: REPORT_ACTION.remind_download_click,
      });
    }
  };

  let trigger = null;
  if (children) {
    if (checkIsPhone()) {
      // @ts-ignore
      trigger = React.cloneElement(React.Children.only(children), {
        onClick: handleClick,
      });
    } else {
      trigger = children;
    }
  }

  return (
    <React.Fragment>
      {trigger || (
        <span className={classnames(children ? '' : styles.bottom)} onClick={handleClick}>
          {
            <span>
              <Iconfont size={18} type="icon-shipin"/>
              <span className={styles.text}><FormattedMessage id="key_watch_live_in_app" /></span>
            </span>
          }
        </span>
      )}

      <Modal
        destroyOnClose
        closable={false}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={false}
        wrapClassName={styles.modal}
        centered
      >
        <div className={styles.container}>
          <div className={styles.logo}>
            <img src={pageConfig.min_logo} />
          </div>
          <div className={styles.title}>{title || 'title'}</div>
          {/* <div className={styles.content}>
            {props.children}
          </div> */}
          <div className={styles.handler}>
            <Button
              onClick={async (e) => {
                const isIOS = /iphone/i.test(navigator.userAgent);
                if (isIOS) {
                  callApp('');
                } else {
                  const res = await getDownloadLinkByChannel(channel || '');
                  if (res.success) {
                    callApp(res.data.download_url);
                  } else {
                    callApp('');
                  }
                }
                e.preventDefault();
                e.stopPropagation();
              }}
              type="primary"
              className={styles.yes}
            >
              <FormattedMessage id="key_open_immediately" />
            </Button>
            <Button onClick={() => setVisible(false)} type="default" className={styles.cancel}>
              <FormattedMessage id="key_cancel" />
            </Button>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default Channel;
