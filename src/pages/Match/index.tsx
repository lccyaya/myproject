import React, { useState, useEffect, useRef, useCallback } from 'react';
import classnames from 'classnames';
import ScrollView from 'react-custom-scrollbars';
import { Menu, Spin, Row, Col, DatePicker, Button, Input, message } from 'antd';
import { SearchOutlined, SwapOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect, useIntl, FormattedMessage, useLocation } from 'umi';
import type { ConnectState } from '@/models/connect';
import styles from './index.less';
import * as matchService from '@/services/matchPage';
import type { hotCompetition, matchType as matchTypeObject } from '@/services/matchPage';
import MatchCard from '@/func-components/match-card/mobile';
import MatchCardHome from '@/components/MatchCardHome';
import MatchCardScore from '@/components/MatchCardScore';
import { getDateData } from '../../components/MatchList';
import MEmpty from '@/components/Empty';
import LoginModal from '@/components/MatchCard/Login';
import type { UserInfoType } from '@/services/user';
import filterIcon from '@/assets/icon/filter.svg';
import LeagueFilterModal from '@/components/LeagueFilterModal';
import { REPORT_ACTION, REPORT_CATE, SESS_STORAGE_SELECTED_LEAGUES } from '@/constants';
import { report } from '@/services/ad';
import { checkIsPhone } from '@/utils/utils';

export type sameDayMatch = {
  date: number;
  matches: matchTypeObject[];
};

type IProps = {
  currentUser?: UserInfoType | null;
  // isPhone?: boolean;
  ssrMatchList?: matchService.NewMatchList;
  hideLoading?: boolean;
};

// const isPhone = checkIsPhone();

