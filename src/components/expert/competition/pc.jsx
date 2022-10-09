import styles from './pc.module.less';
import { Table } from 'antd';
import { getExpertSkilledCompetition } from '@/services/expert';
import React, { useState, useEffect } from 'react';
import Empty from '@/components/Empty';
import { usePagination } from 'ahooks';
import BasePagination from '@/components/BasePagination';
import { Spin } from 'antd';
import EmptyLogo from '@/assets/emptyLogo.png';

export default function Competition({ expertId }) {
  const columns = [
    {
      title: '联赛',
      dataIndex: 'competition_name',
      render: (val, record) => {
        const { competition_logo, competition_name } = record;
        return (
          <div className={styles.competition_name}>
            <img
              src={competition_logo || EmptyLogo}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = EmptyLogo;
              }}
            />
            <span>{competition_name}</span>
          </div>
        );
      },
    },
    {
      title: '战绩（总/中）',
      dataIndex: 'schemes',
      render: (val, record) => {
        const { hit, schemes } = record;
        return `${schemes}/${hit}`;
      },
      align: 'center',
    },
    {
      title: '命中率',
      dataIndex: 'hit_rate',
      align: 'center',
    },
  ];

  const getList = async ({ page, size, id }) => {
    const res = await getExpertSkilledCompetition({
      id,
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
    ({ current, pageSize }, id) => {
      return getList({
        page: current,
        size: pageSize,
        id,
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
        pageSize: params[0]?.pageSize || 10,
      },
      expertId,
    );
  }, [expertId]);

  return (
    <div className={styles.table_wrap}>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={data?.list || []}
          pagination={false}
          locale={{
            emptyText: <Empty />,
          }}
        />
      </Spin>
      <div className={styles.pagination}>
        <BasePagination
          total={data?.total}
          current={pagination.current}
          size={pagination.pageSize}
          onChange={pagination.onChange}
          showSizeChanger={false}
          showQuickJumper
        />
      </div>
    </div>
  );
}
