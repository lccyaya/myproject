import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { Link, connect, useIntl, FormattedMessage } from 'umi';
import { SwapOutlined } from '@ant-design/icons';
import type { ConnectState } from '@/models/connect';
import { Tabs, Row, Spin, Col, Button } from 'antd';
import MatchCardHome from '../MatchCardHome';
import MatchCardScore from '../MatchCardScore';
import styles from './index.less';
import * as matchService from '@/services/matchPage';
import type { hotCompetition, matchType } from '@/services/matchPage';
import type { sameDayMatch } from '../../pages/Match';
import filterIcon from '../../assets/icon/filter.svg';
import MEmpty from '@/components/Empty';
import type { UserInfoType } from '@/services/user';
import LoginModal from '@/components/MatchCard/Login';
import LeagueFilterModal from '@/components/LeagueFilterModal';
import { report } from '@/services/ad';
import type { REPORT_CATE } from '@/constants';
import { REPORT_ACTION, SESS_STORAGE_SELECTED_LEAGUES } from '@/constants';
import type { NewMatchList } from '@/services/matchPage';
import { checkIsPhone } from '@/utils/utils';
import MatchLive from '@/components/MatchLive';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { MatchCard, TimeTitle } from '@/func-components/pc';

const { TabPane } = Tabs;

export const getDateData = (matches: matchType[]) => {
  if (!matches) return [];
  const dayObj = {};
  for (let i = 0; i < matches.length; i += 1) {
    const ele = matches[i];
    const day = new Date(ele.match_time * 1000).setHours(0, 0, 0, 0);
    const stringDay = `${day}`;
    ele.currentDay = stringDay;
    dayObj[stringDay] = 0;
  }

  const dayKeys = Object.keys(dayObj);
  const final = dayKeys.map((day: string) => {
    const dayData = matches.filter((ele: matchType) => ele.currentDay === day);
    return {
      date: day,
      matches: dayData,
    };
  });
  return final;
};

function Matches(props: {
  match: matchService.matchType;
  switchType: string;
  reportCate?: REPORT_CATE;
  setParams: (id: number, bool: boolean) => void;
  handleChangeLiveMatch: (id: number) => void;
}) {
  const { switchType, match, reportCate, setParams, handleChangeLiveMatch } = props;
  return (
    <>
      <MatchCard data={match} key={match.match_id} type={switchType === 'Score' ? 'score' : 'index' } />
      {/* {switchType === 'Score' ? (
        <MatchCardScore
          reportCate={reportCate}
          data={match}
          setParams={setParams}
          handleChangeLiveMatch={handleChangeLiveMatch}
          whiteBg
        />
      ) : (
        <MatchCardHome
          reportCate={reportCate}
          data={match}
          setParams={setParams}
          handleChangeLiveMatch={handleChangeLiveMatch}
          whiteBg
        />
      )} */}
    </>
  );
}

function LiveEmpty() {
  return (
    <div className={styles.liveEmpty}>
      <div className={styles.text}>
        <FormattedMessage id="key_no_game_in_progress" />
      </div>
    </div>
  );
}

interface matchListProps {
  handleChangeLiveMatch: (id: number) => void;
  currentUser?: UserInfoType | null;
  reportCate?: REPORT_CATE;
  ssrMatchList?: NewMatchList;
  hideLoading?: boolean;
  onTypeChange?: (type: 'Index' | 'Score') => void;
  onTabTypeChange?: (type: string) => void;
}

