import { Button, Spin, Tabs } from 'antd';
import styles from './match.less';
import { Link, useIntl, useSelector, history } from 'umi';
import { RightOutlined, SwapOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { FormattedMessage } from '@@/plugin-locale/localeExports';
import filterIcon from '@/assets/icon/filter.svg';
import LeagueFilterModal from '@/components/LeagueFilterModal';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE, SESS_STORAGE_SELECTED_LEAGUES } from '@/constants';
import type { ConnectState } from '@/models/connect';
import LoginModal from '@/components/MatchCard/Login';
import type { matchType as MatchDTO } from '@/services/matchPage';
import type * as matchService from '@/services/matchPage';
import moment from 'moment';
import MatchCardScore from '@/components/MatchCardScore';
import { MatchCard } from '@/func-components/mobile';
import MatchCardHome from '@/components/MatchCardHome';
import MEmpty from '@/components/Empty';
import { getAtLeastThreeDayMatch, getMatchStatus, MatchStatus } from '@/utils/match';
import DownloadTip from '@/pages/Home/mobile/components/download-tip';
import Ad from '@/pages/Home/mobile/components/ad';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';

type MatchType = 'main' | 'all' | 'subscribe';
type DateType = 'yesterday' | 'today' | 'tomorrow';
type DisplayType = 'Score' | 'Index';

function MatchTypeTab(props: { type: MatchType; onChange?: (type: MatchType) => void }) {
  const { type, onChange } = props;
  const formatMsg = useIntl().formatMessage;
  const types = [
    {
      key: 'main',
      name: formatMsg({ id: 'key_main' }),
    },
    {
      key: 'all',
      name: formatMsg({ id: 'key_all' }),
    },
    {
      key: 'subscribe',
      name: formatMsg({ id: 'key_subscribe' }),
    },
  ];
  const currentUser = useSelector<ConnectState>((state) => state.user.currentUser);

  const [loginVisible, setLoginVisible] = useState<boolean>(false);
  const handleChange = (key: MatchType) => {
    report({
      cate: REPORT_CATE.home,
      action: REPORT_ACTION.home_tab + key,
    });
    if (key === 'subscribe' && !currentUser) {
      setLoginVisible(true);
      return;
    }
    onChange?.(key);
  };
  return (
    <div className={styles.typeTab}>
      <Tabs
        onChange={(k) => handleChange(k as MatchType)}
        activeKey={type}
        tabBarExtraContent={{
          left: <div className={styles.title}>{formatMsg({ id: 'key_match' })}</div>,
          right: (
            <div
              className={styles.more}
              onClick={() => {
                const lang = toShortLangCode(locale.getLocale());
                history.push(`/${lang}/match`);
              }}
            >
              {formatMsg({ id: 'key_more' })}
              <RightOutlined />
            </div>
          ),
        }}
      >
        {types.map((t) => (
          <Tabs.TabPane tab={t.name} key={t.key} />
        ))}
      </Tabs>
      <LoginModal
        visible={loginVisible}
        onLogin={() => {
          setLoginVisible(false);
        }}
        onCancel={() => {
          setLoginVisible(false);
        }}
      />
    </div>
  );
}

