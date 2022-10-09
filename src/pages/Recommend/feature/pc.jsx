import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import moment from 'moment';
import Empty from '@/components/Empty';
import { recommendMatches } from '@/services/expert';
import MatchList from './list/pc';
import { usePagination } from 'ahooks';
import BasePagination from '@/components/BasePagination';

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
  const getList = async ({ page, size, id }) => {
    const res = await recommendMatches({
      page,
      size,
      competition_ids: id ? [+id] : [],
    });
    if (res.success) {
      return {
        list: formatMatchData(res.data.list || []),
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
        pageSize: params[0]?.pageSize || 40,
      },
      competitionId,
    );
  }, [competitionId]);

  return (
    <Spin spinning={loading}>
      <div>{data?.list?.length > 0 ? <MatchList data={data?.list || []} /> : <Empty />}</div>
      <BasePagination
        total={pagination.total}
        current={pagination.current}
        size={pagination.pageSize}
        onChange={pagination.onChange}
      />
    </Spin>
  );
};

export default Stats;
