import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import classnames from 'classnames';
import { Spin, Row } from 'antd';
import { connect, FormattedMessage, Link } from 'umi';
import type { ConnectState } from '@/models/connect';
import styles from './index.less';
import * as matchService from '@/services/matchPage';
import { Switch, IconButton } from '@/base-components/pc';
import type { matchType as matchTypeObject } from '@/services/matchPage';
import { MatchCard, League } from '@/func-components/pc';
import {
  MatchCard as MatchCardMobile,
  League as LeagueMobile,
  BottomIcon,
} from '@/func-components/mobile';
import { getDateData } from '../../components/MatchList';
import LoginModal from '@/components/MatchCard/Login';
import type { UserInfoType } from '@/services/user';
import { checkIsPhone, toShortLangCode } from '@/utils/utils';
import type { matchType } from '@/services/matchPage';
import MatchLive from '@/components/MatchLive';
import { REPORT_CATE } from '@/constants';
import CallAppModal from '@/components/OpenApp/CallAppModal';
import { useIntl } from '@@/plugin-locale/localeExports';
import { locale } from '@/app';
import findIndex from 'lodash/findIndex';
import { useLocalStorageState } from 'ahooks';
import { STORAGE_INDEX_VALUE, SESS_STORAGE_SELECTED_LEAGUES, getSessionStorage } from '@/constants';
import { handleReport } from '@/utils/report';

export type sameDayMatch = {
  date: number;
  matches: matchTypeObject[];
};

function handleLiveList(list: matchService.matchList) {
  return getDateData(sortMatchList(list.matches));
}

function sortMatchList(list: matchService.matchType[]) {
  return list.sort((a, b) => {
    return a.match_time - b.match_time;
  });
}

type IProps = {
  currentUser?: UserInfoType | null;
  isPhone?: boolean;
  ssrLiveList?: matchService.matchList;
  hideLoading?: boolean;
};

// 指数联赛的选择
const SelectFunc = (props: any) => {
  const [isReady, setReady] = useState(false);
  const { setLeagueShow, competition_ids, intl, isPhone, indexVal, setIndexVal } = props;
  // const [subindexVal, subsetIndexVal] = useLocalStorageState(STORAGE_INDEX_VALUE, { defaultValue: false });
  // 底部点击
  const onBottomClick = () => {
    setIndexVal(!indexVal);
  };
  const icons = indexVal
    ? {
        type: 'icon-tubiao_zhishu',
        color: '#ffffff',
        bg: '#FA5900',
      }
    : { type: 'icon-tubiao_zhishu', color: '#999' };
  useEffect(() => {
    setReady(true);
  }, []);
  if (!isReady) {
    return null;
  }
  return (
    <>
      {isPhone ? (
        <>
          <IconButton
            onClick={() => setLeagueShow(true)}
            active={competition_ids?.length > 0 ? true : false}
            icon="icon-bisai"
            title={intl.formatMessage({ id: 'key_league', defaultMessage: 'key_league' })}
          />
          {/* <BottomIcon onClick={onBottomClick} className={styles.bottom_icon} icons={[icons]} /> */}
        </>
      ) : (
        <>
          <IconButton
            onClick={() => setLeagueShow(true)}
            active={competition_ids?.length > 0 ? true : false}
            icon="icon-bisai"
            title={intl.formatMessage({ id: 'key_league', defaultMessage: 'key_league' })}
          />
          <Switch
            title={intl.formatMessage({ id: 'key_index' })}
            value={indexVal}
            onChange={(e: any) => {
              handleReport({ action: e ? 'open_index' : 'close_index' });
              setIndexVal(e);
              subsetIndexVal(e);
            }}
          />
        </>
      )}
    </>
  );
};

// live 无数据
function LiveEmpty() {
  return (
    <div className={styles.liveEmpty}>
      <div className={styles.text}>
        <FormattedMessage id="key_no_game_in_progress" />
      </div>
    </div>
  );
}

