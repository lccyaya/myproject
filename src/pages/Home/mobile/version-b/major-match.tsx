import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import 'swiper/swiper.min.css';
import styles from './major-match.less';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useHistory, useIntl } from 'umi';
import { PlaySquareFilled, StarFilled } from '@ant-design/icons';
import type { majorMatchType } from '@/services/home';
import { getMajorData } from '@/services/home';
import { getCover } from '@/pages/Highlight';
import { getMatchStatus, MatchStatus } from '@/utils/match';
import { formatTime } from '@/pages/Home/mobile/version-a/major-match';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';

SwiperCore.use([Autoplay]);

export default function MajorMatch() {
  const history = useHistory();
  const [curIndex, setCurIndex] = useState(0);
  const [data, setData] = useState<majorMatchType[]>([]);
  const [covers, setCovers] = useState<string[]>([]);
  const fmtMsg = useIntl().formatMessage;

  const getData = async () => {
    const res = await getMajorData();
    if (res.success) {
      setCovers(Array.from({ length: res.data.matches.length }).map(() => getCover()));
      setData(res.data.matches);
    }
  };
  const handleClick = (item: majorMatchType, index: number) => {
    report({
      cate: REPORT_CATE.home,
      action: REPORT_ACTION.version_b_major_match_banner_enter,
      tag: `${index + 1}`,
    });
    history.push(`./details/${item.match.match_id}`);
  };

  useEffect(() => {
    getData();
  }, []);
  if (!data.length) {
    return null;
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapperTitle}>{fmtMsg({ id: 'key_major_match' })}</div>
      <Swiper
        loop={data.length > 1}
        centeredSlides
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        slidesPerView={1}
        onSlideChange={(swiper) => setCurIndex(swiper.activeIndex % data.length)}
      >
        {data.map((s, i) => {
          const { match } = s;
          const status = getMatchStatus(match.status);
          const showScore = [MatchStatus.Complete, MatchStatus.Going].includes(status);
          const videos: ReactNode[] = [];

          let statusText = '';
          if (status === MatchStatus.Complete) {
            statusText = fmtMsg({ id: 'key_full_time' });
            if (match.playback_link) {
              videos.push(
                <div className={styles.video} key="Playback">
                  <PlaySquareFilled className={styles.icon} />
                  <div className={styles.text}>{fmtMsg({ id: 'key_playback' })}</div>
                </div>,
              );
            }
            if (match.has_highlight) {
              videos.push(
                <div className={styles.video} key="Highlight">
                  <StarFilled className={styles.icon} />
                  <div className={styles.text}>{fmtMsg({ id: 'key_highlight' })}</div>
                </div>,
              );
            }
          } else if (status === MatchStatus.Before) {
            statusText = fmtMsg({ id: 'key_to_play' });
            videos.push(
              <div className={styles.text} key="ToPlay">
                {formatTime(match.match_time)}
              </div>,
            );
          } else if (status === MatchStatus.Going) {
            statusText = match.minutes ?? '';
            if (match.has_live) {
              videos.push(
                <div className={styles.video} key="LiveVideo">
                  <PlaySquareFilled className={styles.icon} />
                  <div className={styles.text}>{fmtMsg({ id: 'key_live_video' })}</div>
                </div>,
              );
            }
          }
          if (videos.length === 2) {
            videos.splice(1, 0, <div className={styles.line} />);
          }
          return (
            <SwiperSlide key={s.match.match_id}>
              <div
                onClick={() => handleClick(s, i)}
                key={s.match.match_id}
                className={styles.slide}
                style={{ backgroundImage: `url(${covers[i]})` }}
              >
                <div className={styles.content}>
                  <div className={styles.leagueName}>
                    <div className={styles.status}>{statusText}</div>
                    {match.competition_name}
                  </div>
                  <div className={styles.teams}>
                    <div className={styles.team}>
                      <div className={styles.name}>{match.home_team_name}</div>
                      <img className={styles.logo} src={match.home_team_logo} />
                    </div>
                    <div className={styles.score}>
                      {showScore ? (
                        <>
                          {match.final_scores.home}
                          <div className={styles.line} />
                          {match.final_scores.away}
                        </>
                      ) : (
                        'VS'
                      )}
                    </div>
                    <div className={`${styles.team} ${styles.reverse}`}>
                      <div className={styles.name}>{match.away_team_name}</div>
                      <img className={styles.logo} src={match.away_team_logo} />
                    </div>
                  </div>
                  <div className={styles.videos}>{videos}</div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className={styles.indicator}>
        {data.map((_, i) => (
          <div key={i} className={`${styles.item} ${i === curIndex ? styles.active : ''}`} />
        ))}
      </div>
    </div>
  );
}
