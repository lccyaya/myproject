import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import moment from 'moment';
import Empty from '@/components/Empty';
import { recommendMatches } from '@/services/expert';
import MobileMatchList from './list/mobile';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteScroll } from 'ahooks';
function formatMatchData(list) {
  const _list = [];
  list.forEach((i) => {
    const key = moment(new Date(i.match_time * 1000)).format('YYYY-MM-DD');
    if (_list.filter((_l) => _l.key === key).length > 0) {
      _list.forEach((_i) => {
        if (_i.key === key) {
          _i.data.push(i);
        }
      });
    } else {
      const _item = {
        key: moment(new Date(i.match_time * 1000)).format('YYYY-MM-DD'),
        month: moment(new Date(i.match_time * 1000)).format('MM'),
        day: moment(new Date(i.match_time * 1000)).format('DD'),
        data: [i],
      };
      _list.push(_item);
    }
  });
  return _list;
}

const Stats = ({ competitionId }) => {
  const getList = async (page, size) => {
    const res = await recommendMatches({
      page,
      size,
      competition_ids: competitionId ? [+competitionId] : [],
    });
    if (res.success) {
      return {
        list: formatMatchData(res.data?.list || []),
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
  }, [competitionId]);

  return (
    <Spin spinning={loading}>
      <InfiniteScroll
        dataLength={data?.list?.length || 0}
        next={loadMore}
        hasMore={!noMore}
        endMessage={null}
        loader={null}
      >
        {data.list?.length > 0 ? <MobileMatchList data={data.list || []} /> : <Empty />}
      </InfiniteScroll>
    </Spin>
  );
};

export default Stats;
