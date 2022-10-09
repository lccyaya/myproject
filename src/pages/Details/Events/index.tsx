import styles from './index.less';
import type { FinalScore, MatchEvent } from '@/services/match';
import { listMatchEvents, MatchEventType } from '@/services/match';
import type { ReactElement } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { Spin } from 'antd';
import { eventIcons } from '@/pages/Details/Events/icons';
import { getMatchStatus, MatchStatus } from '@/utils/match';
import { useIntl, FormattedMessage, Link } from 'umi';
import { checkIsPhone } from '@/utils/utils';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';

function TimeEvent(props: { type: 'start' | 'ht' | 'ft' | 'aet'; content: string }) {
  return (
    <div className={`${styles.event} ${styles.timeEvent}`}>
      <div className={styles.line} />
      <div className={styles.info}>
        <div className={`${styles.icon} ${styles[props.type]}`} />
        <div className={styles.text}>{props.content}</div>
      </div>
      <div className={styles.line} />
    </div>
  );
}

function TimeEventCom(props: { event: MatchEvent; final: FinalScore }) {
  const { event, final } = props;
  let type: 'ht' | 'ft' | 'aet';
  let hs = 0;
  let as = 0;
  if (event.type === MatchEventType.HalfTime) {
    type = 'ht';
    hs = final.first_half_home;
    as = final.first_half_away;
  } else if (event.type === MatchEventType.RegularEnd) {
    type = 'ft';
    hs = final.home;
    as = final.away;
  } else {
    type = 'aet';
    hs = final.home + final.ot_home;
    as = final.away + final.ot_away;
  }
  return <TimeEvent type={type} content={`${hs} - ${as}`} />;
}

function NormalEvent(props: {
  title: string | ReactElement;
  subTitle: string | ReactElement;
  iconUrl: string;
  time: string;
  isHome: boolean;
}) {
  const { time, subTitle, title, iconUrl, isHome } = props;
  const info = (
    <div className={`${styles.info} ${!isHome ? styles.reverse : ''}`}>
      <div className={styles.infoWrapper}>
        <div className={styles.title}>{title}</div>
        {subTitle && <div className={styles.subTitle}>{subTitle}</div>}
      </div>
      <img className={styles.icon} src={iconUrl} alt="" />
      <div className={styles.innerTime}>
        {time}
        {time !== 'PK' ? '‘' : ''}
      </div>
    </div>
  );
  return (
    <div className={`${styles.event} ${styles.normalEvent}`}>
      {isHome ? info : <div className={`${styles.info} ${styles.placeholder}`} />}
      <div className={styles.time}>{time}</div>
      {!isHome ? info : <div className={`${styles.info} ${styles.placeholder}`} />}
    </div>
  );
}

function NormalEventCom(props: { event: MatchEvent; final: FinalScore }) {
  const { event } = props;
  const regularHomeScore = event.home_score;
  const regularAwayScore = event.away_score;
  const formatScore = (hs: number, as: number) => {
    const h = <span className={event.position === 1 ? styles.color : ''}>{hs}</span>;
    const a = <span className={event.position === 2 ? styles.color : ''}>{as}</span>;
    return (
      <>
        ({h} - {a})
      </>
    );
  };
  let title: ReactElement | string = '';
  let subTitle: ReactElement | string = '';
  let time = String(event.time);

  switch (event.type) {
    case MatchEventType.YellowCard:
    case MatchEventType.RedCard:
    case MatchEventType.TwoYellowToRed:
      title = event.player_name;
      break;
    case MatchEventType.Goal:
    case MatchEventType.OwnGoal:
      title = (
        <>
          {event.player_name} {formatScore(regularHomeScore, regularAwayScore)}
        </>
      );
      if (event.assist1_name && event.type !== MatchEventType.OwnGoal) {
        subTitle = (
          <>
            <FormattedMessage id="key_assist_by" /> {event.assist1_name}
          </>
        );
      }
      break;
    case MatchEventType.PenaltyGoal:
    case MatchEventType.PenaltyMissed:
      title = event.player_name;
      // 判定是不是点球大战中的点球
      if ([29, 30].includes(event.type_v2)) {
        subTitle = (
          <>
            <FormattedMessage
              id={event.type === MatchEventType.PenaltyGoal ? 'key_goal' : 'key_missed'}
            />{' '}
            ({regularHomeScore} - {regularAwayScore})
          </>
        );
        time = 'PK';
      } else if (event.type === MatchEventType.PenaltyGoal) {
        title = (
          <>
            {title} {formatScore(regularHomeScore, regularAwayScore)}
          </>
        );
      }
      break;
    case MatchEventType.Substitution:
      title = event.in_player_name;
      subTitle = (
        <>
          <FormattedMessage id="key_substitute_for" /> {event.out_player_name}
        </>
      );
      break;
    case MatchEventType.Var:
      if (event.reason_text) {
        title = event.reason_text;
      }
      subTitle = event.player_name;
      break;
    default:
      // 不支持的事件
      return null;
  }

  return (
    <NormalEvent
      title={title}
      subTitle={subTitle}
      iconUrl={event.event_pic_url}
      time={time}
      isHome={event.position === 1}
    />
  );
}

