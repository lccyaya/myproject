import { Row } from 'antd';
import Carousel from '@/components/Carousel';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import styles from './top.less';
import type { matchType } from '@/services/matchPage';
import type { tipsType, topDatum } from '@/services/home';
import { getTop } from '@/services/home';
import { useEffect, useState } from 'react';
import { FormattedMessage } from '@@/plugin-locale/localeExports';
import type { Highlight as HighlightType, MatchDetails } from '@/services/match';
import moment from 'moment';
import MatchLive from '@/components/MatchLive';
import type * as newsService from '@/services/news';
import { Link } from 'umi';
import BizNews from '@/components/BizNews';
import { CaretRightOutlined } from '@ant-design/icons';
import { formatDuration } from '@/utils/utils';
import Header from '@/pages/Home/pc/components/header';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { playgroundCovers } from '@/pages/Highlight/playground_cover';
import { Empty } from '@/base-components/pc';
function HotNewsItem(props: { index: number; data: newsService.News }) {
  const { index, data } = props;
  const date = moment(data.source_published_at).format('YYYY/MM/DD HH:mm');
  const [previewVisible, setPreviewVisible] = useState(false);
  const lang = toShortLangCode(locale.getLocale());
  return (
    <Link
      to={`/${lang}/newsdetail/${data.ID}`}
      className={styles.item}
      onMouseEnter={() => setPreviewVisible(true)}
      onMouseLeave={() => setPreviewVisible(false)}
    >
      <div className={styles.seq}>{index + 1}</div>
      <div className={styles.title}>{data.title}</div>
      <div className={styles.views}>{data.visit}</div>
      {previewVisible && (
        <div className={styles.preview}>
          <div className={styles.previewTitle}>{data.title}</div>
          <div className={styles.date}>{date}</div>
          <div className={styles.content}>{data.description}</div>
        </div>
      )}
    </Link>
  );
}

