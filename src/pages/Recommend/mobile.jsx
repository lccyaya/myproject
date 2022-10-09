import styles from './mobile.module.less';
import classnames from 'classnames';
import { message, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import Feature from './feature/mobile';
import BaseSelect from '@/components/BaseSelect/mobile';
import { competitionList } from '@/services/expert';
import Empty from '@/components/Empty';

export default function Recommend() {
  const [selectedKeys, setSelectedKeys] = useState('');
  const [selectedCompetitionId, setSelectedCompetitionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const all = [
    {
      competition_name: '全部',
      competition_id: '',
    },
  ];
  const init = async () => {
    setLoading(true);
    const result = await competitionList();
    setLoading(false);
    if (result.success) {
      const categories = result.data;
      if (categories && categories.length > 0) {
        setData(categories);
      }
    } else {
      message.error(result.message);
    }
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <Spin className={styles.spin} spinning={loading}>
      <div className={styles.main}>
        {!loading ? (
          data.length > 0 ? (
            <>
              <BaseSelect
                data={[...all, ...data]}
                activeKey={selectedKeys}
                onChange={(val) => {
                  setSelectedKeys(val);
                  setSelectedCompetitionId(val);
                }}
              />
              <div className={styles.content}>
                <Feature competitionId={selectedCompetitionId} />
              </div>
            </>
          ) : (
            <Empty />
          )
        ) : null}
      </div>
    </Spin>
  );
}
