import SchemeList from '@/components/SchemeList/mobile';
import { getV5SchemeList, getFreeSchemeList } from '@/services/expert';
import React, { useState, useEffect } from 'react';
import { useInfiniteScroll } from 'ahooks';
import { InfiniteScroll } from 'antd-mobile';
import { Spin } from 'antd';
import styles from './mobile.module.less';
import SchemeItem from './SchemeItem';

export default function Hot({ info }) {
  const getList = async (page, size, play, tab) => {
    let reqFunction = getV5SchemeList;
    if (tab == 2) {
      reqFunction = getFreeSchemeList;
    }
    const res = await reqFunction({
      page,
      size,
      play,
      tab,
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
    loadMoreAsync,
    noMore,
    reload,
    loading,
  } = useInfiniteScroll(
    (d) => {
      const { page = 1 } = d || {};
      return getList(page, 10, info.play, info.tab);
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
  }, [info]);

  return (
    <Spin spinning={loading}>
        <div className={styles.content}>
          {data?.list?.map((item, index) => (
            <div className={styles.scheme_box} key={index}>
              <SchemeItem scheme={item} />
            </div>
          ))}
          <InfiniteScroll
              loadMore={async (isRetry) => {
                await loadMoreAsync();
              }}
              hasMore={!noMore}
            />
        </div>
    </Spin>
  );
}
