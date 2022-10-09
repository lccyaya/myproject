import { connect, FormattedMessage, Link, useSelector } from 'umi';
import type { ComponentProps } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { Col, Row } from 'antd';
import type { ConnectState } from '@/models/connect';
import MatchListA from '../../components/MatchList';
import MatchListB from '../../components/MatchListB';
import Banner from '../../components/Banner';
import type { majorMatchType, tipsType } from '@/services/home';
import * as homeService from '@/services/home';
import type { matchType } from '@/services/matchPage';
import * as matchService from '@/services/matchPage';
import type { Highlight as HighlightType, MatchDetails } from '@/services/match';
import { matchDetails } from '@/services/match';
import DataList from './DataList';
import { REPORT_CATE } from '@/constants';
import { checkIsPhone, toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import * as newsService from '@/services/news';
import MobileHome from '@/pages/Home/mobile';
import { getMatchStatus, MatchStatus } from '@/utils/match';
import { fetchLatestHighlight } from '@/services/highlight';
import VersionATop from '@/pages/Home/pc/version-a/top';
import VersionBTop from '@/pages/Home/pc/version-b/top';
import NewHome from "./pc";

import styles from './index.less';

// const { CheckableTag } = Tag;

export const statesPrams = {
  1: 'subscribe',
  2: 'going',
  3: 'going',
  4: 'going',
  5: 'going',
  6: 'going',
  7: 'going',
  8: 'finish',
  9: 'subscribe',
  10: 'finish',
  11: 'finish',
  12: 'finish',
  13: 'subscribe',
};

function MatchList(props: ComponentProps<typeof MatchListB> & { abTestVersion: 'A' | 'B' | '' }) {
  // if (!props.abTestVersion) {
  //   return null;
  // }
  // props.abTestVersion === 'A' ? <MatchListA {...props} /> :
  return <MatchListB {...props} />;
}

type HomeProps = {
  isPhone?: boolean;
  showTips?: boolean;
  hideLoading?: boolean;
};

const Home: React.FC<HomeProps> = (props) => {
  const [tipsData, setTipsData] = useState<tipsType[]>([]);
  const [majorMatchData, setMajorMatchData] = useState<matchType[]>([]);
  const [newsData, setNewsData] = useState<newsService.News[]>([]);
  const [hotNewsData, setHotNewsData] = useState<newsService.News[]>([]);
  const [highlightData, setHighlightData] = useState<(HighlightType & { match_id: number })[]>([]);
  const [liveMatchId, setLiveMatchId] = useState<number>(0);
  const liveMatchIdRef = useRef(liveMatchId);
  liveMatchIdRef.current = liveMatchId;
  const [isBanner, setIsBanner] = useState<boolean>(false);
  const [oddsVisible, setOddsVisible] = useState(false);
  const [tabType, setTabType] = useState('1');
  const [tabKey, setTabKey] = useState('tab_type');

  const containerRef = React.createRef<HTMLDivElement>();
  const [liveMatch, setLiveMatch] = useState<MatchDetails | undefined>();

  const abTestVersion = useSelector<ConnectState, ConnectState['abtest']['version']>(
    (s) => s.abtest.version,
  );

  const liveMatchTimer = useRef<number | undefined>();

  const getLiveMatchDetail = async () => {
    const res = await matchDetails({ match_id: liveMatchIdRef.current });
    let pull = true;
    if (res.success) {
      setLiveMatch(res.data);
      const status = getMatchStatus(res.data.status);
      if (status !== MatchStatus.Going) {
        pull = false;
      }
    }
    if (pull) {
      liveMatchTimer.current = window.setTimeout(() => {
        getLiveMatchDetail();
      }, 10000);
    }
  };

  const getTipsData = async () => {
    const result = await homeService.getTipData();
    if (result.success) {
      if (result.data.tips && result.data.tips.length > 0) {
        setTipsData(result.data.tips);
      }
    }
  };

  const getMajorData = async () => {
    const result = await homeService.getMajorData();
    if (result.success && result.data && result.data.matches) {
      const majorMatchList = result.data.matches.map((ele) => {
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        ele.match.vote = ele.vote;
        return ele.match;
      });
      setMajorMatchData(majorMatchList);
      if (result.data.matches && result.data.matches.length > 0) {
        const filterMatch = result.data.matches.filter((ele: majorMatchType) => {
          const { status } = ele.match;
          return statesPrams[status] === 'going';
        });
        if (filterMatch && filterMatch.length > 0) {
          // isLiving = true;
          setLiveMatchId(filterMatch[0].match.match_id);
        }
      }
    }
  };

  const filterMatches = (matches: matchType[]) => {
    const filterMath = matches.filter((ele: matchType) => {
      const { status, has_live, normal_live_link, high_live_link } = ele;
      return statesPrams[status] === 'going' && has_live && (normal_live_link || high_live_link);
    });
    return filterMath;
  };

  const getLiveMatch = async () => {
    const today = new Date().setHours(0, 0, 0, 0);

    const result = await matchService.fetchLiveMatchList({
      timestamp: Math.floor(today / 1000),
      page: 1,
      size: 10,
    });

    if (result.success && result.data.matches && result.data.matches.length > 0) {
      const filterMatch = filterMatches(result.data.matches);
      if (filterMatch && filterMatch.length > 0) {
        setLiveMatchId(filterMatch[0].match_id);
      }
    }
  };

  const getNewList = async () => {
    const res = await Promise.all([
      newsService.fetchNewsList({ page: 1, size: 5 }),
      newsService.fetchHotNewsList(),
    ]);
    if (res[0].success) {
      setNewsData(res[0].data.news);
    }
    if (res[1].success) {
      setHotNewsData(res[1].data.slice(0, 10));
    }
  };

  const getHighlightData = async () => {
    const res = await fetchLatestHighlight(1, 4);
    if (res.success) {
      setHighlightData(res.data.high_lights);
    }
  };

  const handleChangeLiveMatch = (id: number) => {
    setLiveMatchId(id);
    // setImmediately(true);
  };

  const handleMatchListTypeChange = (type: 'Index' | 'Score') => {
    setOddsVisible(type === 'Index');
  };

  const init = () => {
    getTipsData();
    getMajorData();
    getNewList();
    getLiveMatch();
    getHighlightData();
  };

  useEffect(() => {
    clearTimeout(liveMatchTimer.current);
    if (liveMatchId) {
      getLiveMatchDetail();
    } else {
      setLiveMatch(undefined);
    }
  }, [liveMatchId]);

  useEffect(() => {
    init();
    return () => {
      clearTimeout(liveMatchTimer.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const lang = toShortLangCode(locale.getLocale());

  const handleTabTypeChange = (type: any, key: string) => {
    setTabType(type);
    setTabKey(key);
  };
  return (
    <div ref={containerRef} className={styles.main}>
      <Row className={classnames(isBanner ? styles.showBanner : styles.noBanner)}>
        <Col span={24}>
          <Banner setIsBanner={setIsBanner} />
        </Col>
      </Row>
      {/* {abTestVersion === 'A' && (
        
      )} */}
      <VersionATop
        liveMatch={liveMatch}
        majorMatchData={majorMatchData}
        setMajorMatchData={setMajorMatchData}
        tipsData={tipsData}
        handleChangeLiveMatch={handleChangeLiveMatch}
        highlightData={highlightData}
        hotNewsData={hotNewsData}
        newsData={newsData}
        oddsVisible={oddsVisible}
        showTips={props.showTips}
      />

      {/* {abTestVersion === 'B' && <VersionBTop majorMatchData={majorMatchData} />} */}
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.matchTitleContainer}>
            <div className={styles.matchText}>
              <FormattedMessage id="key_match" />
            </div>
            <div className={styles.moreCol}>
              <div className={styles.line} />
              <Link
                className={styles.more}
                to={`/${lang}/${tabType === '1' ? 'live' : `match?type=${tabType}&key=tab_type`}`}
              >
                <FormattedMessage id="key_more" />
                <div className={styles.arrow} />
              </Link>
            </div>
          </div>
          <Row>
            <Col span={24}>
              <MatchList
                onTabTypeChange={handleTabTypeChange}
                onTypeChange={handleMatchListTypeChange}
                handleChangeLiveMatch={handleChangeLiveMatch}
                reportCate={REPORT_CATE.home}
                // ssrMatchList={[]}
                hideLoading={props.hideLoading}
                abTestVersion={abTestVersion}
              />
            </Col>
          </Row>
        </div>
        <div className={styles.right}>
          <>
            <Row className={styles.tipsTitle}>
              <div className={styles.tips}>
                <FormattedMessage id="key_data" />
              </div>
            </Row>
            <DataList />
          </>
        </div>
      </div>
    </div>
  );
};



const Comp = checkIsPhone() ? MobileHome : NewHome;

export default connect(({ divice, tips }: ConnectState) => ({
  isPhone: divice.isPhone,
  showTips: tips.showTips,
}))(Comp);
