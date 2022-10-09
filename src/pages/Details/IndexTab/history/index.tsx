import { Modal, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import Header from './header';
import OddTable from './table';
import styles from './index.less';
import * as matchService from '@/services/match';

export type IProps = {
  visible: boolean;
  onCancel: () => void;
  match: matchService.MatchDetails;
  odd: matchService.OddsCompanyType;
  matchId: number;
  type: matchService.OddsType;
};

const OddsHistory: React.FC<IProps> = (props) => {
  const { visible, onCancel, odd, type } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<matchService.OddsItem>();

  const init = async () => {
    setLoading(true);
    const result = await matchService.fetchCompanyHistoryOdds({
      match_id: props.matchId,
      company_id: odd.id,
    });
    setLoading(false);
    if (result.success) {
      const { data } = result;
      if (data) {
        setData(data[`${type}`]);
      }
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Modal
      destroyOnClose
      visible={visible}
      onCancel={onCancel}
      footer={false}
      wrapClassName={styles.modal}
      centered
    >
      <div className={styles.container}>
        <Header data={props.match} />
        <Spin spinning={loading}>
          {
            // @ts-ignore
            <OddTable data={data} name={odd.name} />
          }
        </Spin>

      </div>
    </Modal>
  );
};

export default OddsHistory;
