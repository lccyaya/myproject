import React from 'react';

import { Modal, Button, Badge } from 'antd';
import classnames from 'classnames';

import styles from './index.less';
import type { ILive } from '../index';
import { FormattedMessage } from 'react-intl';
import { history } from 'umi';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';

type IProps = {
  visible: boolean;
  list: ILive[];
  selectId: number;
  onCancel: () => void;
  onChange: (e: ILive) => void;
};
const Channel: React.FC<IProps> = (props) => {
  const { visible, onCancel, onChange, list, selectId } = props;
  const isDetailPage = /details\/\d+/.test(history.location.pathname);
  return (
    <Modal
      destroyOnClose
      closable={false}
      visible={visible}
      onCancel={() => {
        onCancel();
        if (isDetailPage) {
          report({
            cate: REPORT_CATE.match_detail,
            action: REPORT_ACTION.match_detail_cancel_live,
          });
        }
      }}
      footer={false}
      wrapClassName={styles.modal}
      centered
    >
      <div className={styles.container}>
        <div className={styles.title}><FormattedMessage id="key_select_the_channal" /></div>
        <div className={styles.content}>
          {list.map((i, index) => (
            <Button
              className={classnames(styles.handler, index !== list.length - 1 ? styles.top : '')}
              type={i!.id === selectId ? 'primary' : 'default'}
              onClick={() => {
                onChange(i);
                if (i?.id && isDetailPage) {
                  report({
                    cate: REPORT_CATE.match_detail,
                    action: REPORT_ACTION.match_detail_choose_live + i.id,
                  });
                }
              }}
              key={i?.id}
            >
              <Badge color="#FF3B3B" />
              {i!.name}
            </Button>
          ))}
          <div onClick={onCancel} className={styles.cancel}>
            <FormattedMessage id="key_cancel" />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Channel;
