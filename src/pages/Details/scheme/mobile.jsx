import React, { useEffect, useState } from 'react';
import styles from './mobile.module.less';
import SchemeList from '@/components/SchemeList/mobile';
import RecommendExpert from '@/components/expert/recommend-expert/mobile';
import { getMatchSchemes } from '@/services/expert';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteScroll } from 'ahooks';

const Mobile = ({ matchId }) => {
  const getList = async (page, size) => {
    const res = await getMatchSchemes({
      match_id: matchId,
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
        page: page + 1,
      };
    }
  };

  const {
    data = {},
    loadMore,
    noMore,
    loading,
    reload,
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
  }, [matchId]);

  return (
    <div>
      <RecommendExpert matchId={matchId} />
      <InfiniteScroll
        dataLength={data?.list?.length || 0}
        next={loadMore}
        hasMore={!noMore}
        endMessage={null}
        loader={null}
      >
        <div className={styles.scheme_list_box}>
          <SchemeList
            showMatch={false}
            list={data?.list || []}
            loading={loading}
            eventTag="scheme_list"
          />
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Mobile;
