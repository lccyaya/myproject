import IconFont from '@/components/IconFont';
import { ConnectState } from '@/models/connect';
import { UserInfoType } from '@/services/user';
import { Button, Divider, Grid, InfiniteScroll, NavBar, ActionSheet } from 'antd-mobile';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useSelector } from 'umi';
import styles from './index.less';
import classnames from 'classnames';
import ScrollView from 'react-custom-scrollbars';
import { useInfiniteScroll } from 'ahooks';
import { getOddsList } from '@/services/scheme';
import { message, Spin } from 'antd';
import dayjs from 'dayjs';
import { handlerList } from './tools';

import { TimeTitle } from '@/func-components/mobile';
import MatchCell from './MatchCell';
import { OddInfo } from '@/pages/ProfileCenter/create/createPc';
import { Action } from 'antd-mobile/es/components/action-sheet';

type Props = {};

const SchemeCreate: React.FC<Props> = (props) => {
  const history = useHistory();
  const user = useSelector<ConnectState, UserInfoType | null | undefined>(
    (s) => s.user.currentUser,
  );
  const back = () => {
    history.goBack();
  };
  const [visible, setVisible] = useState(false);
  const [lotteryType, setLotteryType] = useState(1);
  const [fee, setFee] = useState<number | undefined>(undefined);
  const [selectOdds, setSelectOdds] = useState<OddInfo | undefined>(undefined);

  const actions: Action[] = [
    { text: '免费', key: 0 },
    { text: '8金豆', key: 8 },
    { text: '18金豆', key: 18 },
    { text: '28金豆', key: 28 },
    { text: '38金豆', key: 38 },
    { text: '58金豆', key: 58 },
    { text: '88金豆', key: 88 },
    { text: '128金豆', key: 128 },
  ];

  const getList = async (page: number, size: number, lotteryType: number) => {
    const params = {
      page: page,
      size: size,
      type_id: lotteryType,
    };
    const res = await getOddsList(params);
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
    loadingMore,
  } = useInfiniteScroll(
    async (d) => {
      const page = d?.page ?? 1;
      return await getList(page, 50, lotteryType);
    },
    {
      isNoMore: (data) => {
        const total = data?.list.reduce((pre, item) => {
          return pre + item?.odds?.length ?? 0;
        }, 0);
        if (!data?.list?.length) {
          return true;
        }
        return total >= data?.total;
      },
      manual: true,
    },
  );

  useEffect(() => {
    reload();
  }, [lotteryType]);

  const newList = useMemo(() => {
    const list = data?.list as Array<any>;
    list?.map((item: any) => {
      item.time = dayjs(item.match.match_time * 1000).format('YY-MM-DD ddd');
    });
    const newList = handlerList(list?.sort((a, b) => b.match.match_time - a.match.match_time));
    // const newList = handlerList(list);
    return newList;
  }, [data]);

  const feeTitle = useMemo(() => {
    if (fee == undefined) {
      return '';
    }
    return fee == 0 ? '免费' : `${fee}金豆`;
  }, [fee]);

  const onSelectOdds = (info: OddInfo) => {
    setSelectOdds(info);
  };

  const onSelectLotteryType = (lotteryType: number) => {
    setLotteryType(lotteryType);
    setSelectOdds(undefined);
  };

  const onSubmit = () => {
    if (selectOdds === undefined) {
      message.warning('请选择一场比赛');
      return;
    }
    if (fee === undefined) {
      message.warning('请选择攻略价格');
      return;
    }
    history.replace('/zh/profile/center/create/step2', {
      ...selectOdds,
      type_id: lotteryType,
      gold_coin: fee,
    });
  };

  return (
    <div className={styles.container}>
      <NavBar className={styles.navbar} onBack={back}>
        发布攻略
      </NavBar>
      <Spin spinning={loading}>
        <div className={styles.header}>
          <div className={styles.header_title}>请选择玩法类型</div>
          <div>
            <Grid columns={2} gap={10}>
              <Grid.Item>
                <div
                  className={classnames(
                    styles.lottery_box,
                    lotteryType == 1 ? styles.selected : '',
                  )}
                  onClick={() => onSelectLotteryType(1)}
                >
                  <IconFont
                    type={lotteryType == 1 ? 'icon-wancheng' : 'icon-weiwancheng'}
                    color={lotteryType == 1 ? '#FA5900' : '#848494'}
                    size={11}
                  />
                  <span className={styles.lottery_title}>竞彩</span>
                </div>
              </Grid.Item>
              <Grid.Item>
                <div
                  className={classnames(
                    styles.lottery_box,
                    lotteryType == 2 ? styles.selected : '',
                  )}
                  onClick={() => onSelectLotteryType(2)}
                >
                  <IconFont
                    type={lotteryType == 2 ? 'icon-wancheng' : 'icon-weiwancheng'}
                    color={lotteryType == 2 ? '#FA5900' : '#848494'}
                    size={11}
                  />
                  <span className={styles.lottery_title}>北单-胜负过关</span>
                </div>
              </Grid.Item>
              {/* <Grid.Item>
                <div
                  className={classnames(
                    styles.lottery_box,
                    lotteryType == 3 ? styles.selected : '',
                  )}
                  onClick={() => setLotteryType(3)}
                >
                  <IconFont
                    type={lotteryType == 3 ? 'icon-wancheng' : 'icon-weiwancheng'}
                    color={lotteryType == 3 ? '#FA5900' : '#848494'}
                    size={11}
                  />
                  <span className={styles.lottery_title}>北单-胜平负</span>
                </div>
              </Grid.Item> */}
            </Grid>
          </div>
        </div>
        <div className={styles.scroll_container}>
          <ScrollView>
            {newList?.map((item: any, index: number) => (
              <div key={item.time}>
                <div className={styles.time_box}>
                  {`${item.time} ${item.list.length}场比赛`}
                </div>
                {item.list?.map((match: any, matchindex: number) => (
                  <div key={match.match.match_id} className={styles.match_cell}>
                    <MatchCell
                      match={match}
                      typeId={lotteryType}
                      onSelected={onSelectOdds}
                      selectOdds={selectOdds}
                    />
                  </div>
                ))}
              </div>
            ))}
            <InfiniteScroll
              loadMore={async (isRetry: boolean) => {
                await loadMoreAsync();
              }}
              hasMore={!noMore}
            />
          </ScrollView>
        </div>
        <div className={styles.footer}>
          <div className={styles.play_info}>
            <div className={styles.info_text}>场次选择：{selectOdds ? 1 : 0}</div>
            <div className={styles.info_text}>过关玩法：单关</div>
            <div className={styles.info_text}>注数：{selectOdds ? 1 : 0}</div>
          </div>
          <Divider style={{ margin: '12px 0px' }} />
          <div className={styles.button_box}>
            <div className={styles.fee_box}>
              <Button className={styles.fee_button} onClick={() => setVisible(true)}>
                <span className={styles.fee_title}>选择查看攻略价格</span>
                <IconFont type="icon-zhankai2" color="#45494C" size={10} />
              </Button>
              <div className={styles.fee}>{feeTitle}</div>
            </div>
            <Button className={styles.next_button} onClick={onSubmit}>
              <div className={styles.next_title}>下一步</div>
            </Button>
          </div>
        </div>
      </Spin>
      <ActionSheet
        extra="选择查看攻略价格"
        cancelText="取消"
        visible={visible}
        actions={actions}
        onClose={() => setVisible(false)}
        onAction={(action) => {
          console.log(action);
          setFee(action.key as number);
          setVisible(false);
        }}
      />
    </div>
  );
};

export default SchemeCreate;
