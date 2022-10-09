import ExpertList from '@/components/ExpertList/mobile';
import React, { useState, useEffect } from 'react';
import { followedList } from '@/services/expert';
import { useInfiniteScroll } from 'ahooks';
import { InfiniteScroll } from 'antd-mobile';
import { Spin } from 'antd';
import styles from './mobile.module.less';
import HotExpertItem from '@/pages/Home/mobile/version-a/HotExpert/HotExpertItem';
import { getExpertRanking, getHotExpert } from '@/services/expert';
import { message } from 'antd';
import { Grid } from 'antd-mobile';

export default function Glz() {
  const [list, setList] = useState([]);

  const getHotList = async () => {
    const res = await getHotExpert({
      tab: 0,
      page: 1,
      size: 5,
    });
    if (res.err) {
      message.error(res.message);
    }
    if (res.success) {
      setList(res.data.list);
    }
  };

  useEffect(() => {
    getHotList();
  }, []);

  const getList = async (page, size) => {
    const res = await followedList({
      page,
      size,
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
  }, []);
  return (
    <Spin spinning={loading}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.left}>专家热门</div>
        </div>
        <div className={styles.body}>
          <Grid columns={5}>
            {list.map((listItem, index) => (
              <Grid.Item key={index}>
                <HotExpertItem expert={listItem} />
              </Grid.Item>
            ))}
          </Grid>
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.left}>我的关注</div>
        </div>
      </div>
      <div className={styles.experts_box}>
        <ExpertList list={data?.list || []} type="watch" />
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