const MatchList: React.FC<matchListProps> = (props) => {
  const { currentUser, reportCate, ssrMatchList } = props;

  const initTypes = [
    { id: 'live', name: useIntl().formatMessage({ id: 'key_live' }) },
    { id: 'main', name: useIntl().formatMessage({ id: 'key_main' }) },
    { id: 'all', name: useIntl().formatMessage({ id: 'key_all' }) },
    { id: 'subscribed', name: useIntl().formatMessage({ id: 'key_subscribed' }) },
  ];

  const [leagueFilterVisible, setLeagueFilterVisible] = useState(false);
  const [competitionType, setCompetitionType] = useState<any>('main');
  const [matchList, setMatchList] = useState<any[]>(
    ssrMatchList?.matches ? getDateData(ssrMatchList.matches) : [],
  );
  const [canPlayLiveMatches, setCanPlayLiveMatches] = useState<matchType[]>([]);
  const [isMatchListLoading, setMatchListLoading] = useState<boolean>(false);
  const [competitionList] = useState<hotCompetition[]>(initTypes);
  const [loginVisible, setLoginVisible] = useState<boolean>(false);
  const [switchType, setSwitchType] = useState<string>('Score');
  const [selectedCompetitionIds, setSelectedCompetitionIds] = useState<number[] | undefined>();
  const [upcomingList, setUpcomingList] = useState<matchType[]>([]);
  const liveTimer = useRef<number>();
  const isPhone = checkIsPhone();

  const today = new Date().setHours(0, 0, 0, 0);

  const getMatchList = async (t: number | string, loading = true) => {
    setMatchListLoading(loading);
    const zone = -new Date().getTimezoneOffset() / 60;
    const res = await matchService.newFetchMatchList({
      timestamp: Math.floor(today / 1000),
      zone,
      init: 0,
      is_pre: false,
      keywords: '',
      tab_type: ['', 'main', 'all', 'subscribed'].indexOf(String(t)) as 1 | 2 | 3,
      tab_competition_ids: selectedCompetitionIds?.length ? selectedCompetitionIds : undefined,
    });
    if (res.success && res.data) {
      const final = getDateData(res.data.matches);
      setMatchList(final);
      setMatchListLoading(false);
    } else {
      setMatchList([]);
      setMatchListLoading(false);
    }
  };

  const getLiveList = async (isInit: boolean, loading = true) => {
    if (loading) {
      setMatchListLoading(true);
    }
    const currentTime = new Date().getTime();
    const result = await matchService.fetchLiveMatchList({
      timestamp: Math.floor(currentTime / 1000),
      page: 1,
      size: 50,
    });
    if (result.success) {
      if (result.data.matches.length > 0) {
        result.data.matches.sort((a, b) => {
          return a.match_time - b.match_time;
        });
        const cantPlay: matchType[] = [];
        const canPlay: matchType[] = [];
        result.data.matches.forEach((m) => {
          const playable =
            [2, 3, 4, 5, 6, 7].includes(m.status) &&
            ((m.has_live && (m.normal_live_link || m.high_live_link)) || m.live_animation_link);
          if (playable) {
            canPlay.push(m);
          } else {
            cantPlay.push(m);
          }
        });
        setCanPlayLiveMatches(canPlay);
        const now = Math.floor(Date.now() / 1000);
        const source = isPhone ? result.data.matches : cantPlay;
        const upcomingIndex = source.findIndex((m) => m.match_time > now);
        const final = getDateData(source.slice(0, upcomingIndex));
        setUpcomingList(source.slice(upcomingIndex));
        setMatchList(final);
        setMatchListLoading(false);
      } else if (isInit) {
        setCompetitionType('main');
        getMatchList('main');
        setMatchListLoading(false);
      } else {
        setMatchList([]);
        setMatchListLoading(false);
      }
    } else {
      setMatchListLoading(false);
    }
  };

  useEffect(() => {
    let ids: number[] = [];
    try {
      ids = JSON.parse(sessionStorage.getItem(SESS_STORAGE_SELECTED_LEAGUES) || '[]');
      // eslint-disable-next-line no-empty
    } catch (e) {}
    setSelectedCompetitionIds(ids);
    return () => {
      clearInterval(liveTimer.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!selectedCompetitionIds) return;
    if (competitionType !== 'live') {
      getMatchList(competitionType, !props.hideLoading);
    }
  }, [selectedCompetitionIds]);

  const handleClick = (key: any) => {
    props.onTabTypeChange?.(key);
    clearInterval(liveTimer.current);
    if (reportCate) {
      report({
        cate: reportCate,
        action: REPORT_ACTION.home_tab + key,
      });
    }
    if (key === 'subscribed' && !currentUser) {
      setLoginVisible(true);
      return;
    }
    setCompetitionType(key);

    if (key === 'live') {
      getLiveList(false);
      liveTimer.current = window.setInterval(() => getLiveList(false, false), 10000);
    } else {
      getMatchList(key);
    }
  };

  const handleSwitch = () => {
    if (reportCate) {
      report({
        action: switchType === 'Score' ? REPORT_ACTION.select_index : REPORT_ACTION.select_score,
        cate: reportCate,
      });
    }
    const currentSwitch = switchType === 'Score' ? 'Index' : 'Score';
    setSwitchType(currentSwitch);
    props.onTypeChange?.(currentSwitch);
  };

  const handleLeagueChange = (isAll: boolean, selectedIds: number[]) => {
    setLeagueFilterVisible(false);
    setSelectedCompetitionIds(isAll ? [] : selectedIds);
  };

  const handleFilterLeagueTriggerClick = () => {
    setLeagueFilterVisible(true);
    if (reportCate) {
      report({
        action: REPORT_ACTION.select_league,
        cate: reportCate,
      });
    }
  };

  const showLiveVideo = !isPhone && competitionType === 'live' && canPlayLiveMatches.length > 0;
  const lang = toShortLangCode(locale.getLocale());

  return (
    <div className={styles.container}>
      <LoginModal
        visible={loginVisible}
        onLogin={() => {
          setLoginVisible(false);
        }}
        onCancel={() => {
          setLoginVisible(false);
        }}
      />
      <Spin spinning={isMatchListLoading}>
        <Row className={styles.tabsContainer}>
          <Col span={14}>
            <Tabs
              activeKey={`${competitionType}`}
              className={styles.tabs}
              onChange={(activeKey) => handleClick(activeKey)}
            >
              {competitionList.map((ele) => {
                return <TabPane tab={ele.name} key={ele.id} />;
              })}
            </Tabs>
          </Col>
          <Col span={4} className={styles.switch}>
            <Button
              className={styles.switchButton}
              icon={<SwapOutlined />}
              type="text"
              size="large"
              onClick={handleSwitch}
            >
              <FormattedMessage id={switchType === 'Score' ? 'key_index' : 'key_score'} />
            </Button>
          </Col>
          <Col className={styles.filterIconContainer} onClick={handleFilterLeagueTriggerClick}>
            <img src={filterIcon} className={styles.menuIcon} />
          </Col>
        </Row>
        <Row className={styles.matchLIstContainer}>
          {showLiveVideo && (
            <MatchLive
              onlyOne
              matchList={canPlayLiveMatches}
              reportCate={reportCate}
              indexView={switchType === 'Index'}
            />
          )}
          {!showLiveVideo && matchList && matchList.length > 0
            ? matchList.map((ele: sameDayMatch, index: number) => {
                const indexKey = `sameDayMatch${index}`;
                return (
                  <Row className={styles.listContainer} key={indexKey}>
                    {competitionType !== 'live' && (
                      <div className={styles.dateContainer}>
                        <TimeTitle title={moment(new Date(+ele.date)).format('ddd, DD/MM YYYY')} key={indexKey} />
                        {/* <span className={styles.dayOfWeek}>
                          {moment(new Date(+ele.date)).format('ddd')},{' '}
                        </span>
                        <span className={styles.month}>
                          {moment(new Date(+ele.date)).format('DD/MM YYYY')}
                        </span> */}
                      </div>
                    )}
                    {ele.matches.map((d: matchType, i) => {
                      const key = `matcheList-${i}`;
                      return (
                        // <MatchCard key={key} data={d} type={switchType === 'Score' ? 'socre' : 'indedx'} />
                        <Matches
                          reportCate={reportCate}
                          key={key}
                          match={d}
                          switchType={switchType}
                          setParams={(id: number, bool: boolean) => {
                            matchList.forEach((k) => {
                              const { matches } = k;
                              const sameMatch = matches.find((m: any) => m.match_id === id);
                              if (sameMatch) {
                                sameMatch.subscribed = bool;
                                const cloned = JSON.parse(JSON.stringify(matchList));
                                setMatchList(cloned);
                              }
                            });
                          }}
                          handleChangeLiveMatch={props.handleChangeLiveMatch}
                        />
                      );
                    })}
                  </Row>
                );
              })
            : !showLiveVideo &&
              !isMatchListLoading && <>{competitionType !== 'live' ? <MEmpty /> : <LiveEmpty />}</>}
        </Row>
        {competitionType === 'live' && !showLiveVideo && (
          <>
            <div className={styles.upcomingTip}>
              <div className={styles.icon} />
              <div className={styles.text}>
                <FormattedMessage id="key_upcoming_matches" />
              </div>
            </div>
            <Row>
              {upcomingList.map((m) => (
                // <MatchCard key={m.match_id} data={m} type={switchType === 'Score' ? 'socre' : 'indedx'} />
                <Matches
                  reportCate={reportCate}
                  key={m.match_id}
                  match={m}
                  switchType={switchType}
                  setParams={(id, bool) => {
                    setUpcomingList(
                      upcomingList.map((innerM) => {
                        return {
                          ...innerM,
                          subscribed: innerM.match_id === id ? bool : innerM.subscribed,
                        };
                      }),
                    );
                  }}
                  handleChangeLiveMatch={props.handleChangeLiveMatch}
                />
              ))}
            </Row>
          </>
        )}
        <Link
          to={`/${lang}/${competitionType === 'live' ? 'live' : `match?type=${competitionType}`}`}
          style={{ width: '100%' }}
        >
          <Row className={styles.footer}>
            <FormattedMessage id="key_more" />
          </Row>
        </Link>
      </Spin>

      <LeagueFilterModal
        open={leagueFilterVisible}
        close={() => setLeagueFilterVisible(false)}
        onOk={handleLeagueChange}
      />
    </div>
  );
};
// export default MatchList;
export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(MatchList);
