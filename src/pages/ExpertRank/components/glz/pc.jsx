import ExpertList from '@/components/ExpertList';
import React, { useState, useEffect } from 'react';
import { getExpertRanking } from '@/services/expert';
import BasePagination from '@/components/BasePagination';
import { usePagination } from 'ahooks';
import { Spin } from 'antd';
import styles from './pc.mobile.less';

export default function Glz() {
  const getList = async ({ page, size }) => {
    const res = await getExpertRanking({
      tab: 0,
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

  const { data, loading, pagination, run, params } = usePagination(
    ({ current, pageSize }) => {
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
      pageSize: params[0]?.pageSize || 21,
    });
  }, []);

  return (
    <div>
      <Spin spinning={loading}>
        <div className={styles.content}>
          <ExpertList list={data?.list || []} type="glz" />
        </div>
      </Spin>
      <BasePagination
        total={pagination.total}
        current={pagination.current}
        size={pagination.pageSize}
        onChange={pagination.onChange}
      />
    </div>
  );
}