function News(props: { latest: newsService.News[]; hot: newsService.News[] }) {
  const { latest, hot } = props;
  const lang = toShortLangCode(locale.getLocale());
  return (
    <div className={styles.news}>
      <div className={styles.latest}>
        <Header title={<FormattedMessage id="key_latest_news" />} morePath={`/${lang}/news`} />
        <div className={styles.latestWrapper}>
          {latest.length > 0 ? (
            <Link className={styles.large} to={`/${lang}/newsdetail/${latest[0]?.ID}`}>
              <div
                className={styles.bg}
                style={{ backgroundImage: `url(${latest[0]?.cover_img_url})` }}
              />
              <div className={styles.title}>
                <div className={styles.titleWrapper}>{latest[0]?.title}</div>
              </div>
            </Link>
          ) : null}
          <div className={styles.list}>
            {latest.slice(1).map((n, i) => (
              <BizNews
                reportCate={REPORT_CATE.home}
                reportAction={REPORT_ACTION.news_detail}
                replaceCurrent
                key={n.ID}
                news={n}
                noPaddingBottom
                noPaddingTop={i === 0}
                borderBottom
                hideViewer
                hideSupporter
                style={{ paddingTop: '8px' }}
                titleHoverEffect
              />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.hot}>
        <Header title={<FormattedMessage id="key_hot_news" />} hideMore />
        <div className={styles.hotWrapper}>
          {hot.map((d, i) => (
            <HotNewsItem key={d.ID} data={d} index={i} />
          ))}
          { hot.length === 0 ? <Empty/> : null }
        </div>
      </div>
    </div>
  );
}

function Highlight(props: { data: (HighlightType & { match_id: number })[] }) {
  const lang = toShortLangCode(locale.getLocale());
  return (
    <div className={styles.highlight}>
      <Header title={<FormattedMessage id="key_highlight" />} morePath={`/${lang}/highlight`} />
      <div className={styles.highlightWrapper}>
        {props.data.map((d) => (
          <Link to={`/${lang}/details/${d.match_id}`} key={d.ID} className={styles.item}>
            <div
              className={styles.top}
              style={{
                backgroundImage: d.cover_img_url
                  ? `url(${d.cover_img_url})`
                  : `url(${playgroundCovers[0]})`,
              }}
            >
              <div className={styles.playIcon}>
                <CaretRightOutlined className={styles.icon} />
              </div>
              <div className={styles.duration}>
                <CaretRightOutlined className={styles.icon} />
                <div className={styles.text}>{formatDuration(d.duration)}</div>
              </div>
            </div>
            <div className={styles.bottom}>{d.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function TopLeagueAndTeam(props: { compact?: boolean }) {
  const [data, setData] = useState<{ league: topDatum[]; team: topDatum[] }>({
    league: [],
    team: [],
  });
  const getData = async () => {
    const res = await Promise.all([getTop({ tab: 'leagues' }), getTop({ tab: 'teams' })]);
    const d: typeof data = {
      league: [],
      team: [],
    };
    if (res[0].success) {
      d.league = res[0].data.list;
    }
    if (res[1].success) {
      d.team = res[1].data.list;
    }
    setData(d);
  };
  useEffect(() => {
    getData();
  }, []);
  const renderList = (list: topDatum[], type: 'league' | 'team') => {
    return list.map((d) => {
      const path = type === 'league' ? `info?id=${d.id}` : `teamdetails/${d.id}`;
      return (
        <Link to={path} key={d.id}>
          <img className={styles.img} src={d.logo} />
        </Link>
      );
    });
  };
  if (data.league.length + data.team.length === 0) {
    return null;
  }
  return (
    <div className={`${styles.topLeagueAndTeam} ${props.compact ? styles.compact : ''}`}>
      <div className={styles.item}>
        <div className={styles.left}>
          <p>
            <FormattedMessage id="key_hot" />
          </p>
          <p>
            <FormattedMessage id="key_teams" />
          </p>
        </div>
        <div className={styles.right}>{renderList(data.team, 'team')}</div>
      </div>
      <div className={styles.border} />
      <div className={styles.item}>
        <div className={styles.left}>
          <p>
            <FormattedMessage id="key_hot" />
          </p>
          <p>
            <FormattedMessage id="key_leagues" />
          </p>
        </div>
        <div className={styles.right}>{renderList(data.league, 'league')}</div>
      </div>
    </div>
  );
}

function VideoLive(props: { match: MatchDetails }) {
  const {
    match_time,
    minutes,
    home_team_logo,
    home_team_name,
    away_team_logo,
    away_team_name,
    final_scores,
    match_id,
  } = props.match;
  const date = moment(match_time * 1000).format('DD/MM HH:mm');
  const lang = toShortLangCode(locale.getLocale());
  return (
    <div className={styles.videoLive}>
      <div className={styles.left}>
        <MatchLive matchList={[props.match]} onlyOne hideVideoTitle videoHeight="210px" />
      </div>
      <Link className={styles.right} to={`/${lang}/details/${match_id}`}>
        <div className={styles.header}>
          <span>{date}</span>
          <span className={styles.minutes}>{minutes}</span>
        </div>
        <div className={styles.team}>
          <img className={styles.logo} src={home_team_logo} />
          <div className={styles.name}>{home_team_name}</div>
        </div>
        <div className={styles.score}>
          {final_scores.home}:{final_scores.away}
        </div>
        <div className={styles.team}>
          <img className={styles.logo} src={away_team_logo} />
          <div className={styles.name}>{away_team_name}</div>
        </div>
      </Link>
    </div>
  );
}

export default function VersionATop(props: {
  liveMatch: MatchDetails | undefined;
  majorMatchData: matchType[];
  setMajorMatchData: (data: matchType[]) => void;
  oddsVisible: boolean;
  tipsData: tipsType[];
  handleChangeLiveMatch: (id: number) => void;
  newsData: newsService.News[];
  hotNewsData: newsService.News[];
  highlightData: (HighlightType & { match_id: number })[];
  showTips?: boolean;
}) {
  const {
    majorMatchData,
    oddsVisible,
    tipsData,
    handleChangeLiveMatch,
    setMajorMatchData,
    liveMatch,
    newsData,
    hotNewsData,
    highlightData,
    showTips,
  } = props;

  const topLeagueAndTeamCompactLayout =
    majorMatchData.length === 1 || (majorMatchData.length <= 3 && !liveMatch);
  const majorMatchCardCountPerScreen = Math.min(majorMatchData.length, liveMatch ? 3 : 5);
  return (
    <>
      <div className={styles.topContainer}>
        {majorMatchData && majorMatchData.length > 0 && (
          <Row className={styles.matchesContainer}>
            <div className={styles.matchesContent}>
              {majorMatchData && majorMatchData.length > 0 ? (
                <Carousel
                  hideOdds={!oddsVisible}
                  reportCate={REPORT_CATE.home}
                  tipsData={showTips ? tipsData : []}
                  data={majorMatchData}
                  handleChangeLiveMatch={handleChangeLiveMatch}
                  columns={majorMatchCardCountPerScreen}
                  autoPlay={false}
                  customDots={(r, pages, index) => {
                    const prevDisabled = index === 0;
                    const nextDisabled = index === pages - 1;
                    return (
                      <div className={styles.arrowWrapper}>
                        <div
                          className={`${styles.arrow} ${nextDisabled ? styles.disabled : ''}`}
                          onClick={() => {
                            if (!nextDisabled) {
                              r?.next();
                            }
                          }}
                        />
                        <div
                          className={`${styles.arrow} ${prevDisabled ? styles.disabled : ''}`}
                          onClick={() => {
                            if (!prevDisabled) {
                              r?.prev();
                            }
                          }}
                        />
                      </div>
                    );
                  }}
                  setParams={(id: number, bool: boolean) => {
                    const sameMatch = majorMatchData.find((m: any) => m.match_id === id);
                    if (sameMatch) {
                      sameMatch.subscribed = bool;
                      const cloned = JSON.parse(JSON.stringify(majorMatchData));
                      setMajorMatchData(cloned);
                    }
                  }}
                />
              ) : null}
            </div>
          </Row>
        )}
        {topLeagueAndTeamCompactLayout && <TopLeagueAndTeam compact />}
        {Boolean(liveMatch) && <VideoLive match={liveMatch!} />}
      </div>
      {!topLeagueAndTeamCompactLayout && <TopLeagueAndTeam />}
      <News latest={newsData} hot={hotNewsData} />
      <Highlight data={highlightData} />
    </>
  );
}
