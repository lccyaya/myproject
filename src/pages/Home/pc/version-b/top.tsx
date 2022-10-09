import type { matchType } from '@/services/matchPage';
import type { ReactNode } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './top.less';
import Header from '@/pages/Home/pc/components/header';
import { FormattedMessage, Link, useIntl } from 'umi';
import { getMatchStatus, MatchStatus } from '@/utils/match';
import { formatTime } from '@/pages/Home/mobile/version-a/major-match';
import playIcon from '@/assets/icon/play.png';
import starIcon from '@/assets/icon/star.png';
import { playgroundCovers } from '@/pages/Highlight/playground_cover';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';

const getCover = (index: number) => {
  return playgroundCovers[index % playgroundCovers.length];
};

function groupData<T>(ary: T[], size: number): T[][] {
  return ary.reduce((p, c) => {
    if (p[p.length - 1]?.length < size) {
      p[p.length - 1].push(c);
    } else {
      p.push([c]);
    }
    return p;
  }, [] as T[][]);
}

const playback = (
  <div className={styles.video}>
    <img src={playIcon} alt="" className={styles.img} />
    <div className={styles.text}>
      <FormattedMessage id="key_playback" />
    </div>
  </div>
);

const highlight = (
  <div className={styles.video}>
    <img src={starIcon} alt="" className={styles.img} />
    <div className={styles.text}>
      <FormattedMessage id="key_highlight" />
    </div>
  </div>
);

const pageSize = 5;

const SlideItem = React.memo(
  (props: {
    index: number;
    item: matchType;
    expand: boolean;
    onHover: (index: number) => void;
    onLeave: (index: number) => void;
  }) => {
    const { item, index, expand, onHover, onLeave } = props;
    const fmtMsg = useIntl().formatMessage;
    const status = getMatchStatus(item.status);
    let statusText = '';
    const detailVideo: ReactNode[] = [];
    if (status !== MatchStatus.Complete) {
      statusText = formatTime(item.match_time);
    } else {
      if (item.playback_link) {
        statusText = fmtMsg({ id: 'key_playback' });
        detailVideo.push(playback);
      }
      if (item.has_highlight) {
        statusText = fmtMsg({ id: 'key_highlight' });
        if (detailVideo.length) {
          detailVideo.push(<div className={styles.line} />);
        }
        detailVideo.push(highlight);
      }
      if (!detailVideo.length) {
        statusText = fmtMsg({ id: 'key_full_time' });
      }
    }
    const lang = toShortLangCode(locale.getLocale());
    return (
      <Link
        to={`/${lang}/details/${item.match_id}`}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={() => onLeave(index)}
        key={item.match_id}
        className={`${styles.slide} ${expand ? styles.expand : ''}`}
        style={{ backgroundImage: `url(${getCover(index)})` }}
      >
        <div className={styles.content}>
          <div className={styles.previewInfo}>
            <div className={styles.status}>{statusText}</div>
            <div className={styles.teams}>
              <div className={styles.team}>
                <img className={styles.logo} src={item.home_team_logo} alt="" />
                <div className={styles.name}>{item.home_team_name}</div>
              </div>
              <div className={styles.team}>
                <img className={styles.logo} src={item.away_team_logo} alt="" />
                <div className={styles.name}>{item.away_team_name}</div>
              </div>
            </div>
          </div>
          <div className={styles.detailInfo}>
            <div className={styles.title}>
              <div className={styles.status}>{statusText}</div>
              {item.competition_name}
            </div>
            <div className={styles.teams}>
              <div className={styles.team}>
                <div className={styles.name}>{item.home_team_name}</div>
                <img className={styles.logo} src={item.home_team_logo} alt="" />
              </div>
              <div className={styles.score}>
                {[MatchStatus.Going, MatchStatus.Complete].includes(status) ? (
                  <>
                    {item.final_scores.home}
                    <span className={styles.line}>-</span>
                    {item.final_scores.away}
                  </>
                ) : (
                  'VS'
                )}
              </div>
              <div className={`${styles.team} ${styles.reverse}`}>
                <div className={styles.name}>{item.away_team_name}</div>
                <img className={styles.logo} src={item.away_team_logo} alt="" />
              </div>
            </div>
            {detailVideo.length > 0 && <div className={styles.videos}>{detailVideo}</div>}
          </div>
        </div>
      </Link>
    );
  },
);

function Slides(props: {
  itemIndex: number;
  data: matchType[][];
  onHover: (index: number) => void;
  onLeave: (index: number) => void;
}) {
  const { data, itemIndex, onHover, onLeave } = props;
  return (
    <>
      {data.map((group, i) => (
        <div key={i} className={styles.slides}>
          {group.map((item, j) => {
            const curIndex = i * pageSize + j;
            return (
              <SlideItem
                onHover={onHover}
                onLeave={onLeave}
                key={item.match_id}
                item={item}
                index={curIndex}
                expand={curIndex === itemIndex}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

function VersionBTop(props: { majorMatchData: matchType[] }) {
  const { majorMatchData } = props;
  const [total, setTotal] = useState(0);
  const totalRef = useRef(total);
  totalRef.current = total;
  const [pageIndex, setPageIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const itemIndexRef = useRef(itemIndex);
  itemIndexRef.current = itemIndex;
  const timerRef = useRef<number | undefined>();
  const data = groupData(majorMatchData, pageSize);

  const startTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      if (itemIndexRef.current === totalRef.current - 1) {
        setPageIndex(0);
        setItemIndex(0);
      } else {
        const nextIndex = itemIndexRef.current + 1;
        if (nextIndex % pageSize === 0) {
          setPageIndex((p) => p + 1);
        }
        setItemIndex(nextIndex);
      }
      startTimer();
    }, 5000);
  };

  const stopTimer = () => {
    window.clearTimeout(timerRef.current);
  };

  const handleSwitch = (dir: 'prev' | 'next') => {
    if ((dir === 'prev' && pageIndex === 0) || (dir === 'next' && pageIndex === data.length - 1))
      return;
    stopTimer();
    const index = pageIndex + (dir === 'prev' ? -1 : 1);
    setPageIndex(index);
    setItemIndex(index * pageSize);
    setTimeout(() => {
      startTimer();
      // 500ms animation duration
    }, 500);
  };

  const handleHover = useCallback((index: number) => {
    stopTimer();
    setItemIndex(index);
  }, []);

  const handleLeave = useCallback(() => {
    startTimer();
  }, []);

  useEffect(() => {
    setTotal(majorMatchData.length);
    if (majorMatchData.length > 1 && !timerRef.current) {
      startTimer();
    }
  }, [majorMatchData]);

  if (!data.length) return null;

  return (
    <div className={styles.majorMatch}>
      <Header
        title={<FormattedMessage id="key_major_match" />}
        hideMore
        right={
          data.length > 1 ? (
            <div className={styles.headerRight}>
              <div
                onClick={() => handleSwitch('prev')}
                className={`${styles.arrow} ${pageIndex === 0 ? styles.disabled : ''}`}
              />
              <div
                onClick={() => handleSwitch('next')}
                className={`${styles.arrow} ${
                  pageIndex === data.length - 1 ? styles.disabled : ''
                }`}
              />
            </div>
          ) : null
        }
      />
      <div className={styles.majorMatchWrapper}>
        <div
          className={styles.slideWrapper}
          style={{ transform: `translateX(${-100 * pageIndex}%)` }}
        >
          <Slides itemIndex={itemIndex} data={data} onHover={handleHover} onLeave={handleLeave} />
        </div>
      </div>
    </div>
  );
}

export default React.memo(VersionBTop);
