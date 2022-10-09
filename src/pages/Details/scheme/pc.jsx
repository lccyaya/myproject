import React, { useEffect, useState } from 'react';
import styles from './pc.module.less';
import SchemeList from '@/components/SchemeList/index';
import RecommendExpert from '@/components/expert/recommend-expert/pc';
import { getMatchSchemes } from '@/services/expert';
import { usePagination } from 'ahooks';
import { Pagination } from 'antd';

const PC = ({ matchId }) => {
  const getList = async ({ page, size, match_id }) => {
    const res = await getMatchSchemes({
      match_id: match_id,
      page,
      size,
    });
    if (res.success) {
      return {
        list: res.data.list.map((item) => {
          return {
            ...item,
            nickname: item.expert.nickname,
            avatar: item.expert.avatar,
            expect_id: item.expert.id,
            hit_rate: item.expert.hit_rate,
            hit_tag: item.expert.hit_tag,
            continuous_tag: item.expert.continuous_tag,
          };
        }),
        total: res.data.total,
      };
    }
  };
  const { data, loading, pagination } = usePagination(({ current, pageSize }) => {
    return getList(
      {
        page: current,
        size: pageSize,
        match_id: matchId,
      },
      {
        refreshDeps: [matchId],
      },
    );
  });

  return (
    <div>
      <RecommendExpert matchId={matchId} />

      <div className={styles.scheme_list_box}>
        <SchemeList
          showMatch={false}
          list={data?.list || []}
          loading={loading}
          eventTag="scheme_list"
        />
        <div className={styles.pagination}>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            onChange={pagination.onChange}
            onShowSizeChange={pagination.onChange}
            showQuickJumper
            total={data?.total}
            showSizeChanger={false}
            hideOnSinglePage
          />
        </div>
      </div>
    </div>
  );
};

export default PC;
