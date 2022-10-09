import styles from './index.less';
import { checkIsPhone, formatDuration } from '@/utils/utils';
import { CaretRightOutlined, DownOutlined, LoadingOutlined } from '@ant-design/icons';
import LeagueTeamFilter, {
  getPersistSelectedData,
  setPersistSelectedData,
} from '@/pages/Highlight/league-team-filter';
import { useEffect, useRef, useState } from 'react';
import { Spin } from 'antd';
import type { HighlightWithMatch, HighlightFilterWithAbbr } from '@/services/highlight';
import {
  fetchAllHighlight,
  fetchLeagueFilter,
  fetchWeekTrendingHighlight,
} from '@/services/highlight';
import { FormattedMessage, useHistory } from 'umi';
import type { TopInfo } from '@/services/news';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { isServer } from '@/utils/env';

import { playgroundCovers } from '@/pages/Highlight/playground_cover';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';

// const fiveLeague = [{
//   id: 82,
//   key: 'League EPL',
// }, {
//   id: 120,
//   key: 'League La Liga',
// }, {
//   id: 108,
//   key: 'League Serie A',
// }, {
//   id: 129,
//   key: 'League Bundesliga',
// }, {
//   id: 46,
//   key: 'League UEFA UCL',
// }];

export const getCover = (() => {
  let index = 0;
  return () => {
    const i = index;
    index = (i + 1) % playgroundCovers.length;
    return playgroundCovers[i];
  };
})();

function Card(props: {
  title: string;
  cover: string;
  duration: number;
  matchId: number;
  large?: boolean;
  reportTag?: string;
}) {
  const history = useHistory();
  const handleClick = () => {
    report({
      cate: REPORT_CATE.highlight,
      action: REPORT_ACTION.version_a_highlight_click,
      tag: props.reportTag,
    });
    const lang = toShortLangCode(locale.getLocale());
    history.push(`/${lang}/details/${props.matchId}`);
  };
  return (
    <div className={`${styles.card} ${props.large ? styles.large : ''}`} onClick={handleClick}>
      <div className={styles.cardWrapper}>
        <div className={styles.thumb}>
          <img className={styles.img} src={props.cover || getCover()} loading="lazy" alt="" />
          <div className={styles.duration}>
            <div className={styles.icon} />
            <div className={styles.text}>{formatDuration(props.duration)}</div>
          </div>
        </div>
        <div className={styles.title}>
          <div className={styles.titleWrapper}>{props.title}</div>
        </div>
        <div className={styles.playIcon}>
          <CaretRightOutlined className={styles.icon} />
        </div>
      </div>
    </div>
  );
}

function Recommend() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<(TopInfo & { duration: number })[]>([]);
  const getData = async () => {
    const res = await fetchWeekTrendingHighlight();
    if (res.success) {
      setData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);
  const isPhone = checkIsPhone();

  return (
    <div className={`${styles.recommend} ${!isPhone ? styles.pc : ''}`}>
      <div className={styles.header}>
        <div className={styles.blockTitle}>
          <div className={styles.left}>
            <FormattedMessage id="key_trending_this_week" />
          </div>
        </div>
      </div>
      <Spin spinning={loading}>
        <div className={styles.body}>
          {Boolean(data[0]) && (
            <Card
              large
              reportTag="hot"
              matchId={data[0].id}
              title={data[0].title}
              cover={data[0].cover_img_url}
              duration={data[0].duration}
            />
          )}
          <div className={styles.list}>
            {data.slice(1, 5).map((d) => (
              <Card
                key={d.id}
                reportTag="hot"
                matchId={d.id}
                title={d.title}
                cover={d.cover_img_url}
                duration={d.duration}
              />
            ))}
          </div>
        </div>
      </Spin>
    </div>
  );
}

function BottomLoading(props: { loading: boolean }) {
  const isPhone = checkIsPhone();
  const antIcon = <LoadingOutlined style={{ fontSize: isPhone ? 16 : 24 }} spin />;
  return props.loading ? (
    <div className={styles.bottomLoading}>
      <Spin indicator={antIcon} />
    </div>
  ) : null;
}

const pageSize = 20;

