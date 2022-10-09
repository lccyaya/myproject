import styles from './download-tip.less';
import { RightOutlined } from '@ant-design/icons';
import { FormattedMessage, useSelector, useLocation } from 'umi';
import { APP_STORE_LINK, GOOGLE_PLAY_LINK, REPORT_ACTION, REPORT_CATE } from '@/constants';
import { getDownloadLinkByChannel } from '@/services/app';

import type { ConnectState } from '@/models/connect';
import { report } from '@/services/ad';

export default function DownloadTip() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const channel = query.get('channel');
  const abVersion = useSelector<ConnectState, ConnectState['abtest']['version']>(
    (state) => state.abtest.version,
  );
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const handleClick = async () => {
    if (abVersion) {
      report({
        cate: REPORT_CATE.home,
        action: REPORT_ACTION.remind_download_click,
        tag: abVersion.toLowerCase(),
      });
    }

    let link = isIOS ? APP_STORE_LINK : GOOGLE_PLAY_LINK;
    if (!isIOS) {
      const res = await getDownloadLinkByChannel(channel || '');
      if (res.success) {
        link = res.data.download_url;
      }
    }
    window.open(link);
  };

  return (
    <div className={styles.wrapper} onClick={handleClick}>
      <div className={styles.container}>
        <div className={styles.text}>
          <FormattedMessage id="key_download_tips" />
        </div>
        <RightOutlined className={styles.icon} />
      </div>
    </div>
  );
}
