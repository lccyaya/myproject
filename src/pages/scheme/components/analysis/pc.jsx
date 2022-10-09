import styles from './pc.module.less';
import Detail from '@/pages/Details/scheme/webview/pc';
import Countdown from '@/components/Countdown/pc';
import React, { useState } from 'react';
import { SCHEME_STATE } from '@/constants/index';

const Analysis = ({ detail, matchInfo = {}, isStop }) => {
  const [complete, setComplete] = useState(false);

  if (!detail) {
    return null;
  }
  return (
    <div className={styles.analysis}>
      <div className={styles.analysis_title}>分析</div>
      <div className={styles.analysis_content}>
        {detail.detail ? (
          <Detail detail={detail.detail} />
        ) : (
          <>
            {isStop ? (
              <div className={styles.stop_sale}>售卖已截止</div>
            ) : (
              <>
                {!detail.detail && detail.state === SCHEME_STATE.SALE ? (
                  <div className={styles.count_down_wrap}>
                    <div className={styles.title}>
                      {matchInfo.diff > 0 && !complete ? '开赛倒计时' : '已开赛'}
                    </div>
                    {matchInfo.diff > 0 && !complete ? (
                      <Countdown
                        diff={matchInfo.diff}
                        className={styles.countdown}
                        onComplete={() => {
                          setComplete(true);
                        }}
                      />
                    ) : null}
                    <div className={styles.tip}>支付后查看推荐项及{detail.detail_count}字分析</div>
                  </div>
                ) : (
                  <Detail detail={detail.detail} />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Analysis;
