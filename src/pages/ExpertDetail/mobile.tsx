import styles from './mobile.module.less';
import SchemeList from '@/components/SchemeList/mobile';
import Watch from '@/components/Watch/mobile';
import Iconfont from '@/components/IconFont';
import cls from 'classnames';
import Tags from '@/components/Tags/mobile';
import SkilledCompetitions from '@/components/expert/skilled-competitions/mobile';
import { expertDetail } from '@/services/expert';
import { history, useHistory, useLocation } from 'umi';
import React, { useState, useEffect } from 'react';
import Achievements from '@/components/achievements/mobile';
import Chart from '@/components/Chart/mobile';
import Avatar from '@/components/avatar';
import { Spin } from 'antd';
import Empty from '@/components/Empty';
import EventEmitter from '@/utils/event';
import { NavBar } from 'antd-mobile';

const ExpertDetail: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const history = useHistory();
  const location = useLocation();
  const { query } = location;
  console.log(location)
  
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
  const { expert = {}, recent_record = [], record = {} } = data;

  const back = () => {
    history.goBack();
  }

  return (
    <div className={styles.main}>
      <NavBar onBack={back}>专家详情</NavBar>
      <Spin spinning={loading}>
        <>
          <div className={styles.header}>
            <div className={styles.info}>
              <Avatar src={expert.avatar} className={styles.avatar} size={36} />
              <div className={styles.content_wrap}>
                <div className={styles.content}>
                  <div className={styles.top}>
                    <span className={styles.nickname}>{expert.nickname}</span>
                    {/* <Tags list={[expert.continuous_tag, expert.hit_tag]} /> */}
                  </div>
                  <div className={styles.bottom}>
                    <div className={styles.num_wrap}>
                      <span>{expert.fans_num}</span>关注
                    </div>
                    <div className={styles.num_wrap}>
                      <span>{expert.scheme_num}</span>方案
                    </div>
                  </div>
                </div>
                <Watch id={expert.id} followed={expert.followed} onSuccess={refresh} />
              </div>
            </div>
            <div className={styles.desc}>{expert.introduce}</div>
            <SkilledCompetitions
              label="擅长联赛："
              list={expert.skilled_competitions || []}
              expertId={expert.id}
            />
          </div>
          <div className={styles.body}>
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
                      {record.record_list?.length ? (
                        <Chart record={record.record_list} className={styles.chart_wrap} />
                      ) : null}
                    </div>
                    {recent_record.length ? <Achievements records={recent_record} /> : null}
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
        </>
      </Spin>
    </div>
  );
}

export default ExpertDetail
