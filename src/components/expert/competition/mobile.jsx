import styles from './mobile.module.less';
import { Table } from 'antd';
import { getExpertSkilledCompetition } from '@/services/expert';
import React, { useEffect } from 'react';
import Empty from '@/components/Empty';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteScroll } from 'ahooks';
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

  const getList = async (page, size) => {
    const res = await getExpertSkilledCompetition({
      page,
      size,
      id: expertId,
    });
    if (res.success) {
      return {
        list: res.data.list,
        total: res.data.total,
        page: page + 1,
      };
    }
  };

  const {
    data = {},
    loadMore,
    noMore,
    reload,
    loading,
  } = useInfiniteScroll(
    (d) => {
      const { page = 1 } = d || {};
      return getList(page, 10);
    },
    {
      isNoMore: (data) => {
        if (!data?.list?.length) {
          return true;
        }
        return data?.list?.length >= data?.total;
      },
      manual: true,
    },
  );
  useEffect(() => {
    reload();
  }, [expertId]);

  return (
    <div className={styles.table_wrap}>
      <Spin spinning={loading}>
        <InfiniteScroll
          dataLength={data?.list?.length || 0}
          next={loadMore}
          hasMore={!noMore}
          endMessage={null}
          loader={null}
        >
          <Table
            columns={columns}
            dataSource={data?.list || []}
            pagination={false}
            locale={{
              emptyText: <Empty />,
            }}
          />
        </InfiniteScroll>
      </Spin>
    </div>
  );
}