const Match: React.FC<IProps> = (props) => {
  const [isPhone, setIsPhone] = useState(false);
  const { ssrMatchList } = props;
  let initialMatchList: ReturnType<typeof getDateData> = [];
  if (ssrMatchList) {
    ssrMatchList.matches.sort((a, b) => {
      return a.match_time - b.match_time;
    });
    initialMatchList = getDateData(ssrMatchList.matches);
  }
  const livePageSize = 50;
  const dateFormat = 'YYYY/MM/DD';
  const today = new Date().setHours(0, 0, 0, 0);
  const intl = useIntl();
  const initTypes = [
    { id: 'main', name: intl.formatMessage({ id: 'key_main' }) },
    { id: 'all', name: intl.formatMessage({ id: 'key_all' }) },
    { id: 'subscribed', name: intl.formatMessage({ id: 'key_subscribed' }) },
  ];
  // @ts-ignore
  let queryTabType: string = useLocation().query.type;
  if (!initTypes.some((t) => t.id === queryTabType)) {
    queryTabType = initTypes[0].id;
  }

  const scrollRef = useRef<any | null>(null);
  const dateMatchRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [anchorIndex, setAnchorIndex] = useState(-1);
  const [leagueFilterVisible, setLeagueFilterVisible] = useState(false);
  const [topDone, setTopDone] = useState(false);
  const [topNextTimestamp, setTopNextTimestamp] = useState(0);
  const [bottomDone, setBottomDone] = useState(false);
  const [bottomNextTimestamp, setBottomNextTimestamp] = useState(0);
  const [lastTimestamp, setLastTimestamp] = useState(0);
  const [competitionList] = useState<hotCompetition[]>(initTypes);
  const [matchType, setMatchType] = useState<any>(queryTabType);
  const [date, setDate] = useState<number>(today);
  const [matchList, setMatchList] = useState(initialMatchList);
  const [loading, setLoading] = useState<boolean>(false);
  const [loginVisible, setLoginVisible] = useState<boolean>(false);
  const [livePage, setLivePage] = useState<number>(1);
  const [liveDataLength, setLiveDataLength] = useState<number>(0);
  const [switchType, setSwitchType] = useState<string>('Score');
  const [searchInput, setSearchInput] = useState<string>('');
  const [selectedCompetitionIds, setSelectedCompetitionIds] = useState<number[] | undefined>();
  const [fromLastTimestamp, setFromLastTimestamp] = useState(false);
  const [ignoreScroll, setIgnoreScroll] = useState(false);
  const [isFirst, setIsFirst] = useState(true);

  const { currentUser } = props;

  const getMatchList = async (
    type: number | string,
    timestamp: number,
    modes: ('top' | 'bottom')[],
    keywords: string,
    append?: boolean,
  ) => {
    setLastTimestamp(timestamp);
    const zone = -new Date().getTimezoneOffset() / 60;
    const result = await matchService.newFetchMatchList({
      timestamp: Math.floor(timestamp / 1000),
      zone,
      keywords,
      init: modes.length === 2 ? 1 : 0,
      is_pre: modes[0] === 'top',
      tab_type: ['', 'main', 'all', 'subscribed'].indexOf(String(type)) as 1 | 2 | 3,
      tab_competition_ids: selectedCompetitionIds?.length ? selectedCompetitionIds : undefined,
    });
    setLoading(false);
    if (!result.success) {
      message.error(result.message || 'Request Error');
      return;
    }
    const { has_pre, has_next, next_time, pre_time } = result.data;
    const matches = result.data.matches || [];
    setTopDone(!has_pre);
    setBottomDone(!has_next);
    if (modes.length === 2) {
      setTopNextTimestamp(Number(pre_time) * 1000);
      setBottomNextTimestamp(Number(next_time) * 1000);
    } else if (modes[0] === 'top') {
      setTopNextTimestamp(Number(pre_time) * 1000);
    } else {
      setBottomNextTimestamp(Number(next_time) * 1000);
    }
    if (type !== 'subscribed') {
      matches.sort((a, b) => {
        return a.match_time - b.match_time;
      });
    }
    let final = getDateData(matches);
    let anchor: number;
    if (modes.length === 2) {
      // 加载上下两端
      anchor = final.findIndex((f) => {
        return Math.floor(Number(f.date) / 864e5) === Math.floor(timestamp / 864e5);
      });
      if (anchor === -1) {
        anchor = 0;
      }
    } else if (modes[0] === 'top') {
      // 向上加载
      anchor = final.length;
    } else {
      // 向下加载不需要处理滚动条位置
      anchor = -1;
    }
    if (append) {
      final = modes[0] === 'bottom' ? matchList.concat(final) : final.concat(matchList);
    }
    setIgnoreScroll(true);
    setMatchList(final);
    setAnchorIndex(anchor);
    setTimeout(() => {
      setIgnoreScroll(false);
    }, 200);
  };

  const getLiveList = async (p: number, bool?: boolean) => {
    const currentTime = new Date().getTime();
    const result = await matchService.fetchLiveMatchList({
      timestamp: Math.floor(currentTime / 1000),
      page: p,
      size: livePageSize,
    });
    if (result.success) {
      result.data.matches.sort((a, b) => {
        return a.match_time - b.match_time;
      });

      let final = getDateData(result.data.matches);
      if (bool) {
        final = matchList.concat(final);
        setLivePage(p);
      }
      setMatchList(final);
      setLoading(false);
      setLiveDataLength(result.data.matches.length);
    } else {
      setLoading(false);
    }
  };

  const handleClick = (key: string | number) => {
    report({
      cate: REPORT_CATE.match,
      action: REPORT_ACTION.home_tab + key,
    });
    if (key === 'subscribed' && !currentUser) {
      setLoginVisible(true);
      return;
    }
    setLoading(true);

    setMatchType(key);

    if (key === 'live') {
      getLiveList(1);
    } else {
      getMatchList(key, date, ['top', 'bottom'], searchInput);
    }
  };

  const handlePickDate = (d: any, t: string) => {
    setLoading(true);
    const currentDate = new Date(t).getTime();
    setDate(currentDate);
    getMatchList(matchType, currentDate, ['top', 'bottom'], searchInput);
  };

  const handleUpdate = () => {
    if (loading || ignoreScroll || !scrollRef.current) return;
    const values = scrollRef.current.getValues();
    const { scrollTop, scrollHeight, clientHeight } = values;
    const isScroll = scrollHeight > clientHeight;
    const isBottom = scrollTop + clientHeight === scrollHeight;
    let dir = scrollTop === 0 ? 'top' : '';
    if (dir !== 'top' && isScroll && isBottom) {
      dir = 'bottom';
    }
    if (!dir) return;
    if (matchType === 'live') {
      if (liveDataLength && liveDataLength === livePageSize) {
        setLoading(true);
        const nextPage = livePage + 1;
        getLiveList(nextPage, true);
      }
    } else {
      if ((dir === 'top' && topDone) || (dir === 'bottom' && bottomDone)) return;
      setTimeout(() => {
        setLoading(true);
        getMatchList(
          matchType,
          dir === 'top' ? topNextTimestamp : bottomNextTimestamp,
          [dir as 'top' | 'bottom'],
          searchInput,
          true,
        );
      });
      // }
    }
  };

  const menu = (
    <Menu
      mode={isPhone ? 'horizontal' : 'inline'}
      className={styles.menu}
      selectedKeys={[`${matchType}`]}
      onClick={({ key }) => handleClick(key)}
      inlineIndent={isPhone ? 12 : 24}
    >
      {competitionList.map((ele) => {
        return <Menu.Item key={ele.id}>{ele.name}</Menu.Item>;
      })}
    </Menu>
  );

  const handleSwitch = () => {
    report({
      action: switchType === 'Score' ? REPORT_ACTION.select_index : REPORT_ACTION.select_score,
      cate: REPORT_CATE.match,
    });
    const currentSwitch = switchType === 'Score' ? 'Index' : 'Score';
    setSwitchType(currentSwitch);
  };

  const handleLeagueChange = (isAll: boolean, selectedIds: number[]) => {
    setLeagueFilterVisible(false);
    setFromLastTimestamp(true);
    setSelectedCompetitionIds(isAll ? [] : selectedIds);
  };

  const handleSearch = (pattern: string) => {
    setSearchInput(pattern);
    setLoading(true);
    getMatchList(matchType, lastTimestamp, ['top', 'bottom'], searchInput);
  };

  const handleSetParams = useCallback(
    (id: number, bool: boolean) => {
      let dateIndex = -1;
      let matchIndex = -1;
      const found = matchList.some((d, index) => {
        const i = d.matches.findIndex((m) => m.match_id === id);
        if (i > -1) {
          dateIndex = index;
          matchIndex = i;
          return true;
        }
        return false;
      });

      if (!found) return;
      const { matches } = matchList[dateIndex];
      matchList[dateIndex].matches = [
        ...matches.slice(0, matchIndex),
        {
          ...matches[matchIndex],
          subscribed: bool,
        },
        ...matches.slice(matchIndex + 1),
      ];

      setMatchList([...matchList]);
    },
    [matchList],
  );

  useEffect(() => {
    const node = dateMatchRefs.current[anchorIndex];
    if (!node) return;
    scrollRef.current?.scrollTop(node.offsetTop);
  }, [anchorIndex]);

  useEffect(() => {
    let ids: number[] = [];
    try {
      ids = JSON.parse(sessionStorage.getItem(SESS_STORAGE_SELECTED_LEAGUES) || '[]');
      // eslint-disable-next-line no-empty
    } catch (e) {}
    setSelectedCompetitionIds(ids);
  }, []);

  useEffect(() => {
    if (!selectedCompetitionIds) return;
    if (!isFirst) {
      setLoading(true);
    } else {
      if (!props.hideLoading) {
        setLoading(true);
      }
      setIsFirst(false);
    }
    getMatchList(matchType, date, ['top', 'bottom'], searchInput);
    setFromLastTimestamp(false);
  }, [selectedCompetitionIds]);

  const [searchTheTeam, setSearchTheTeam] = useState('');
  useEffect(() => {
    setIsPhone(checkIsPhone());
    setSearchTheTeam(intl.formatMessage({ id: 'key_search_the_team' }));
  }, []);
  return (
    <Spin spinning={loading}>
      <LoginModal
        visible={loginVisible}
        onLogin={() => {
          setLoginVisible(false);
        }}
        onCancel={() => {
          setLoginVisible(false);
        }}
      />
      {/* {isPhone && menu} */}
      <Row className={classnames(styles.main, isPhone ? styles.phone : '')}>
        {!isPhone && (
          <Col span={5}>
            <ScrollView>{menu}</ScrollView>
          </Col>
        )}
        <Col span={isPhone ? 24 : 19}>
          <Row className={styles.header}>
            <Col span={12} className={styles.searchWrapper}>
              {/* <Input placeholder={searchTheTeam}></Input> */}
              <Input.Search
                placeholder={searchTheTeam}
                loading={false}
                className={styles.search}
                size={isPhone ? 'small' : 'large'}
                prefix={<SearchOutlined className={styles.SearchOutlined} />}
                value={searchInput}
                onSearch={handleSearch}
                onChange={(v) => {
                  setSearchInput(v.target.value);
                }}
              />
            </Col>
            <Button
              className={styles.switchButton}
              icon={<SwapOutlined className={styles.icon} />}
              type="text"
              size="large"
              onClick={handleSwitch}
            >
              <FormattedMessage id={switchType === 'Score' ? 'key_index' : 'key_score'} />
            </Button>
            <div
              className={styles.filterIconContainer}
              onClick={() => {
                report({
                  action: REPORT_ACTION.select_league,
                  cate: REPORT_CATE.match,
                });
                setLeagueFilterVisible(true);
              }}
            >
              <img src={filterIcon} className={styles.menuIcon} />
            </div>
            <DatePicker
              allowClear={false}
              className={styles.datePicker}
              value={moment(new Date(date), dateFormat)}
              format={dateFormat}
              size="small"
              onChange={handlePickDate}
            />
          </Row>
          <div className={styles.scrollContainer}>
            {matchList && matchList.length > 0 ? (
              <ScrollView onScroll={handleUpdate} ref={scrollRef}>
                {matchList.map((ele, i: number) => {
                  const key = ele.date;
                  return (
                    <Row
                      ref={(r) => {
                        dateMatchRefs.current[i] = r;
                      }}
                      className={classnames(
                        styles.listContainer,
                        matchType === 'live' ? styles.liveListContainer : '',
                      )}
                      key={key}
                    >
                      <div className={styles.dateContainer}>
                        <span className={styles.date}>{`${moment(new Date(+ele.date)).format(
                          'ddd',
                        )}, `}</span>
                        <span className={styles.month}>
                          {moment(new Date(+ele.date)).format('DD/MM YYYY')}
                        </span>
                      </div>
                      {ele.matches.map((d) => {
                        return <MatchCard data={d} />;
                      })}
                      {/* {ele.matches.map((d: matchTypeObject) => {
                        return switchType === 'Score' ? (
                          <MatchCardScore
                            reportCate={REPORT_CATE.match}
                            data={d}
                            key={d.match_id}
                            from="match"
                            setParams={handleSetParams}
                          />
                        ) : (
                          <MatchCardHome
                            reportCate={REPORT_CATE.match}
                            data={d}
                            key={d.match_id}
                            from="match"
                            setParams={handleSetParams}
                          />
                        );
                      })} */}
                    </Row>
                  );
                })}
              </ScrollView>
            ) : (
              !loading && <MEmpty />
            )}
          </div>
        </Col>
      </Row>
      <LeagueFilterModal
        open={leagueFilterVisible}
        close={() => setLeagueFilterVisible(false)}
        onOk={handleLeagueChange}
      />
    </Spin>
  );
};

// @ts-ignore
// Match.getInitialProps = async () => {
//   const today = new Date().setHours(0, 0, 0, 0);
//   const offset = ssrGet('timezoneOffset');
//   const result = await matchService.newFetchMatchList({
//     timestamp: Math.floor((today + offset * 36e5) / 1000),
//     zone: offset,
//     keywords: '',
//     init: 0,
//     is_pre: false,
//     tab_type: 1,
//     tab_competition_ids: undefined,
//   });
//   return {
//     ssrMatchList: result.success ? result.data : undefined,
//     hideLoading: true,
//   };
// };

export default connect(({ user, divice }: ConnectState) => ({
  currentUser: user.currentUser,
  // isPhone: divice.isPhone,
}))(Match);
