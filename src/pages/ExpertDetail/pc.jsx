import styles from './pc.module.less';
import SchemeList from '@/components/SchemeList';
import ExpertDesc from '@/components/expert/expert-desc/pc';
import { expertDetail } from '@/services/expert';
import { history } from 'umi';
import React, { useState, useEffect } from 'react';
import Chart from '@/components/Chart/pc';
import Empty from '@/components/Empty';
import EventEmitter from '@/utils/event';
import { Spin } from 'antd';

export default function ExpertDetail() {
  const { query } = history.location;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const fetchData = async (hasLoading = true) => {
    hasLoading && setLoading(true);
    const resp = await expertDetail({
      id: query.id,
    });
    setLoading(false);
    if (resp.success) {
      setData(resp.data);
    }
  };
  const { record = {} } = data;
  const refresh = () => {
    fetchData(false);
  };
  useEffect(() => {
    fetchData();
    EventEmitter.on('login-status-change', refresh);
    return () => {
      EventEmitter.on('login-status-change', refresh);
    };
  }, []);
  return (
    <div>
      <Spin spinning={loading}>
        <div className={styles.main}>
          <div className={styles.left}>
            <ExpertDesc
              expert={{ ...data.expert, has_record: data.has_record }}
              refresh={refresh}
              type="expert"
            />
          </div>
          <div className={styles.right}>
            {!(data.has_record || data?.sale_schemes?.length || data?.history_schemes?.length) ? (
              <Empty />
            ) : (
              <>
                {data.has_record ? (
                  <div className={styles.section}>
                    <div className={styles.title}>战绩统计</div>
                    <div className={styles.chart}>
                      <div className={styles.record_total}>
                        <div className={styles.item}>
                          <div className={styles.value}>{record.recent_loop_hit}</div>
                          <div className={styles.label}>近期连中</div>
                        </div>
                        <div className={styles.item}>
                          <div className={styles.value}>{record.max_hit}</div>
                          <div className={styles.label}>最长连中</div>
                        </div>
                        <div className={styles.item}>
                          <div className={styles.value}>
                            {record.hit_rate}
                            <span>%</span>
                          </div>
                          <div className={styles.label}>命中率</div>
                        </div>
                      </div>
                      {record.record_list?.length ? <Chart record={record.record_list} /> : null}
                    </div>
                  </div>
                ) : null}
                {data?.sale_schemes?.length ? (
                  <div className={styles.section}>
                    <div className={styles.title}>在售方案 ({data.sale_schemes?.length || 0})</div>
                    <SchemeList showExpert={false} list={data.sale_schemes || []} />
                  </div>
                ) : null}
                {data?.history_schemes?.length ? (
                  <div className={styles.section}>
                    <div className={styles.title}>历史方案</div>
                    <SchemeList showExpert={false} list={data.history_schemes || []} />
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </Spin>
    </div>
  );
}