function FilterTab(props: {
  dateType: DateType;
  displayType: 'Score' | 'Index';
  onDateTypeChange?: (type: DateType) => void;
  onDisplayTypeChange?: (type: DisplayType) => void;
  onLeagueChange?: (leagueIds: number[]) => void;
}) {
  const { dateType, displayType, onDateTypeChange, onDisplayTypeChange, onLeagueChange } = props;
  const formatMsg = useIntl().formatMessage;
  const types = [
    {
      key: 'yesterday',
      name: formatMsg({ id: 'key_yesterday' }),
    },
    {
      key: 'today',
      name: formatMsg({ id: 'key_today' }),
    },
    {
      key: 'tomorrow',
      name: formatMsg({ id: 'key_tomorrow' }),
    },
  ];
  const [leagueFilterVisible, setLeagueFilterVisible] = useState(false);
  // const [switchType, setSwitchType] = useState<string>('Score');

  const handleFilterLeagueTriggerClick = () => {
    setLeagueFilterVisible(true);
    report({
      action: REPORT_ACTION.select_league,
      cate: REPORT_CATE.home,
    });
  };
  const handleLeagueChange = (isAll: boolean, selectedIds: number[]) => {
    setLeagueFilterVisible(false);
    onLeagueChange?.(isAll ? [] : selectedIds);
  };
  const handleSwitch = () => {
    report({
      action: displayType === 'Score' ? REPORT_ACTION.select_index : REPORT_ACTION.select_score,
      cate: REPORT_CATE.home,
    });
    const currentSwitch = displayType === 'Score' ? 'Index' : 'Score';
    // setSwitchType(currentSwitch);
    onDisplayTypeChange?.(currentSwitch);
  };
  const handleDateTabChange = (date: string) => {
    onDateTypeChange?.(date as DateType);
    report({
      action: date,
      cate: REPORT_CATE.home,
    });
  };
  return (
    <div className={styles.dateTab}>
      <Tabs
        onChange={handleDateTabChange}
        activeKey={dateType}
        tabBarExtraContent={{
          left: <div className={styles.leftSpace} />,
          right: (
            <div className={styles.filter}>
              <Button
                className={styles.switchButton}
                icon={<SwapOutlined />}
                type="text"
                size="large"
                onClick={handleSwitch}
              >
                <FormattedMessage id={displayType === 'Score' ? 'key_index' : 'key_score'} />
              </Button>
              <div className={styles.line} />
              <div className={styles.filterIconContainer} onClick={handleFilterLeagueTriggerClick}>
                <img src={filterIcon} className={styles.menuIcon} />
              </div>
            </div>
          ),
        }}
      >
        {types.map((t) => (
          <Tabs.TabPane tab={t.name} key={t.key} />
        ))}
      </Tabs>
      <LeagueFilterModal
        open={leagueFilterVisible}
        close={() => setLeagueFilterVisible(false)}
        onOk={handleLeagueChange}
      />
    </div>
  );
}

const dateFmt = 'DD/MM';
const today = new Date().setHours(0, 0, 0, 0);

function MatchItem(props: {
  match: matchService.matchType;
  switchType: string;
  reportCate?: REPORT_CATE;
  key: string | number;
  setParams: (id: number, bool: boolean) => void;
}) {
  const { switchType, match, reportCate, setParams } = props;
  return (
    <>
      <MatchCard data={match} key={match.match_id} type={switchType === 'Score' ? 'score' : 'index'} />
      {/* {switchType === 'Score' ? (
        <MatchCardScore reportCate={reportCate} data={match} setParams={setParams} />
      ) : (
        <MatchCardHome reportCate={reportCate} data={match} setParams={setParams} />
      )} */}
    </>
  );
}

function Matches(props: {
  displayType: DisplayType;
  setParams: (id: number, bool: boolean) => void;
  data: MatchDTO[];
  showEnded: boolean;
}) {
  const { data, setParams, displayType, showEnded } = props;
  let normal: MatchDTO[] = [];
  const ended: MatchDTO[] = [];
  if (showEnded) {
    data.forEach((m) => {
      const status = getMatchStatus(m.status);
      if (status === MatchStatus.Complete || status === MatchStatus.TBD) {
        ended.push(m);
      } else {
        normal.push(m);
      }
    });
  } else {
    normal = props.data;
  }
  const getReactNode = (m: MatchDTO) => (
    <MatchItem
      reportCate={REPORT_CATE.home}
      key={m.match_id}
      match={m}
      switchType={displayType}
      setParams={setParams}
    />
  );
  const normalNodes = normal.map(getReactNode);
  const endedNodes = ended.map(getReactNode);
  return (
    <>
      {normalNodes}
      {ended.length > 0 && (
        <div className={styles.endedTip}>
          <div className={styles.icon} />
          <FormattedMessage id="key_finished_matches" />
        </div>
      )}
      {endedNodes}
    </>
  );
}

