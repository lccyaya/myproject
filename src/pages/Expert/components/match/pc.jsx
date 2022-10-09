import SchemeList from '@/components/SchemeList';
import { getSchemeList } from '@/services/expert';
import React, { useState, useEffect } from 'react';
import BasePagination from '@/components/BasePagination';
import { usePagination } from 'ahooks';
import styles from './pc.module.less';
import { Spin } from 'antd';
export default function Hot({ play }) {
  const getList = async ({ page, size, play }) => {
    const res = await getSchemeList({
      page,
      size,
      play,
      tab: 1,
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
        play,
      });
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    run(
      {
        current: 1,
        pageSize: params[0]?.pageSize || 40,
      },
      play,
    );
  }, [play]);
  return (
    <Spin spinning={loading}>
      <SchemeList list={data.list || []} type="card" eventTag="scheme_list" />
      <BasePagination
        total={pagination.total}
        current={pagination.current}
        size={pagination.pageSize}
        onChange={pagination.onChange}
      />
    </Spin>
  );
}