function All() {
  const timer = useRef<number>();
  const [data, setData] = useState<HighlightWithMatch[]>([]);
  const [sortBy, setSortBy] = useState<'time' | 'watchCount'>('time');
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
  const [selectedLeagueIds, setSelectedLeagueIds] = useState<number[]>([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [gotPersistData, setGotPersistData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const [shortcutFilters, setShortcutFilters] = useState<HighlightFilterWithAbbr[]>([]);
  const docEl = useRef(!isServer ? document.documentElement : null);
  const page = useRef(1);
  const dataRef = useRef(data);
  dataRef.current = data;
  const sortByRef = useRef(sortBy);
  sortByRef.current = sortBy;
  const selectedTeamIdsRef = useRef(selectedTeamIds);
  selectedTeamIdsRef.current = selectedTeamIds;
  const selectedLeagueIdsRef = useRef(selectedLeagueIds);
  selectedLeagueIdsRef.current = selectedLeagueIds;
  const doneRef = useRef(done);
  doneRef.current = done;
  const loadingRef = useRef(loading);
  loadingRef.current = loading;
  const headerRef = useRef<HTMLDivElement | null>(null);
  const handleFilterChange = (filter: { teams: number[]; leagues: number[] }) => {
    setSelectedLeagueIds(filter.leagues);
    setSelectedTeamIds(filter.teams);
    setFilterVisible(false);
    setPersistSelectedData(filter);
  };
  const handleShortcutFilterClick = (filter: HighlightFilterWithAbbr) => {
    const i = selectedLeagueIds.indexOf(filter.id);
    let newLeagues: number[] = [];
    if (i > -1) {
      newLeagues = [...selectedLeagueIds.slice(0, i), ...selectedLeagueIds.slice(i + 1)];
    } else {
      newLeagues = [...selectedLeagueIds, filter.id];
      report({
        cate: REPORT_CATE.highlight,
        action: `${filter.name}`,
      });
    }
    setSelectedLeagueIds(newLeagues);
    setPersistSelectedData({
      teams: selectedTeamIds,
      leagues: newLeagues,
    });
  };

  const getShortcutFilters = async () => {
    const res = await fetchLeagueFilter();
    if (res.success) {
      setShortcutFilters(res.data.competition);
    }
  };

  const getData = (reset: boolean, noDelay = false) => {
    clearTimeout(timer.current);
    setLoading(true);
    const curPage = reset ? 1 : page.current;
    timer.current = window.setTimeout(
      async () => {
        const res = await fetchAllHighlight({
          page: curPage,
          size: pageSize,
          order: sortByRef.current === 'time' ? 0 : 1,
          competition_ids: JSON.stringify(selectedLeagueIdsRef.current),
          team_ids: JSON.stringify(selectedTeamIdsRef.current),
        });
        if (res.success) {
          const { data: list, total } = res.data;
          const newData = reset ? list : [...dataRef.current, ...list];
          const reachLast = dataRef.current.length + list.length >= total;
          if (reset) {
            const headerOffsetTop = headerRef.current?.offsetTop ?? 0;
            const stickyGap = 4;
            const top = headerOffsetTop + stickyGap;
            if (docEl.current && docEl.current.scrollTop >= top) {
              window.scrollTo(0, top);
            }
          }
          setDone(reachLast);
          setData(newData);
          if (!reachLast) {
            page.current = curPage + 1;
          }
        }
        setLoading(false);
      },
      noDelay ? 0 : 500,
    );
  };

  const handleWindowScroll = () => {
    if (!docEl.current) return;
    const { scrollTop, scrollHeight, offsetHeight } = docEl.current;
    const reactBottom = scrollTop + offsetHeight >= scrollHeight;
    if (
      reactBottom &&
      !doneRef.current &&
      !loadingRef.current &&
      (/\/highlight$/.test(window.location.pathname) ||
        /\/highlight\/$/.test(window.location.pathname))
    ) {
      getData(false, true);
    }
  };

  const handleSortClick = (sort: typeof sortBy) => {
    setSortBy(sort);
    report({
      cate: REPORT_CATE.highlight,
      action:
        sort === 'time'
          ? REPORT_ACTION.highlight_filter_by_time
          : REPORT_ACTION.highlight_filter_by_plays,
    });
  };

  useEffect(() => {
    if (!gotPersistData) return;
    getData(true, isFirst);
    setIsFirst(false);
  }, [selectedLeagueIdsRef.current, selectedTeamIdsRef.current, sortByRef.current, gotPersistData]);

  useEffect(() => {
    getShortcutFilters();
    const persistData = getPersistSelectedData();
    setSelectedTeamIds(persistData.teams);
    setSelectedLeagueIds(persistData.leagues);
    setGotPersistData(true);
    window.addEventListener('scroll', handleWindowScroll);
    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, []);

  const isPhone = checkIsPhone();

  const leagueFilter = (
    <div className={styles.leagues}>
      <div className={styles.left}>
        {shortcutFilters.map((l) => (
          <div
            className={`${styles.league} ${selectedLeagueIds.includes(l.id) ? styles.active : ''}`}
            onClick={() => handleShortcutFilterClick(l)}
            key={l.id}
          >
            {l.name_abbr}
          </div>
        ))}
      </div>
      <div className={styles.right}>
        <DownOutlined className={styles.icon} onClick={() => setFilterVisible(true)} />
      </div>
    </div>
  );

  return (
    <div className={`${styles.all} ${!isPhone ? styles.pc : ''}`} ref={headerRef}>
      <div className={styles.header}>
        <div className={styles.blockTitle}>
          <div className={styles.left}>
            <FormattedMessage id="key_highlight" />
            {!isPhone && leagueFilter}
          </div>
          <div className={styles.right}>
            <div
              className={`${styles.item} ${sortBy === 'time' ? styles.active : ''}`}
              onClick={() => handleSortClick('time')}
            >
              <FormattedMessage id="key_sort_by_time" />
            </div>
            <div className={styles.line} />
            <div
              className={`${styles.item} ${sortBy === 'watchCount' ? styles.active : ''}`}
              onClick={() => handleSortClick('watchCount')}
            >
              <FormattedMessage id="key_sort_by_plays" />
            </div>
          </div>
        </div>
        {isPhone && leagueFilter}
      </div>
      <Spin spinning={loading}>
        <div className={styles.body}>
          {data.map((d) => (
            <Card
              key={d.ID}
              title={d.title}
              cover={d.cover_img_url}
              duration={d.duration}
              matchId={d.match_id}
            />
          ))}
        </div>
        <BottomLoading loading={loading && data.length > 0} />
      </Spin>

      <LeagueTeamFilter
        selectedLeagues={selectedLeagueIds}
        selectedTeams={selectedTeamIds}
        onChange={handleFilterChange}
        onCancel={() => setFilterVisible(false)}
        visible={filterVisible}
      />
    </div>
  );
}

export default function Highlight() {
  const isPhone = checkIsPhone();
  return (
    <div className={`${styles.wrapper} ${!isPhone ? styles.pc : ''}`}>
      <Recommend />
      <All />
    </div>
  );
}
