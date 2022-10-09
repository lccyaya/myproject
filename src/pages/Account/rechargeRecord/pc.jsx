import TradeRecord from '@/components/TradeRecord/pc';
import React, { useState, useEffect } from 'react';
import { getUserTradeRecord } from '@/services/expert';
import BasePagination from '@/components/BasePagination';
import { usePagination } from 'ahooks';
import { Spin } from 'antd';
export default function RechargeRecord() {
  const getList = async ({ page, size }) => {
    const res = await getUserTradeRecord({
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
      pageSize: params[0]?.pageSize || 20,
    });
  }, []);
  return (
    <Spin spinning={loading}>
      <TradeRecord list={data.list} />
      <BasePagination
        total={data?.total}
        current={pagination.current}
        size={pagination.pageSize}
        onChange={pagination.onChange}
        showSizeChanger={false}
        showQuickJumper
      />
    </Spin>
  );
}
