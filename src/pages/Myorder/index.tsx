import { useInfiniteScroll } from 'ahooks';
import { Spin } from 'antd';
import React from 'react';
import SchemeList from '@/components/SchemeList/mobile';
import { getUserOrder } from '@/services/expert';
import Empty from '@/components/Empty';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './index.less';
import { Data } from 'ahooks/lib/useInfiniteScroll/types';
import { NavBar } from 'antd-mobile';
import { useHistory } from 'umi';

interface IPageData extends Data {
  page: number;
  size: number;
}
type Props = {};

const MyOrders: React.FC<Props> = (props) => {
  const history = useHistory();

  const getList = async (page: number, size: number) => {
    const res = await getUserOrder({
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
    loadMore,
    noMore,
    reload,
    loading,
  } = useInfiniteScroll<IPageData>(
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

  const back = () => {
    history.goBack();
  };

  return (
    <Spin spinning={loading}>
      <NavBar className={styles.navbar} onBack={back}>已购攻略</NavBar>
      <div className={styles.content}>
        {!loading ? (
          <>
            {data?.list?.length ? (
              <SchemeList
                list={data.list}
                schemeType="order"
                showHitRate={false}
                showTags={false}
              />
            ) : (
              <Empty />
            )}
          </>
        ) : null}
      </div>
    </Spin>
  );
};

export default MyOrders;
