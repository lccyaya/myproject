import styles from './index.less';
import SchemeList from '@/components/SchemeList';
import { getCollectList } from '@/services/expert';
import React, { useState, useEffect } from 'react';
import BasePagination from '@/components/BasePagination';
import { usePagination } from 'ahooks';
import { Spin } from 'antd';
const Follow = () => {
  // const list = [
  //   {
  //     scheme_id: 100,
  //     avatar: 'https://image.blocktwits.com/exchange/Binance.png',
  //     nickname: '专家昵称',
  //     expert_id: 1,
  //     hit_tag: '近 5 中 4',
  //     hit_rate: 80,
  //     continuous_tag: '',
  //     describe: '方案描述',
  //     home_name: '荷兰女足 U16',
  //     home_logo: 'https://cdn.sportnanoapi.com/football/team/c089d1d7cbac9f5b5973965bc83fa378.png',
  //     away_name: '瑞典女足 U16',
  //     away_logo: '',
  //     match_time: 1657198800,
  //     competition_name: '国际友谊',
  //     play: 1,
  //     published_at: 1656556930,
  //     gold_coin: 0,
  //     match_id: 3765145,
  //     state: 3,
  //   },
  // ];
  const getList = async ({ page, size }) => {
    const res = await getCollectList({
      page,
      size,
    });
    if (res.success) {
      return {
        list: res.data.list,
        total: res.data.total,
      };
    }
  };

  const {
    data = {},
    loading,
    pagination,
    run,
    params,
  } = usePagination(
    ({ current, pageSize }, play) => {
      return getList({
        page: current,
        size: pageSize,
      });
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    run({
      current: 1,
      pageSize: params[0]?.pageSize || 20,
    });
  }, []);
  return (
    <Spin spinning={loading}>
      <div className={styles.follow}>
        <SchemeList
          list={data.list || []}
          schemeType="follow"
          showHitRate={false}
          showTags={false}
        />
        <BasePagination
          total={data?.total}
          current={pagination.current}
          size={pagination.pageSize}
          onChange={pagination.onChange}
          showSizeChanger={false}
          showQuickJumper
        />
      </div>
    </Spin>
  );
};

export default Follow;
