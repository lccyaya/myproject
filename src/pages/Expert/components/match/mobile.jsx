import SchemeList from '@/components/SchemeList/mobile';
import { getSchemeList } from '@/services/expert';
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteScroll } from 'ahooks';
import { Spin } from 'antd';
import styles from './mobile.module.less';

export default function Hot({ play }) {
  const getList = async (page, size) => {
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
  }, [play]);
  return (
    <Spin spinning={loading}>
      <InfiniteScroll
        dataLength={data?.list?.length || 0}
        next={loadMore}
        hasMore={!noMore}
        endMessage={null}
        loader={null}
      >
        <div className={styles.content}>
          {!loading ? (
            <SchemeList boundaryGap list={data?.list || []} eventTag="scheme_list" />
          ) : null}
        </div>
      </InfiniteScroll>
    </Spin>
  );
}
