import { BellFilled, BellOutlined, RightOutlined } from '@ant-design/icons';
import { FormattedMessage, Link, useHistory, useIntl, useSelector } from 'umi';
import styles from './major-match.less';
import React, { useEffect, useRef, useState } from 'react';
import type { majorMatchType } from '@/services/home';
import { getMajorData } from '@/services/home';
import { getMatchStatus, MatchStatus } from '@/utils/match';
import type { FinalScore } from '@/services/match';
import moment from 'moment';
import LoginModal from '@/components/MatchCard/Login';
import * as homeService from '@/services/home';
import { message } from 'antd';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import type { matchType } from '@/services/matchPage';
import type { ConnectState } from '@/models/connect';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';

const resetDateToDayStart = (date: Date) => {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

const today = resetDateToDayStart(new Date());

export const formatTime = (time: number, formatMessage: Function) => {
  const mills = time * 1000;
  const hm = moment(mills).format('HH:mm');
  const t = resetDateToDayStart(new Date(time * 1000));
  const d = (t.getTime() - today.getTime()) / 864e5;
  let prefix = '';
  if (d <= 0) {
    prefix = formatMessage({ id: 'key_today' });
  } else if (d === 1) {
    prefix = formatMessage({ id: 'key_tomorrow' });
  } else {
    prefix = moment(mills).format('DD/MM');
  }
  return `${prefix} ${hm}`;
};

const formatScore = (finalScore: FinalScore, status: MatchStatus) => {
  let home = '-';
  let away = '-';
  if ([MatchStatus.Going, MatchStatus.Complete].includes(status)) {
    home = String(finalScore.home);
    away = String(finalScore.away);
  }
  return { home, away };
};

export default function MajorMatch() {
  const history = useHistory();
  const user = useSelector<ConnectState>((state) => state.user.currentUser);
  const [data, setData] = useState<majorMatchType[]>([]);
  const [loginVisible, setLoginVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const curMatch = useRef<matchType | null>(null);
  const curIndex = useRef(0);

  const intl = useIntl();
  const formatMessage = intl.formatMessage;

  const getData = async () => {
    const res = await getMajorData();
    if (res.success) {
      setData(res.data.matches);
    }
  };

  const handleSubscribe = async () => {
    if (loading) return;
    setLoading(true);
    const match = curMatch.current;
    if (!match) return;
    let nextValue: boolean | undefined;
    if (match.subscribed) {
      const result = await homeService.cancelSubscribe(match.match_id);
      if (result.success) {
        nextValue = false;
        message.success(formatMessage({ id: 'key_unsubscribed' }));
      }
    } else {
      report({
        cate: REPORT_CATE.home,
        action: REPORT_ACTION.major_match_remind,
        tag: `${curIndex.current}`,
      });
      const result = await homeService.setSubscribe(match.match_id);
      if (result.success) {
        nextValue = true;
        message.success(formatMessage({ id: 'key_subscribed' }));
      }
    }
    if (nextValue !== undefined) {
      data[curIndex.current].match = {
        ...data[curIndex.current].match,
        subscribed: nextValue,
      };
      setData([...data]);
    }
    setLoading(false);
  };

  const handleSubscribeClick = (e: React.MouseEvent, match: matchType, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    curMatch.current = match;
    curIndex.current = index;
    if (!user) {
      setLoginVisible(true);
    } else {
      handleSubscribe();
    }
  };

  const handleClick = (id: number, index: number) => {
    report({
      cate: REPORT_CATE.home,
      action: REPORT_ACTION.version_a_major_match_click,
      tag: `${index + 1}`,
    });
    const lang = toShortLangCode(locale.getLocale());
    history.push(`/${lang}/details/${id}`);
  };

  const onLoginHandler = () => {
    setLoginVisible(false);
    handleSubscribe();
  };

  useEffect(() => {
    getData();
  }, []);

  if (!data.length) return null;

  return (
    <div className={styles.wrapper}>
      <LoginModal
        visible={loginVisible}
        onLogin={onLoginHandler}
        onCancel={() => {
          setLoginVisible(false);
        }}
      />
      <div className={styles.header}>
        <div className={styles.left}>
          <div className={styles.title}>
            <FormattedMessage id="key_major_match" />
          </div>
          {/* <div className={styles.line} /> */}
          <div className={styles.subTitle}>
            {data.length} <FormattedMessage id="key_matches" />
          </div>
        </div>
        <div
          className={styles.right}
          onClick={() => {
            const lang = toShortLangCode(locale.getLocale());
            history.push(`/${lang}/match`);
          }}
        >
          <div className={styles.text}>
            <FormattedMessage id="key_more" />
          </div>
          <RightOutlined className={styles.icon} />
        </div>
      </div>
      <div className={styles.panel}>
        {data.map((d, i) => {
          const { match } = d;
          const status = getMatchStatus(match.status);
          const score = formatScore(match.final_scores, status);
          return (
            <div
              onClick={() => handleClick(match.match_id, i)}
              className={styles.card}
              key={match.match_id}
            >
              <div className={styles.header}>
                <img className={styles.logo} src={match.competition_logo} />
                <div className={styles.name}>{match.competition_name}</div>
                {match.subscribed ? (
                  <BellFilled
                    onClick={(e) => handleSubscribeClick(e, match, i)}
                    className={`${styles.remind} ${styles.active}`}
                  />
                ) : (
                  <BellOutlined
                    onClick={(e) => handleSubscribeClick(e, match, i)}
                    className={styles.remind}
                  />
                )}
              </div>
              <div className={styles.body}>
                <div
                  className={`${styles.top} ${status === MatchStatus.Before ? styles.future : ''}`}
                >
                  <div className={styles.time}>
                    {status === MatchStatus.Going ? match.minutes : formatTime(match.match_time, formatMessage)}
                  </div>
                  {/* {match.has_live && Boolean(match.normal_live_link || match.high_live_link) && (
                    <div className={styles.videoTip}>
                      <div className={styles.icon} />
                      <div className={styles.text}>Live video</div>
                    </div>
                  )} */}
                </div>
                <div className={styles.bottom}>
                  <div className={styles.side}>
                    <div className={styles.team}>
                      <img className={styles.logo} src={match.home_team_logo} />
                      <div className={styles.name}>{match.home_team_name}</div>
                    </div>
                    <div
                      className={`${styles.score} ${
                        status === MatchStatus.Going ? styles.active : ''
                      }`}
                    >
                      {score.home}
                    </div>
                  </div>
                  <div className={styles.side}>
                    <div className={styles.team}>
                      <img className={styles.logo} src={match.away_team_logo} />
                      <div className={styles.name}>{match.away_team_name}</div>
                    </div>
                    <div
                      className={`${styles.score} ${
                        status === MatchStatus.Going ? styles.active : ''
                      }`}
                    >
                      {score.away}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
