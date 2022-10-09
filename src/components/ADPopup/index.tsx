import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import CloseIcon from '@/assets/close.png';

import { Modal } from 'antd';
import { POP_POSITION_MOBILE, POP_POSITION_PC, REPORT_ACTION } from '@/constants';
import { getReportCate, checkIsPhone } from '@/utils/utils';

import * as ADService from '@/services/ad';
import styles from './index.less';
import EventEmitter from '@/utils/event';

function getPopup(path: string) {
  const isPhone = checkIsPhone();
  const POSITION = isPhone ? POP_POSITION_MOBILE : POP_POSITION_PC;
  let result;
  if (path) {
    if (path.includes('tip')) {
      result = POSITION.tips;
    } else if (path.includes('detail')) {
      result = POSITION.detail;
    } else if (path.includes('info')) {
      result = POSITION.info;
    } else if (path.includes('account')) {
      result = POSITION.me;
    } else if (path.includes('home')) {
      result = POSITION.home;
    }
  }
  return result;
}

interface IProps {
  pathname?: string;
  isPhone: boolean;
}

const ADPopup: React.FC<IProps> = (props) => {
  const { pathname } = props;
  const isPhone = checkIsPhone();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<ADService.PopupResult>();

  const report = async (action: REPORT_ACTION, tag?: string | number) => {
    await ADService.report({ cate: getReportCate(), action, tag });
  };

  const init = async ({ position }: { position?: ADService.IPosition }) => {
    if (position) {
      const result = await ADService.listPopup({ position });
      if (result.success && result.data && result.data.popup) {
        setVisible(true);
        setData(result.data);
        report(
          REPORT_ACTION.pop_display,
          result.data.popup.id === 'op_popup_1001003' ? 'pop_gift' : result.data.popup.id,
        );
      }
    }
  };
  EventEmitter.on('register', () => {
    init({ position: getPopup(pathname) });
  });
  useEffect(() => {
    init({ position: getPopup(pathname) });
  }, [pathname]);

  return visible && data && data.popup ? (
    <Modal
      title={null}
      centered
      footer={null}
      closable={false}
      wrapClassName={styles.wrapper}
      visible={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      width={isPhone ? '80vw' : '256px'}
    >
      <div>
        <div
          onClick={() => {
            window.open(data.popup.landing_page);
            report(
              REPORT_ACTION.pop_click,
              data.popup.id === 'op_popup_1001003' ? 'pop_gift' : data.popup.id,
            );
            setVisible(false);
          }}
        >
          <img src={data.popup.img} />
        </div>
        <div
          className={styles.close}
          onClick={() => {
            setVisible(false);
            report(
              REPORT_ACTION.pop_close,
              data.popup.id === 'op_popup_1001003' ? 'pop_gift' : data.popup.id,
            );
          }}
        >
          <div className={styles.divide} />
          <img src={CloseIcon} alt="" className={styles.icon} />
        </div>
      </div>
    </Modal>
  ) : null;
};

// export default Carousel;
export default connect(({ divice }: ConnectState) => ({
  isPhone: divice.isPhone,
}))(ADPopup);
