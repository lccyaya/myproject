import React, { useEffect, useState } from 'react';
import { connect, FormattedMessage, Link, useIntl } from 'umi';
import type { ConnectState } from '@/models/connect';
import { Col, Row, Spin, Tabs } from 'antd';
import styles from './index.less';
import type { hotCompetition, matchType, NewMatchList } from '@/services/matchPage';
import MEmpty from '@/components/Empty';
import type { UserInfoType } from '@/services/user';
import LoginModal from '@/components/MatchCard/Login';
import { report } from '@/services/ad';
import type { REPORT_CATE } from '@/constants';
import { REPORT_ACTION, SESS_STORAGE_SELECTED_LEAGUES } from '@/constants';
import { getMatchesTabs, getMatchListV3 } from '@/utils/match';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { MatchCard, League, TimeTitle } from '@/func-components/pc';
import { IconButton } from '@/base-components/pc';
import { formatDate } from '@/utils/utils';
import { useUpdateMatch } from '@/hooks/update-match';
import { useSessionStorageState, useRequest } from 'ahooks';
import { handleReport } from '@/utils/report';

const { TabPane } = Tabs;

let isFirst = true;

export const getDateData = (matches: matchType[]) => {
  if (!matches) return [];
  const dayObj = {};
  for (let i = 0; i < matches.length; i++) {
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

const LiveEmpty = () => {
  return (
    <div className={styles.liveEmpty}>
      <div className={styles.text}>
        <FormattedMessage id="key_no_game_in_progress" />
      </div>
    </div>
  );
};

interface matchListProps {
  handleChangeLiveMatch: (id: number) => void;
  reportCate?: REPORT_CATE;
  ssrMatchList?: NewMatchList;
  hideLoading?: boolean;
  onTypeChange?: (type: 'Index' | 'Score') => void;
  onTabTypeChange?: (type: string, key: string) => void;
}

const MatchList: React.FC<matchListProps> = (props) => {
  const { reportCate } = props;
  const formatMsg = useIntl().formatMessage;

  const initTypes = [{ id: 1, name: useIntl().formatMessage({ id: 'key_live' }) }];

  // matchList接口参数
  // tab_type
  const [competitionType, setCompetitionType] = useState<any>('');

  const [leagueFilterVisible, setLeagueFilterVisible] = useState(false);
  // const [matchList, setMatchList] = useState([]);
  const [competitionList, setCompetionList] = useState<hotCompetition[]>([]);
  const [loginVisible, setLoginVisible] = useState<boolean>(false);
  const [selectedCompetitionIds, setSelectedCompetitionIds] = useSessionStorageState(
    SESS_STORAGE_SELECTED_LEAGUES,
    {
      defaultValue: undefined,
    },
  );
  const getMatchList = async () => {
    // setMatchListLoading(true);
    return getMatchListV3({
      tab_type: +competitionType,
      zone: -new Date().getTimezoneOffset() / 60,
      page: 1,
      size: 20,
      competition_ids: selectedCompetitionIds?.length ? selectedCompetitionIds : undefined,
    }).then((data: any) => {
      let { matches } = data;
      matches = matches.map((item: any) => {
        item.time = formatDate(item.match_time);
        return item;
      });
      if (isFirst && +competitionType === 1) {
        const hasLiveObj = matches.find((item: any) => item.status === 1 && item.has_live);
        if (!hasLiveObj) {
          setCompetitionType(competitionList[1].id);
        }
      }
      isFirst = false;
      return matches;
      // setMatchList(matches || []);
    });

    //   if (tab_type === 1) {
    //     matches = matches.filter((item: any) => item.status === 1 && item.has_live);
    //     if ( matches.length === 0) {
    //       if (compeList.length) {
    //         setCompetitionType(compeList[1].id);
    //         // getMatchList(compeList[1].id, true, '');
    //         props.onTabTypeChange?.(compeList[1].id + '', compeList[1].param_key);
    //       }
    //       return;
    //     } else {
    //       props.onTabTypeChange?.('1', 'tab_type');
    //       setCompetitionType(1);
    //     }
    //   }
    //   setMatchList(matches || []);
    //   setMatchListLoading(false);
    // });
  };
  // const [menuActive, setMenuActive] = useState({ param_value: 1 });
  const {
    loading,
    run,
    refresh,
    mutate,
    data: matchList = [],
  } = useRequest(getMatchList, {
    manual: true,
  });

  useUpdateMatch(matchList || [], (oldList: any, list: any) => {
    const newList = oldList.map((old: any) => {
      let newObj = list?.find((item: any) => item.match_id === old.match_id);
      return newObj ? Object.assign(old, newObj) : old;
    });
    mutate(newList);
  });

  // 获取联赛列表
  const getTabList = async () => {
    let data = await getMatchesTabs();
    data = data.filter((item: any) => item.param_key === 'tab_type');
    data.map((item: any) => {
      item.label = item.name;
      item.id = item.param_value;
    });
    const _list = [...initTypes, ...data];
    setCompetionList(_list);
    setCompetitionType(_list[0].id);
    // setMenuActive(data[0]);
  };
  useEffect(() => {
    getTabList();
  }, []);
  useEffect(() => {
    if (competitionType && competitionList.length) {
      refresh();
    }
  }, [competitionType, selectedCompetitionIds, competitionList]);
  const handleClick = (key: any) => {
    props.onTabTypeChange?.(key, 'tab_type');
    setCompetitionType(key);
    if (reportCate) {
      report({
        cate: reportCate,
        action: REPORT_ACTION.home_tab + key,
      });
    }
    // 埋点
    if (+key === 2) {
      handleReport({ action: 'schedule_tab' });
    } else if (+key === 3) {
      handleReport({ action: 'finished_tab' });
    } else if (+key === 4) {
      handleReport({ action: 'subscribe_tab' });
    }
  };

  const handleLeagueChange = (competition_ids: any) => {
    setLeagueFilterVisible(false);
    setSelectedCompetitionIds(competition_ids);
  };

  const handleFilterLeagueTriggerClick = () => {
    handleReport({ action: 'league_filter' });
    setLeagueFilterVisible(true);
    if (reportCate) {
      report({
        action: REPORT_ACTION.select_league,
        cate: reportCate,
      });
    }
  };

  // 获取渲染的数据
  const handlerData = (matches: any = []) => {
    if (matches) {
      let obj = {};
      matches.map((item: any) => {
        const { time } = item;
        if (obj[time]) {
          obj[time].push(item);
        } else {
          obj[time] = [item];
        }
      });
      return [Object.keys(obj), obj];
    }
    return [[], []];
  };
  const [renderList, renderData] = handlerData(matchList);
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
      <Spin spinning={loading}>
        <Row className={styles.tabsContainer}>
          <Col span={24}>
            <Tabs
              activeKey={`${competitionType}`}
              className={styles.tabs}
              onChange={(activeKey) => handleClick(activeKey)}
              tabBarExtraContent={
                <div
                  className={styles.filterIconContainer}
                  onClick={handleFilterLeagueTriggerClick}
                >
                  <IconButton
                    onClick={handleFilterLeagueTriggerClick}
                    active={selectedCompetitionIds?.length}
                    icon="icon-bisai"
                    title={formatMsg({ id: 'key_league' })}
                  />
                </div>
              }
            >
              {competitionList.map((ele) => {
                return <TabPane tab={ele.name} key={ele.id} />;
              })}
            </Tabs>
          </Col>
        </Row>
        {/* <Row className={styles.dateTabContainer}>
          <Tabs onChange={handleDateTabChange} activeKey={dateType}>
            {dateTypes.map((t) => (
              <TabPane tab={t.name} key={t.key} />
            ))}
          </Tabs>
        </Row> */}
        <Row className={styles.matchLIstContainer}>
          <Col span={24}>
            {renderList?.length ? (
              <>
                {renderList?.map((dataKey: any, key: any) => (
                  <div key={dataKey + '_' + key}>
                    <TimeTitle title={dataKey} sticky key={key} />
                    <div className={styles.match_card_wrap} key={key}>
                      {renderData[dataKey]?.map((ele: any) => {
                        return <MatchCard data={ele} key={ele.match_id} type={'score'} />;
                      })}
                      {/* <MatchListComp data={renderData[dataKey]} /> */}
                    </div>
                  </div>
                ))}
              </>
            ) : !loading && competitionType === 1 ? (
              <LiveEmpty />
            ) : (
              <MEmpty />
            )}
          </Col>
        </Row>
        {matchList.length > 5 ? (
          <Link
            to={`/${lang}/${
              competitionType === 1 ? 'live' : `match?type=${competitionType}&key=tab_type`
            }`}
            style={{ width: '100%' }}
          >
            <Row className={styles.footer}>
              <FormattedMessage id="key_more" />
            </Row>
          </Link>
        ) : null}
      </Spin>

      <League
        visible={leagueFilterVisible}
        onSubmit={(ids: any) => handleLeagueChange(ids)}
        onClose={() => setLeagueFilterVisible(false)}
      />
    </div>
  );
};
export default MatchList;