const timeTypeEvents = [MatchEventType.HalfTime, MatchEventType.RegularEnd, MatchEventType.OtEnd];
const normalTypeEvents = [
  MatchEventType.YellowCard,
  MatchEventType.RedCard,
  MatchEventType.Goal,
  MatchEventType.OwnGoal,
  MatchEventType.Var,
  MatchEventType.PenaltyGoal,
  MatchEventType.PenaltyMissed,
  MatchEventType.TwoYellowToRed,
  MatchEventType.Substitution,
];

export default (props: { matchId: string; smallView?: boolean }) => {
  const { smallView } = props;
  const isPhone = smallView ?? checkIsPhone();
  const intl = useIntl();
  const timer = useRef<number>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ incidents?: MatchEvent[]; final_scores: FinalScore }>();
  const [explainVisible, setExplainVisible] = useState(false);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (!bodyRef.current && !smallView) return;
      const { scrollHeight, offsetHeight } = bodyRef.current!;
      bodyRef.current!.scrollTop = scrollHeight - offsetHeight;
    }, 150);
  };

  const listEvents = async () => {
    const res = await listMatchEvents(props.matchId);
    if (res.success) {
      if (res.data.incidents?.length !== data?.incidents?.length) {
        scrollToBottom();
      }
      setData(res.data);
    }
    setLoading(false);
    clearTimeout(timer.current);
    if (
      res.success &&
      (!res.data.info || getMatchStatus(res.data.info.match_state) !== MatchStatus.Going)
    ) {
      return;
    }
    timer.current = window.setTimeout(() => listEvents(), 10000);
  };

  const showExplain = (e: React.MouseEvent, type: 'click' | 'enter') => {
    e.preventDefault();
    e.stopPropagation();
    if (isPhone) {
      if (type === 'enter') return;
      setExplainVisible((p) => !p);
    } else {
      setExplainVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPhone) {
      setExplainVisible(false);
    }
  };

  useEffect(() => {
    listEvents();
    const hideExplain = () => setExplainVisible(false);
    document.body.addEventListener('click', hideExplain);
    return () => {
      clearTimeout(timer.current);
      document.removeEventListener('click', hideExplain);
    };
  }, []);
  const lang = toShortLangCode(locale.getLocale());
  return (
    <div
      className={`${styles.wrapper} ${isPhone ? styles.mobile : ''} ${
        smallView ? styles.smallView : ''
      }`}
    >
      <div className={styles.header}>
        <div className={styles.name}>
          <FormattedMessage id="key_events" />
        </div>
        {!smallView && (
          <div className={styles.iconWrapper}>
            <div
              className={styles.icon}
              onClick={(e) => showExplain(e, 'click')}
              onMouseEnter={(e) => showExplain(e, 'enter')}
              onMouseLeave={handleMouseLeave}
            />
            <div
              className={styles.iconExplain}
              style={{ display: explainVisible ? 'block' : 'none' }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {eventIcons.map((e) => {
                return (
                  <div className={styles.item} key={e.name}>
                    <img className={styles.eventIcon} src={e.icon} />
                    <div className={styles.eventName}>
                      <FormattedMessage id={e.name} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {smallView && (
          <Link className={styles.more} to={`/${lang}/details/${props.matchId}`}>
            <div className={styles.text}>
              <FormattedMessage id="key_more_details" />
            </div>
            <div className={styles.arrow} />
          </Link>
        )}
      </div>
      <Spin spinning={loading}>
        <div className={styles.body} ref={bodyRef}>
          {!loading && <TimeEvent type="start" content={intl.formatMessage({ id: 'key_start' })} />}
          {data?.incidents?.map((e) => {
            if (timeTypeEvents.includes(e.type)) {
              return <TimeEventCom event={e} final={data.final_scores} />;
            }
            if (normalTypeEvents.includes(e.type)) {
              return <NormalEventCom event={e} final={data.final_scores} />;
            }
            return null;
          })}
          {!loading && !data?.incidents?.length ? (
            <div className={styles.empty}>
              <FormattedMessage id="key_no_event" />
            </div>
          ) : null}
        </div>
      </Spin>
    </div>
  );
};
