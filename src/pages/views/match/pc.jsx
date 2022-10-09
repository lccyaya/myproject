import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useIntl, history } from 'umi';
import styles from './pc.module.less';
import ScrollView from 'react-custom-scrollbars';
import { Content, League, MatchCard, TimeTitle, Calendar } from '@/func-components/pc';
import { Container, Search, Switch, IconButton, Empty, More, Spining } from '@/base-components/pc';
import { MatchListV3, getMatchesTabs } from '@/services/matchPage';
import { Spin, Row } from 'antd';
import moment from 'moment';
import { formatDate, getScrollDirection } from '@/utils/utils';
import { useLocalStorageState, useRequest, useSessionStorageState } from 'ahooks';
import { STORAGE_INDEX_VALUE, SESS_STORAGE_SELECTED_LEAGUES, getSessionStorage } from '@/constants';
import { useUpdateMatch } from '@/hooks/update-match';
import { handleReport } from '@/utils/report';
import { getCalendarTitle, handlerData, initParams, initPageData } from './tools'; // 比赛页面的公用方法

const Match = () => {
  const [indexVal, setIndexVal] = useLocalStorageState(STORAGE_INDEX_VALUE, { defaultValue: false });
  const [competition_ids] = useSessionStorageState(SESS_STORAGE_SELECTED_LEAGUES, { defaultValue: '' });
  const [menuActive, setMenuActive] = useState({});
  const [apiTimestamp, setApiTimestamp] = useState('');
  const [leagueShow, setLeagueShow] = useState(false); // league 是否显示

  const [calendarValue, setCalendarValue] = useState(moment()); // 日历的value
  const [calenderShow, setCalenderShow] = useState(false); // 日历是否显示
  const [currentHeight, setCurrentHeight] = useState(null);
  const [ignoreScroll, setIgnoreScroll] = useState(false); // 临时禁止滚动

  // 获取列表的参数 和 page 的参数
  const [params, setParams] = useState({ ...initParams, competition_ids });
  const [pageInfo, setPageInfo] = useState({ ...initPageData });

  const [searchVal, setSearchVal] = useState('');
  const [menuList, setMenuList] = useState(null);
  const intl = useIntl();
  const scrollRef = useRef();

  // 调用接口的数据改变
  const onParamsChange = (obj = {}) => {
    const query = { ...params, page: 1, ...obj };
    if (!query.competition_id) {
      delete query.competition_id;
    }
    if (!query.tab_type) {
      delete query.tab_type;
    }
    setParams(query);
  };

  // 选择菜单
  const onMenusChange = (item) => {
    if (item.param_value === menuActive.param_value) {
      return;
    }
    setApiTimestamp('');
    setMenuActive(item);
    onParamsChange({
      param_key: item.param_key,
      param_value: item.param_value,
      timestamp: 0,
    });
    setCalendarValue(moment()); // 日历的数据每次切换 tab 需要初始化
    window.history.pushState(window.location.pathname, {}, `?type=${item.param_value}&key=${item.param_key}`); //前两个参数可以为空

    // 埋点
    if(item.param_value === 2) {
      handleReport({ action: 'schedule_tab' });
    } else if(item.param_value === 3) {
      handleReport({ action: 'finished_tab' });
    } else if(item.param_value === 4) {
      handleReport({ action: 'subscribe_tab' });
    } else {
      handleReport({ action: item.param_value + '_tab' });
    }
  };

  // 日历变化
  const calendarChange = (v) => {
    const date = v.format('YYYY-MM-DD');
    setApiTimestamp('');
    onParamsChange({ timestamp: moment(date) / 1000 });
    setCalenderShow(false);
  };

  // 联赛确认点击
  const onLeagueSubmit = (e) => {
    onParamsChange({ competition_ids: e });
  };

  // 获取联赛的tab列表
  const getTabList = async () => {
    const { data = [] } = await getMatchesTabs();
    const query = history.location.query;
    let active = null;
    data.map((item, key) => {
      item.key = key;
      item.label = item.name;
      if (item.param_key === query.key && item.param_value === +query.type) {
        active = item;
      }
    });
    active = active === null ? data[0] : active;
    setMenuList(data);
    onParamsChange({
      param_key: active.param_key,
      param_value: active.param_value,
    });
    setMenuActive(active);
  };

  // 获取联赛列表
  const getRequestMatchListV3 = (params) => {
    return MatchListV3(params).then(({ success, code, data: newData, message }) => {
      if (success) {
        newData.matches = newData.matches || [];
        newData.matches.map((item) => {
          item.time = formatDate(item.match_time);
        });
        const matches = data?.matches || [];
        const pageExtra = {};
        if (params.page !== 1) {
          if (pageInfo.isLoading === 'pre') {
            // 翻动上一页时
            if (newData.matches.length < params.size) {
              pageExtra.has_pre = false;
            }
            newData.matches = [...newData.matches.reverse(), ...matches];
          } else {
            // 翻动下一页时
            if (newData.matches.length < params.size) {
              pageExtra.has_next = false;
            }
            newData.matches = [...matches, ...newData.matches];
          }
        } else {
          setApiTimestamp(newData.timestamp)
        }
        setPageInfo({ ...pageInfo, isLoading: '', ...pageExtra });
        return newData;
      } else {
        const matches = data?.matches || [];
        return { matches };
      }
    });
  };

  // hooks的获取联赛的请求方法
  const {
    data,
    mutate,
    loading,
    run: getMatchList,
  } = useRequest(getRequestMatchListV3, {
    initialData: {},
    manual: true,
  });

  // 实时兼听列表的变化
  useUpdateMatch(data?.matches || [], (oldList, list) => {
    const newList = oldList.map((old) => {
      let newObj = list?.find((item) => item.match_id === old.match_id);
      return newObj ? Object.assign(old, newObj) : old;
    });
    mutate({ matches: newList });
  });

  // 点击加载更多
  const getPreMore = () => {
    const { prePage, has_pre } = pageInfo;
    const current = scrollRef.current;
    setCurrentHeight(current?.getValues()?.scrollHeight);
    setPageInfo({ ...pageInfo, prePage: prePage - 1, isLoading: 'pre' });
    onParamsChange({ page: prePage - 1});
  }

  // 滚动临时禁止 防止滚动条频繁刷新
  const disableScroll = (val) => {
    if (val) {
      scrollRef?.current?.scrollTop(val);
    }
    setIgnoreScroll(true);
    setTimeout(() => {
      setIgnoreScroll(false);
    }, 200);
  }

  // 滚动监听
  const handleUpdate = () => {
    if (loading || ignoreScroll || !scrollRef.current) return;
    const current = scrollRef.current;
    const status = getScrollDirection(current?.getValues());
    getCalendarTitle(current, setCalendarValue, renderData); // 获取当前的日历日期

    const { page, prePage, has_pre, has_next } = pageInfo;
    // 下拉加载之前的数据 two_way 获取是否支持
    if (status === 'top' && menuActive.two_way && has_pre) {
      setCurrentHeight(current.getValues().scrollHeight);
      setPageInfo({ ...pageInfo, prePage: prePage - 1, page, isLoading: 'pre' });
      onParamsChange({ page: prePage - 1 });
      disableScroll();
    }

    // 上滑到底加载之后的数据
    if (status === 'bottom' && has_next) {
      setPageInfo({ ...pageInfo, page: page + 1, prePage, isLoading: 'next' });
      onParamsChange({ page: page + 1 });
      disableScroll();
    }
  };

  // 获取渲染的数据
  const [renderList, renderData] = handlerData(data);

  // loading
  const spinning = useMemo(() => {
    if (menuList === null) {
      return true;
    }
    if (params.page !== 1) {
      return false;
    }
    setPageInfo({ ...initPageData }); // 重置page的默认数据
    return loading;
  }, [loading, menuList, params]);

  // 兼听滚动条的处理的逻辑
  useEffect(() => {
    const current = scrollRef.current;
    // 下拉加载以后，要返回到之前的位置
    if (currentHeight && !loading) {
      const current = scrollRef.current;
      if (!current) return;
      const val = current.getValues().scrollHeight - currentHeight;
      if (current.getValues().scrollHeight - currentHeight > 100) {
        disableScroll(val);
        setCurrentHeight(null);
      }
    }

    // 当前tab支持下拉加载时，scrollTop 为 0 的时候，需要置为1 否则上滑无效
    if (menuActive.two_way && current?.getValues().scrollTop === 0) {
      disableScroll(1);
    }
  }, [currentHeight, loading])

  // 初始化
  useEffect(() => {
    if (menuList === null) {
      getTabList();
    } else {
      const data = {
        zone: params.zone,
        timestamp: apiTimestamp || params.timestamp,
        keywords: params.keywords,
        page: params.page,
        size: params.size,
        // competition_ids
      };
      data[params.param_key] = params.param_value;
      if (params.competition_ids && params.param_key !== 'competition_id') {
        data.competition_ids = params.competition_ids;
      }
      getMatchList(data);
    }
  }, [params]);

  return (
    <Container>
      <Spin spinning={spinning}>
        <Content menus={menuList || []} onChange={onMenusChange} activeKey={menuActive.param_value}>
          {/* 操作栏 */}
          <div className={styles.tools}>
            <Search
              width={456}
              value={searchVal}
              onChange={setSearchVal}
              onFocus={() => handleReport({ action: 'search_team' })}
              onEnter={(e) => onParamsChange({ keywords: e })}
            />
            <div className={styles.aside}>
              <Switch
                title={intl.formatMessage({ id: 'key_index' })}
                value={indexVal}
                onChange={e => {
                  handleReport({ action: e ? 'open_index' : 'close_index' });
                  setIndexVal(e);
                }}
              />
              <IconButton
                onClick={() => {
                  setLeagueShow(true);
                  handleReport({ action: 'league_filter' });
                }}
                active={params?.competition_ids.length}
                icon="icon-bisai"
                show={menuActive.has_competition}
                title={intl.formatMessage({ id: 'key_league', defaultMessage: 'key_league' })}
              />
              <IconButton
                show={menuActive.has_calendar}
                onClick={() => {
                  setCalenderShow(true)
                  handleReport({ action: 'calendar' });
                }}
                icon="icon-rili"
                title={intl.formatMessage({
                  id: 'key_calendar',
                  defaultMessage: 'key_calendar',
                })}
              >
                <Calendar
                  value={calendarValue} setValue={setCalendarValue}
                  params={params}
                  show={calenderShow}
                  onClose={() => setCalenderShow(false)}
                  onChange={calendarChange}
                  className={styles.calender}
                />
              </IconButton>
            </div>
          </div>

          <div className={styles.list}>
            {/* 列表渲染加上滚动监听 */}
            {renderList.length && !spinning ? (
              <ScrollView className={styles.scroll_view} onScroll={handleUpdate} ref={scrollRef}>
                <Spining className={styles.pre_loading} show={pageInfo.isLoading === 'pre'} />
                <More
                  show={pageInfo.isLoading !== 'pre' && pageInfo.has_pre && menuActive.two_way}
                  className={styles.more} onClick={getPreMore}
                />
                {renderList.map((dataKey, key) => (
                  <>
                    <TimeTitle title={dataKey} sticky key={key} className="time_title"/>
                    <div className={styles.match_card_wrap} key={key}>
                      {renderData[dataKey].map((item) => (
                        <MatchCard
                          data={item}
                          key={`${item.match_id}_${key}`}
                          type={indexVal ? 'index' : 'score'}
                          className={styles.match_card}
                        />
                      ))}
                    </div>
                  </>
                ))}
                <Spining show={pageInfo.isLoading === 'next'} />
              </ScrollView>
            ) : null}

            {/* 无数据 */}
            {!renderList.length && !spinning ? <Empty /> : null}
          </div>
        </Content>
      </Spin>

      {/* 联赛选择 */}
      <League visible={leagueShow} onSubmit={onLeagueSubmit} onClose={() => setLeagueShow(false)} />
    </Container>
  );
};

export default Match;
