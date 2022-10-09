import IconFont from '@/components/IconFont';
import { Button, message, Spin } from 'antd';
import { Divider, Grid, NavBar } from 'antd-mobile';
import React, { useEffect, useState } from 'react';
import { useHistory, useSelector } from 'umi';
import CenterHeader from './Center/CenterHeader';
import styles from './index.less';
import InfiniteScroll from 'react-infinite-scroll-component';
import { mySchemeList } from '@/services/scheme';
import { ConnectState } from '@/models/connect';
import { UserInfoType } from '@/services/user';
import { useInfiniteScroll } from 'ahooks';
import { SCHEME_STATE } from '@/constants/index';
import dayjs from 'dayjs';
import { expertDetail } from '@/services/expert';
import lodash from 'lodash';
import { ExpertStatus } from '@/utils/scheme';

type Props = {};

// 0 待上线、1 在售、2 停售、3 命中、4 未中
const SCHEME_STATE_COLOR = ((ENUM: any) => {
  ENUM[(ENUM.WAIT = 0)] = '#FDBD99';
  ENUM[(ENUM.SALE = 1)] = '#FA5900';
  ENUM[(ENUM.STOP_SALE = 2)] = '#848494';
  ENUM[(ENUM.HIT = 3)] = '#FA5900';
  ENUM[(ENUM.MISS = 4)] = '#FA5900';
  ENUM[(ENUM.VERIFYING = 5)] = '#5985FF';
  ENUM[(ENUM.INVALID = 6)] = '#848494';
  return ENUM;
})({});

const SchemeCenter: React.FC<Props> = (props) => {
  const history = useHistory();
  const user = useSelector<ConnectState, UserInfoType | null | undefined>(
    (s) => s.user.currentUser,
  );
  const [detail, setDetail] = useState<any>(undefined);
  const [detailLoading, setDetailLoading] = useState(false);

  const back = () => {
    history.goBack();
  };

  const getExpertDetail = async (expertId?: string) => {
    setDetailLoading(true);
    const resp = await expertDetail({
      id: expertId,
    });
    setDetailLoading(false);
    if (resp.success) {
      setDetail(resp.data);
    }
  };

  useEffect(() => {
    getExpertDetail(user?.expert.id);
  }, [user]);

  const getList = async (page: number, size: number) => {
    const params = {
      page: page,
      size: size,
      expert_id: user?.expert?.id,
    };
    const res = await mySchemeList(params);
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
      const page = d?.page ?? 1;
      return getList(page, 10);
    },
    {
      isNoMore: (data) => {
        if (!data?.list?.length) {
          return true;
        }
        return data?.list?.length >= data?.total;
      },
      // manual: true,
    },
  );

  const toCreate = () => {
    if (user?.expert?.status != ExpertStatus.Accept) {
      message.error('您还未通过专家审核，暂不能创建攻略');
      return;
    }
    history.push('/zh/profile/center/create');
  };

  const toDetail = (record: any) => {
    history.push('/zh/profile/center/create/detail', record);
  };

  return (
    <div className={styles.container}>
      <NavBar className={styles.navbar} onBack={back}>
        创作中心
      </NavBar>
      <Spin spinning={loading || detailLoading}>
        <InfiniteScroll
          dataLength={data?.list?.length || 0}
          next={loadMore}
          hasMore={!noMore}
          endMessage={null}
          loader={null}
        >
          <div className={styles.content_box}>
            <CenterHeader />
            <div className={styles.record_box}>
              <div className={styles.record_title}>战绩统计</div>
              <div className={styles.record_data_box}>
                <div className={styles.record_data_item}>
                  <span className={styles.record_data_title}>{detail?.expert?.scheme_num}</span>
                  <span className={styles.record_data_des}>已发布</span>
                </div>
                <div className={styles.record_data_item}>
                  <span className={styles.record_data_title}>{detail?.record?.hit_rate}%</span>
                  <span className={styles.record_data_des}>总命中率</span>
                </div>
              </div>
            </div>
            <div className={styles.scheme_list_box}>
              <div className={styles.box_header}>
                <span className={styles.header_title}>攻略列表</span>
                <Button className={styles.button} onClick={toCreate}>
                  <IconFont type="icon-chuangjian" color="#FA5900" size={12} />
                  <span className={styles.button_title}>创建</span>
                </Button>
              </div>
              <div className={styles.table_header_box}>
                <Grid columns={7} gap={0}>
                  <Grid.Item className={styles.flex_center}>
                    <div className={styles.header_title}>攻略ID</div>
                  </Grid.Item>
                  <Grid.Item className={styles.flex_center}>
                    <div className={styles.header_title}>
                      彩种
                      <br />及<br />
                      玩法
                    </div>
                  </Grid.Item>
                  <Grid.Item className={styles.flex_center}>
                    <div className={styles.header_title}>对阵</div>
                  </Grid.Item>
                  <Grid.Item className={styles.flex_center}>
                    <div className={styles.header_title}>推荐项</div>
                  </Grid.Item>
                  <Grid.Item className={styles.flex_center}>
                    <div className={styles.header_title}>攻略状态</div>
                  </Grid.Item>
                  <Grid.Item className={styles.flex_center}>
                    <div className={styles.header_title}>已售查看</div>
                  </Grid.Item>
                  <Grid.Item className={styles.flex_center}>
                    <div className={styles.header_title}>操作</div>
                  </Grid.Item>
                </Grid>
              </div>
              {!loading ? (
                <>
                  {data?.list?.map((item: any, index: number) => {
                    const selectedOdds = item.play_odds?.odds?.find((odds: any) => odds?.selected);
                    return (
                      <div className={styles.scheme_data_box} key={index}>
                        <Grid columns={7} gap={0}>
                          <Grid.Item className={styles.flex_center}>
                            <div className={styles.info_text}>{item.id}</div>
                          </Grid.Item>
                          <Grid.Item className={styles.flex_center}>
                            <div className={styles.info_text}>
                              {item.play_odds.scheme_title}
                              <br />
                              {dayjs(item.match_time * 1000).format('MM-DD')}
                              <br />
                              {dayjs(item.match_time * 1000).format('HH:mm')}
                            </div>
                          </Grid.Item>
                          <Grid.Item className={styles.flex_center}>
                            <div className={styles.info_text}>
                              {item.competition_name}
                              <br />
                              {item.home_team_name}
                              <br />
                              VS
                              <br />
                              {item.away_team_name}
                            </div>
                          </Grid.Item>
                          <Grid.Item className={styles.flex_center}>
                            <div className={styles.info_text}>
                              {selectedOdds.title}
                              <br />
                              {selectedOdds.odd}
                            </div>
                          </Grid.Item>
                          <Grid.Item className={styles.flex_center}>
                            <div
                              className={styles.info_text}
                              style={{ color: SCHEME_STATE_COLOR[item.state] }}
                            >
                              {SCHEME_STATE[item.state]}
                            </div>
                          </Grid.Item>
                          <Grid.Item className={styles.flex_center}>
                            <div className={styles.info_text}>
                              {item.doc_num + '/' + item.visit_num}
                            </div>
                          </Grid.Item>
                          <Grid.Item className={styles.flex_center} onClick={() => toDetail(item)}>
                            <div className={styles.info_text}>
                              <IconFont type="icon-chakan" color="#45494C" size={12} />
                            </div>
                          </Grid.Item>
                        </Grid>
                        <Divider style={{ margin: '10px 10px 0px 10px' }} />
                      </div>
                    );
                  })}
                </>
              ) : null}
            </div>
          </div>
        </InfiniteScroll>
      </Spin>
    </div>
  );
};

export default SchemeCenter;
