import styles from './league-news.less';
import playgroundBg from '@/assets/image/league-news-playground-bg.png';
import league_ENG_Premier_logo from '@/assets/image/league-eng-premier.png';
import league_GER_Bundesliga_logo from '@/assets/image/league-ger-bundesliga.png';
import league_UEFA_UCL_logo from '@/assets/image/league-uefa-ucl.png';
import league_ITA_Serie_A_logo from '@/assets/image/league-ita-serie-a.png';
import league_SPA_La_Liga_logo from '@/assets/image/league-spa-la-liga.png';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { LeagueNews as LeagueNewsType, News } from '@/services/news';
import { fetchLeagueNews } from '@/services/news';
import BizNews from '@/components/BizNews';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';

const fiveLeagueConf = {
  // ENG Premier
  82: {
    bg: 'linear-gradient(180deg, #A084D4 0%, rgba(160, 132, 212, 0.05) 100%)',
    playgroundBgColor: '#5E36A7',
    logo: league_ENG_Premier_logo,
  },
  // SPA La Liga
  120: {
    bg: 'linear-gradient(180deg, #72BB9B 0%, rgba(114, 187, 155, 0.05) 100%)',
    playgroundBgColor: '#FA5900',
    logo: league_SPA_La_Liga_logo,
  },
  // ITA Serie A
  108: {
    bg: 'linear-gradient(180deg, #356EB4 0%, rgba(53, 110, 180, 0.05) 100%)',
    playgroundBgColor: '#0454A7',
    logo: league_ITA_Serie_A_logo,
  },
  // GER Bundesliga
  129: {
    bg: 'linear-gradient(180deg, #B63B30 0%, rgba(182, 59, 48, 0.05) 100%)',
    playgroundBgColor: '#A70E01',
    logo: league_GER_Bundesliga_logo,
  },
  // UEFA UCL
  46: {
    bg: 'linear-gradient(180deg, #456EC9 0%, rgba(69, 110, 201, 0.05) 100%)',
    playgroundBgColor: '#173BC5',
    logo: league_UEFA_UCL_logo,
  },
};
const localLeagueConf = {
  bg: 'linear-gradient(180deg, #B9D0C2 0%, rgba(185, 208, 194, 0.05) 100%)',
  playgroundBgColor: '#4E5C58',
};

const SingleLeagueNews = React.memo(
  (props: {
    id: number;
    bg: string;
    logo: string;
    smallLogo?: boolean;
    playgroundBgColor: string;
    name: string;
    news: News[];
  }) => {
    const { id, bg, logo, smallLogo, news, playgroundBgColor, name } = props;
    const canvasWidth = 548;
    const canvasHeight = 582;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const draw = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(canvasWidth, 0);
      ctx.lineTo(canvasWidth, canvasHeight);
      ctx.fillStyle = playgroundBgColor;
      ctx.fill();
      ctx.closePath();
      const img = document.createElement('img');
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      };
      img.src = playgroundBg;
    };
    useLayoutEffect(() => {
      draw();
    }, []);
    return (
      <div className={styles.wrapper}>
        <div className={styles.container} style={{ background: bg }}>
          <canvas
            className={styles.canvas}
            width={canvasWidth}
            height={canvasHeight}
            ref={canvasRef}
          />
          <img className={`${styles.logo} ${smallLogo ? styles.small : ''}`} src={logo} />
          <div className={styles.name}>{name}</div>
          <div className={styles.list}>
            <div className={styles.listWrapper}>
              {news.map((d, i, ary) => (
                <BizNews
                  key={d.ID}
                  news={d}
                  coverRight
                  borderBottom={i !== ary.length - 1}
                  hideTime
                  reportCate={REPORT_CATE.home}
                  reportAction={REPORT_ACTION.news_detail}
                  reportTag={`${id}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default function LeagueNews() {
  const [data, setData] = useState<LeagueNewsType[]>([]);
  const getData = async () => {
    const res = await fetchLeagueNews();
    if (res.success) {
      setData(res.data);
    }
  };
  const leagueData = useMemo(() => {
    return data.map((d) => {
      const conf = fiveLeagueConf[d.competition_id] || {
        ...localLeagueConf,
        logo: d.competition_logo,
        smallLogo: true,
      };
      return {
        ...conf,
        id: d.competition_id,
        news: d.news,
        name: d.competition_name,
      };
    });
  }, [data]);
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.leagueNews}>
      {leagueData.map((d) => (
        <SingleLeagueNews key={d.id} {...d} />
      ))}
    </div>
  );
}