const Matches = (props: {
  matches: matchService.matchType[];
  indexVal: boolean;
  setParams: (id: number, bool: boolean) => void;
}) => {
  const { matches, indexVal, setParams } = props;
  const isPhone = checkIsPhone();
  return (
    <Row className={classnames(styles.listContainer, styles.liveListContainer)}>
      <div className={styles.card_box}>
        {matches.map((d: matchTypeObject) => {
          return isPhone ? (
            <MatchCardMobile data={d} key={d.match_id} type={indexVal ? 'index' : 'score'} />
          ) : (
            <MatchCard data={d} key={d.match_id} type={indexVal ? 'index' : 'score'} />
          );
        })}
      </div>
    </Row>
  );
};

function UpcomingTip() {
  return (
    <div className={`${styles.upcomingMatchTip}`}>
      <div className={styles.icon} />
      <div className={styles.text}>
        <FormattedMessage id="key_upcoming_matches" />
      </div>
    </div>
  );
}

const Live: React.FC<IProps> = React.memo((props) => {
  const [indexVal, setIndexVal] = useLocalStorageState(STORAGE_INDEX_VALUE, {
    defaultValue: false,
  });
  const { hideLoading } = props;
  const [liveList, setLiveList] = useState<ReturnType<typeof handleLiveList>>([]);
  const [matchList, setMatchList] = useState<matchType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loginVisible, setLoginVisible] = useState<boolean>(false);
  const [livePage, setLivePage] = useState<number>(1);
  const [leagueShow, setLeagueShow] = useState(false); // league 是否显示
  const [competition_ids, setCompetitionIds] = useState(
    getSessionStorage(SESS_STORAGE_SELECTED_LEAGUES, '[]'),
  );
  // const [switchType, setSwitchType] = useState<string>('Score');

  const [canPlayLiveMatches, setCanPlayLiveMatches] = useState<matchType[]>([]);

  const liveTimer = useRef<number>();
  const isPhone = checkIsPhone();

  const intl = useIntl();

  const getLiveList = async (p: number, competition_ids: any) => {
    const currentTime = new Date().getTime();
    const params = {
      tab_type: 1,
      zone: 8,
      timestamp: Math.floor(currentTime / 1000),
      page: p,
      size: 20,
      competition_ids,
    };
    const result = await matchService.MatchListV3(params);
    if (result.success) {
      const cantPlay: matchType[] = [];
      const canPlay: matchType[] = [];
      const matches = result.data.matches;
      matches.forEach((m) => {
        const playable =
          [2, 3, 4, 5, 6, 7].includes(m.status) &&
          ((m.has_live && (m.normal_live_link || m.high_live_link)) || m.live_animation_link);
        if (playable) {
          canPlay.push(m);
        } else {
          cantPlay.push(m);
        }
      });
      cantPlay.sort((a, b) => a.match_time - b.match_time);
      const now = Math.floor(Date.now() / 1000);
      const source = isPhone ? matches : cantPlay;
      const upcomingIndex = findIndex(source, (m) => m.match_time > now);
      let final = handleLiveList({ matches: source.slice(0, upcomingIndex) });
      setCanPlayLiveMatches(canPlay.sort((a, b) => a.match_time - b.match_time));
      // if (bool) {
      //   final = liveList.concat(final);
      //   setLivePage(p);
      // }
      if (upcomingIndex === -1) {
        setMatchList([]);
      } else {
        setMatchList(source.slice(upcomingIndex));
      }
      setLiveList(final);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handleUpcomingMatchSetParams = useCallback(
    (id: number, bool: boolean) => {
      const index = matchList.findIndex((m) => m.match_id === id);
      if (index < 0) return;
      const newData = [
        ...matchList.slice(0, index),
        {
          ...matchList[index],
          subscribed: bool,
        },
        ...matchList.slice(index + 1),
      ];
      setMatchList(newData);
    },
    [matchList],
  );

  const handleSetParams = useCallback(
    (id: number, bool: boolean) => {
      let dateIndex = -1;
      let matchIndex = -1;
      const found = liveList.some((d, index) => {
        const i = d.matches.findIndex((m) => m.match_id === id);
        if (i > -1) {
          dateIndex = index;
          matchIndex = i;
          return true;
        }
        return false;
      });

      if (!found) return;
      const { matches } = liveList[dateIndex];
      liveList[dateIndex].matches = [
        ...matches.slice(0, matchIndex),
        {
          ...matches[matchIndex],
          subscribed: bool,
        },
        ...matches.slice(matchIndex + 1),
      ];

      setLiveList([...liveList]);
    },
    [liveList],
  );

  // 联赛确认点击
  const onLeagueSubmit = (e: any) => {
    console.log('联赛结果', e);
    setCompetitionIds(e);
    getLiveList(1, e);
    clearInterval(liveTimer.current);
    liveTimer.current = window.setInterval(() => getLiveList(1, e), 10000);
    // onParamsChange({ competition_ids: e });
  };

  useEffect(() => {
    setLoading(!hideLoading);
    getLiveList(livePage, competition_ids);
    liveTimer.current = window.setInterval(() => getLiveList(1, competition_ids), 10000);

    return () => {
      clearInterval(liveTimer.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showLiveVideo = !isPhone && canPlayLiveMatches.length > 0;
  const lang = toShortLangCode(locale.getLocale());
  console.log(indexVal, 'indexVal');
  return (
    <>
      <div>
        <Spin spinning={loading}>
          {/* {isPhone ? <CallAppModal title={intl.formatMessage({ id: 'key_watch_in_app' })} /> : null} */}
          <LoginModal
            visible={loginVisible}
            onLogin={() => {
              setLoginVisible(false);
            }}
            onCancel={() => {
              setLoginVisible(false);
            }}
          />
          <div
            className={classnames(styles.main, canPlayLiveMatches.length === 1 ? styles.min : null)}
          >
            <Row className={styles.switchRow}>
              <SelectFunc
                setLeagueShow={(e) => {
                  setLeagueShow(e);
                  handleReport({ action: 'league_filter' });
                }}
                competition_ids={competition_ids}
                intl={intl}
                isPhone={isPhone}
                indexVal={indexVal}
                setIndexVal={(e) => {
                  setIndexVal(e);
                  handleReport({ action: e ? 'open_index' : 'close_index' });
                }}
              />
            </Row>
            <Row className={classnames(isPhone ? styles.phone : '')}>
              {showLiveVideo && (
                <MatchLive
                  reportCate={REPORT_CATE.live}
                  matchList={canPlayLiveMatches}
                  indexView={indexVal}
                />
              )}
              <div className={styles.scrollContainer}>
                {liveList && liveList.length > 0
                  ? liveList.map((ele) => {
                      const key = ele.date;
                      return (
                        <Matches
                          matches={ele.matches}
                          key={key}
                          indexVal={indexVal}
                          setParams={handleSetParams}
                        />
                      );
                    })
                  : null}
                {/* <LiveEmpty /> */}
                {!loading && canPlayLiveMatches.length + liveList.length === 0 && <LiveEmpty />}
                {!loading && matchList.length > 0 ? <UpcomingTip /> : null}
                <Matches
                  matches={matchList}
                  indexVal={indexVal}
                  setParams={handleUpcomingMatchSetParams}
                />
                {!loading && (
                  <Link to={`/${lang}/match?type=all`} className={styles.upcomingMore}>
                    <FormattedMessage id="key_more" />
                  </Link>
                )}
              </div>
            </Row>
          </div>
        </Spin>
      </div>
      {/* 联赛选择 */}
      {isPhone ? (
        <LeagueMobile
          visible={leagueShow}
          onSubmit={onLeagueSubmit}
          onClose={() => setLeagueShow(false)}
        />
      ) : (
        <League
          visible={leagueShow}
          onSubmit={onLeagueSubmit}
          onClose={() => setLeagueShow(false)}
        />
      )}
    </>
  );
});

export default connect(({ user, divice }: ConnectState) => ({
  currentUser: user.currentUser,
  isPhone: divice.isPhone,
}))(Live);
