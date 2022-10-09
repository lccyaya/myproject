import React, { useEffect, useState, useMemo, createRef } from 'react';
import { useIntl } from 'umi';
import styles from './mobile.less';
import { Container, Empty, Search, Spining } from '@/base-components/mobile';
import { Menu, MatchCard, TimeTitle, Calendar, BottomIcon, League } from '@/func-components/mobile';
import { MatchListV3, getMatchesTabs } from '@/services/matchPage';
import moment from 'moment';
import { formatDate, getScrollDirection } from '@/utils/utils';
import IconFont from '@/components/IconFont';
import filterIcon from '@/assets/icon/filter.svg';
import ScrollView from 'react-custom-scrollbars';
import { Spin } from 'antd';
import FixedBtns from '@/components/FixedBtns/mobile';
import { useLocalStorageState, useRequest } from 'ahooks';
import { STORAGE_INDEX_VALUE, SESS_STORAGE_SELECTED_LEAGUES, getSessionStorage } from '@/constants';
import { useUpdateMatch } from '@/hooks/update-match';
import cls from 'classnames';
import { handleReport } from '@/utils/report';
import { getCalendarTitle, handlerData, initParams, initPageData } from './tools'; // 比赛页面的公用方法

const Mobile = () => {
  const intl = useIntl();
  const [menuActive, setMenuActive] = useState({});
  const [menuList, setMenuList] = useState(null);
  const scrollRef = createRef();
  const [showTopIcon, setShowTopIcon] = useState(false);
  const [indexVal, setIndexVal] = useLocalStorageState(STORAGE_INDEX_VALUE, false);
  const [indexData, setIndexData] = useState({ type: 'icon-tubiao_zhishu', color: '#999999' });
  const [apiTimestamp, setApiTimestamp] = useState('');
  const [currentHeight, setCurrentHeight] = useState(null); // 当前容器高度 上滑需要用到
  const [leagueShow, setLeagueShow] = useState(false); // league 是否显示
  const [searchVal, setSearchVal] = useState(''); // 搜索的值
  const [ignoreScroll, setIgnoreScroll] = useState(false); // 临时禁止滚动

  const [searchShow, setSearchShow] = useState(false); // 搜索
  const [calendarValue, setCalendarValue] = useState(moment()); // 日历的value
  const [calenderShow, setCalenderShow] = useState(false); // 日历是否显示
  const [calenderVal, setCalendarVal] = useState(''); // 日历的值

  // 获取列表的参数 和 page 的参数
  const [params, setParams] = useState({
    ...initParams,
    competition_ids: getSessionStorage(SESS_STORAGE_SELECTED_LEAGUES, '[]'),
  });
  const [pageInfo, setPageInfo] = useState({ ...initPageData });

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
    disableScroll(1); // 设置并禁止触发滚动
    
    setCurrentHeight(null);
    setApiTimestamp('');
    setMenuActive(item);
    const obj = {
      param_key: item.param_key,
      param_value: item.param_value,
      timestamp: 0,
    };
    onParamsChange(obj);
    setCalendarValue(moment()); // 日历的数据每次切换 tab 需要初始化

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

  // 联赛确认点击
  const onLeagueSubmit = (e) => {
    console.log(e)
    onParamsChange({ competition_ids: e });
  };

  // 日历变化
  const calendarChange = (v) => {
    const date = v.format('YYYY-MM-DD');
    setApiTimestamp('');
    onParamsChange({ timestamp: moment(date) / 1000 });
    setCalenderShow(false);
  };

  // 滚动临时禁止
  const disableScroll = (val) => {
    if (val) {
      scrollRef?.current?.scrollTop(val);
    }
    setIgnoreScroll(true);
    setTimeout(() => {
      setIgnoreScroll(false);
    }, 200);
  };

  // 滚动监听
  const handleUpdate = () => {
    if (loading || ignoreScroll || !scrollRef.current) return;
    const current = scrollRef.current;
    const values = current.getValues();
    const status = getScrollDirection(values);
    getCalendarTitle(current, setCalendarValue, renderData); // 获取当前的日历日期
    setShowTopIcon(values.scrollTop > 100 ? true : false);

    if (values.scrollTop > 100) {
      window.scrollTo(0, 48);
      // window.scrollTo(0, 0);
    }

    const { page, prePage, has_pre, has_next } = pageInfo;
    // 下拉加载之前的数据 two_way 获取是否支持
    if (status === 'top' && menuActive.two_way && has_pre) {
      setCurrentHeight(current.getValues().scrollHeight);
      setPageInfo({ ...pageInfo, prePage: prePage - 1, page, isLoading: 'pre' });
      onParamsChange({ page: prePage - 1 });
      disableScroll(); // 滚动临时禁止
    }

    // 上滑到底加载之后的数据
    if (status === 'bottom' && has_next) {
      setPageInfo({ ...pageInfo, page: page + 1, prePage, isLoading: 'next' });
      onParamsChange({ page: page + 1 });
      disableScroll(); // 滚动临时禁止
    }
  };
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
            if (newData.matches.length < params.size) {
              pageExtra.has_pre = false;
            }
            newData.matches = [...newData.matches.reverse(), ...matches];
          } else {
            if (newData.matches.length < params.size) {
              pageExtra.has_next = false;
            }
            newData.matches = [...matches, ...newData.matches];
          }
        } else {
          setApiTimestamp(newData.timestamp)
        }
        setPageInfo({ ...pageInfo, isLoading: false, ...pageExtra });
        return newData;
      } else {
        return { matches: [] };
      }
    });
  };
  const {
    data,
    mutate,
    loading,
    run: getMatchList,
  } = useRequest(getRequestMatchListV3, {
    initialData: {},
    manual: true,
  });
  useUpdateMatch(data?.matches || [], (oldList, list) => {
    const newList = oldList.map((old) => {
      let newObj = list?.find((item) => item.match_id === old.match_id);
      return newObj ? Object.assign(old, newObj) : old;
    });
    mutate({ matches: newList });
  });

  // 获取联赛列表
  const getTabList = async () => {
    const result = await getMatchesTabs();
    const { data = [] } = result;
    data.map((item) => {
      item.label = item.name;
      item.key = item.param_key;
      item.id = item.param_value;
    });
    setMenuList(data);
    onParamsChange({
      param_key: data[0].param_key,
      param_value: data[0].param_value,
    });
    setMenuActive(data[0]);
  };

  // 底部点击
  const onBottomClick = (item) => {
    // 指数切换
    if (item.type === 'icon-tubiao_zhishu') {
      handleReport({ action: indexVal ? 'open_index' : 'close_index' });
      if (indexVal) {
        setIndexData({ ...indexData, color: '#999999', bg: '' });
        setIndexVal(false);
      } else {
        setIndexData({
          ...indexData,
          color: '#ffffff',
          bg: '#FA5900',
        });
        setIndexVal(true);
      }
    }

    // 搜索点击
    if (item.type === 'icon-sousuo') {
      if (searchShow) {
        setSearchShow(false);
      } else {
        params.keywords && onParamsChange({ keywords: '' });
        setSearchVal('');
        setSearchShow(true);
      }
    }
  };

  // 初始化
  useEffect(() => {
    if (menuList === null) {
      getTabList();
      // 缓存了 index 和 true 的话，需要设置一下这个状态
      if (indexVal === true) {
        setIndexData({
          ...indexData,
          color: '#ffffff',
          bg: '#FA5900',
        });
      }
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

  // 兼听滚动条的处理的逻辑
  useEffect(() => {
    const current = scrollRef.current;
    // 下拉加载以后，要返回到之前的位置
    if (currentHeight && !loading) {
      const current = scrollRef.current;
      const val = current.getValues().scrollHeight - currentHeight;
      if (current.getValues().scrollHeight - currentHeight > 100) {
        disableScroll(val); // 设置并禁止触发滚动
        setCurrentHeight(null);
      }
    }

    // 当前tab支持下拉加载时，scrollTop 为 0 的时候，需要置为1 否则上滑无效
    if (menuActive.two_way && current?.getValues().scrollTop === 0) {
      disableScroll(1); // 设置并禁止触发滚动
    }
  }, [currentHeight, loading])

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
    if (searchShow && !params.keywords) {
      return false;
    }
    setPageInfo({ ...initPageData }); // 重置page的默认数据
    return loading;
  }, [loading, menuList, params]);

  // 是否为空
  const isEmpty = (() => {
    if (searchShow && !params.keywords) {
      return false;
    }
    return !renderList.length && !spinning;
  })();

  // 菜单右侧的小菜单
  const MenuTools = (
    <div className={styles.menu_right}>
      {menuActive.has_calendar ? (
        <IconFont
          onClick={() => {
            setCalenderShow(true);
            handleReport({ action: 'calendar' });
          }}
          className={cls(styles.icon, styles.menu_icon)}
          type="icon-rili"
          size={18}
        />
      ) : null}
      {/* icon-shaixuan-xuanzhong2 */}
      {menuActive.has_competition ? (
        <IconFont
          onClick={() => {
            setLeagueShow(true);
            handleReport({ action: 'league_filter' });
          }}
          className={cls(styles.icon, styles.menu_icon)}
          color={params?.competition_ids.length ? '#FA5900' : ''}
          type="icon-shaixuan-xuanzhong2"
          size={18}
        />
      ) : // <img onClick={() => setLeagueShow(true)} src={filterIcon} className={cls(styles.img, styles.menu_icon)} />
      // active={params?.competition_ids.length}
      null}
    </div>
  );
  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      {menuList?.length ? (
        <Menu
          menus={menuList}
          className={styles.menu}
          operations={MenuTools}
          onChange={onMenusChange}
        ></Menu>
      ) : null}
      <div
        className={cls(
          styles.container,
          searchShow ? styles.has_search : null,
          !menuList?.length ? styles.is_loading : null,
        )}
      >
        {/* 搜索 */}
        {searchShow ? (
          <div className={styles.search}>
            <Search
              value={searchVal}
              onChange={setSearchVal}
              onFocus={() => handleReport({ action: 'search_team' })}
              onEnter={(e) => {
                onParamsChange({ keywords: e });
                mutate({ matches: [] }); // 当搜索时，需要把旧的数据清空掉 否则旧数据会一闪一闪的
              }}
            />
            <span
              className={styles.text}
              onClick={() => {
                onParamsChange({ keywords: '' });
                setSearchShow(!searchShow);
              }}
            >
              {intl.formatMessage({ id: 'key_cancel', defaultMessage: 'key_cancel' })}
            </span>
          </div>
        ) : null}
        {/* 主内容 */}

        <Spin spinning={spinning}>
          <ScrollView className={styles.scroll_view} onScroll={handleUpdate} ref={scrollRef}>
            <Spining show={pageInfo.isLoading === 'pre'} />

            {/* 列表渲染 */}
            {renderList.map((dataKey, key) => (
              <div key={key}>
                <TimeTitle title={dataKey} sticky key={key} className="time_title"/>
                {renderData[dataKey].map((item, key) => (
                  <MatchCard data={item} key={key} type={indexVal ? 'index' : 'score'} />
                ))}
              </div>
            ))}

            <Spining show={pageInfo.isLoading === 'next'} />

            {/* 无数据 */}
            {/* && (searchShow && params.keywords)  */}
            {/* && (searchShow && params.keywords) */}
            {isEmpty ? <Empty /> : null}
          </ScrollView>
        </Spin>

        <Calendar
          value={calendarValue} setValue={setCalendarValue}
          params={params}
          show={calenderShow}
          onClose={() => setCalenderShow(false)}
          onChange={calendarChange}
          className={styles.calender}
        />
        <BottomIcon
          onClick={onBottomClick}
          icons={[indexData, { type: 'icon-sousuo', color: '#FA5900' }]}
          // icons={[{ type: 'icon-sousuo', color: '#FA5900' }]}
        />
        {/* {showTopIcon ? (
          <FixedBtns
            showTopIcon={showTopIcon}
            onTopClick={(e) => {
              // disableScroll(); // 滚动临时禁止
              disableScroll(1); // 设置并禁止触发滚动
              setShowTopIcon(false);
              e.stopPropagation();
              e.preventDefault();
            }}
          />
        ) : null} */}
      </div>
      {/* 联赛选择 */}
      <League visible={leagueShow} onSubmit={onLeagueSubmit} onClose={() => setLeagueShow(false)} />
    </div>
  );
};

export default Mobile;
