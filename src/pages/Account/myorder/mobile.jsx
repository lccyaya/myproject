import SchemeList from '@/components/SchemeList/mobile';
import { getUserOrder } from '@/services/expert';
import Empty from '@/components/Empty';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteScroll } from 'ahooks';
import { Spin } from 'antd';
import styles from './mobile.module.less';

const MyOrder = () => {
  // const list = [
  //   {
  //     scheme_id: 100,
  //     avatar: 'https://image.blocktwits.com/exchange/Binance.png',
  //     nickname: '专家昵称',
  //     expert_id: 1,
  //     hit_tag: '近 5 中 4',
  //     hit_rate: 80,
  //     continuous_tag: '',
  //     describe: '方案描述',
  //     home_name: '荷兰女足 U16',
  //     home_logo: 'https://cdn.sportnanoapi.com/football/team/c089d1d7cbac9f5b5973965bc83fa378.png',
  //     away_name: '瑞典女足 U16',
  //     away_logo: '',
  //     match_time: 1657198800,
  //     competition_name: '国际友谊',
  //     play: 1,
  //     published_at: 1656556930,
  //     buy_time: 1656556930,
  //     gold_coin: 0,
  //     match_id: 3765145,
  //     state: 1,
  //     is_refund: true,
  //   },
  // ];
  const getList = async (page, size) => {
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

export default MyOrder;
