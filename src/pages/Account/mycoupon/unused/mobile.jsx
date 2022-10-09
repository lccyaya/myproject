import { Spin } from 'antd';
import { getCouponList } from '@/services/expert';
import Empty from '@/components/Empty';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteScroll } from 'ahooks';
import Coupon from '@/components/Coupon/mobile';
import styles from './mobile.module.less';
export default function Unused() {
  const getList = async (page, size) => {
    const res = await getCouponList({
      page,
      size,
      tab: 0,
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
    },
  );

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
            <>{data?.list?.length ? <Coupon type="unused" list={data?.list || []} /> : <Empty />}</>
          ) : null}
        </div>
      </InfiniteScroll>
    </Spin>
  );
}