export default function Match() {
  const [matchType, setMatchType] = useState<MatchType>('main');
  const [dateType, setDateType] = useState<DateType>('today');
  const [displayType, setDisplayType] = useState<DisplayType>('Score');
  const [leagueIds, setLeagueIds] = useState<number[] | undefined>();
  const [isMatchListLoading, setMatchListLoading] = useState<boolean>(true);
  const [yesterdayMatches, setYesterdayMatches] = useState<MatchDTO[]>([]);
  const [todayMatches, setTodayMatches] = useState<MatchDTO[]>([]);
  const [tomorrowMatches, setTomorrowMatches] = useState<MatchDTO[]>([]);
  const matches = {
    yesterday: yesterdayMatches,
    today: todayMatches,
    tomorrow: tomorrowMatches,
  }[dateType];

  const setMatches = (matchList: MatchDTO[]) => {
    const ye: MatchDTO[] = [];
    const tod: MatchDTO[] = [];
    const tom: MatchDTO[] = [];

    matchList.forEach((m) => {
      const date = moment(m.match_time * 1000).format(dateFmt);
      if (date === moment(today - 864e5).format(dateFmt)) {
        ye.push(m);
      } else if (date === moment(today).format(dateFmt)) {
        tod.push(m);
      } else if (date === moment(today + 864e5).format(dateFmt)) {
        tom.push(m);
      }
    });
    setYesterdayMatches(ye);
    setTodayMatches(tod);
    setTomorrowMatches(tom);
  };

  const getMatchList = async (loading = true) => {
    setMatchListLoading(loading);
    const zone = -new Date().getTimezoneOffset() / 60;
    const res = await getAtLeastThreeDayMatch({
      secondDayTimestamp: today,
      zone,
      tab_type: ['', 'main', 'all', 'subscribe'].indexOf(matchType) as 1 | 2 | 3,
      tab_competition_ids: leagueIds?.length ? leagueIds : undefined,
    });
    setMatches(res);
    setMatchListLoading(false);
  };

  const setParams = (id: number, bool: boolean) => {
    const index = matches.findIndex((match) => match.match_id === id);
    if (index < 0) return;
    const newData = [
      ...matches.slice(0, index),
      {
        ...matches[index],
        subscribed: bool,
      },
      ...matches.slice(index + 1),
    ];
    if (dateType === 'yesterday') {
      setYesterdayMatches(newData);
    } else if (dateType === 'today') {
      setTodayMatches(newData);
    } else {
      setTomorrowMatches(newData);
    }
  };

  useEffect(() => {
    let ids: number[] = [];
    try {
      ids = JSON.parse(sessionStorage.getItem(SESS_STORAGE_SELECTED_LEAGUES) || '[]');
      // eslint-disable-next-line no-empty
    } catch (e) {}
    setLeagueIds(ids);
  }, []);

  useEffect(() => {
    if (!leagueIds) return;
    getMatchList();
  }, [leagueIds, matchType]);
  return (
    <div className={styles.wrapper}>
      <MatchTypeTab type={matchType} onChange={setMatchType} />
      <FilterTab
        dateType={dateType}
        displayType={displayType}
        onDateTypeChange={setDateType}
        onDisplayTypeChange={setDisplayType}
        onLeagueChange={setLeagueIds}
      />
      <div className={styles.downloadWrapper}>
        <DownloadTip />
      </div>
      <Ad style={{ marginTop: '6px' }} />
      <Spin spinning={isMatchListLoading}>
        <div className={styles.list}>
          {matches.length > 0 && (
            <Matches
              data={matches}
              showEnded={dateType === 'today'}
              displayType={displayType}
              setParams={setParams}
            />
          )}
          {matches.length === 0 && !isMatchListLoading && <MEmpty />}
        </div>
      </Spin>
    </div>
  );
}
