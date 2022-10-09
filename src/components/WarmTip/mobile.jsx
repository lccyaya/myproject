import styles from './mobile.module.less';
import FeedBack from '@/components/FeedBack/mobile';
import React, { useState } from 'react';
import cls from 'classnames';
import { handleReport } from '@/utils/report';

const WarnTip = ({ className = '' }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className={cls(styles.warm_tip, className)}>
      <p>温馨提示：</p>
      <p>
        1、34 Sport <span>非购彩平台</span>，金币一经充值成功，只可在 app 内使用，
        <span>不支持提现、退款等操作</span>。
      </p>
      <p>
        2、充值会有缓冲时间，可能会有延迟到账问题，请耐心等待。如长时间未到账，可
        <a
          onClick={() => {
            setVisible(true);
            handleReport({
              action: 'feedback',
            });
            return false;
          }}
        >
          点击反馈
        </a>
        联系我们。
      </p>
      <FeedBack visible={visible} setVisible={setVisible} />
    </div>
  );
};
export default WarnTip;
