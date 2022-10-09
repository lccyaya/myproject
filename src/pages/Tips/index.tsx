import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { Row, Spin } from 'antd';
import { connect, FormattedMessage } from 'umi';
import type { ConnectState } from '@/models/connect';
import Banner from '@/components/Banner';

import TipComponent from '../../components/Tips';
import HistoryTips from '../../components/HistoryTips';
import styles from './index.less';
import * as homeService from '@/services/home';
import type { tipsType } from '@/services/home';
import MEmpty from '@/components/Empty';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';

type IProps = {
  isPhone?: boolean;
  ssrHistoryTips?: tipsType[];
  hideLoading?: boolean;
};

const Tips: React.FC<IProps> = (props: IProps) => {
  const { ssrHistoryTips, hideLoading } = props;
  const [tipsData, setTipsData] = useState<tipsType[]>([]);
  const [historyTipsData, setHistoryTipsData] = useState<tipsType[]>(ssrHistoryTips || []);
  const [isHistroyTipsLoading, setHistroyTipsLoading] = useState<boolean>(false);

  const getTipsData = async () => {
    try {
      const result = await homeService.getTipData();
      if (result.success) {
        setTipsData(result.data.tips);
      }
    } catch {
      console.log('can not get tips data');
    }
  };

  const getTipHistoryData = async () => {
    setHistroyTipsLoading(!hideLoading);
    try {
      const result = await homeService.getTipHistoryData();
      setHistroyTipsLoading(false);
      if (result.success) {
        setHistoryTipsData(result.data.tips);
      }
    } catch {
      console.log('can not get history tips data');
      setHistroyTipsLoading(false);
    }
  };
  useEffect(() => {
    getTipsData();
    getTipHistoryData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.main}>
      {tipsData && tipsData.length > 0 && (
        <div className={styles.tipsContent}>
          <Row className={styles.title}>
            <FormattedMessage id="key_recommend" />
          </Row>
          {tipsData && tipsData.length > 0 ? (
            <TipComponent
              data={tipsData}
              direction="horizental"
              reportCate={REPORT_CATE.tips}
              reportAction={REPORT_ACTION.tips_match_enter}
            />
          ) : (
            <MEmpty />
          )}
        </div>
      )}
      <Banner className={styles.banner} />
      <Row className={classnames(styles.title, styles.head)}>
        <FormattedMessage id="key_history" />
      </Row>
      <Spin spinning={isHistroyTipsLoading}>
        {historyTipsData && historyTipsData.length > 0 ? (
          <HistoryTips
            data={historyTipsData}
            reportCate={REPORT_CATE.tips}
            reportAction={REPORT_ACTION.tips_match_enter}
          />
        ) : (
          !isHistroyTipsLoading && <MEmpty />
        )}
      </Spin>
    </div>
  );
};
// export default Tips;

// @ts-ignore
// Tips.getInitialProps = async () => {
//   const result = await homeService.getTipHistoryData();
//   return {
//     ssrHistoryTips: result.success ? result.data.tips : undefined,
//     hideLoading: true,
//   };
// };

export default connect(({ divice }: ConnectState) => ({
  isPhone: divice.isPhone,
}))(Tips);
