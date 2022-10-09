import styles from './index.less';
import type * as matchService from '@/services/match';
import moment from 'moment';
import emptyLogo from '@/assets/emptyLogo.png';
import { getMatchStatus, getMatchStatusDes, MatchStatus } from '@/utils/match';
import { useRef, useState, useEffect } from 'react';
import { Link, useIntl } from 'umi';
import * as homeService from '@/services/home';
import { message } from 'antd';
import { report } from '@/services/ad';
import Notification from '@/components/Notification';
import PopupLogin from '@/components/PopupLogin';
import type { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { FormattedMessage } from '@@/plugin-locale/localeExports';
import CallAppModal from '@/components/OpenApp/CallAppModal';
import Iconfont from '@/base-components/iconfont';

export default (props: {
  match?: matchService.MatchDetails;
  reportCate?: REPORT_CATE;
  reportAction?: REPORT_ACTION;
}) => {
  const intl = useIntl();
  const lang = toShortLangCode(locale.getLocale());
  const ref = useRef<HTMLDivElement | null>(null);
  const { match, reportCate, reportAction } = props;
  const [isSubscribed, setIsSubscribed] = useState<boolean>(Boolean(match?.is_subscribed));
  const [notificationVisible, setNotificationVisible] = useState(false);
  useEffect(() => {
    setIsSubscribed(match?.is_subscribed);
  }, [match?.is_subscribed]);
  if (!match) return null;
  const handleSubscribe = async () => {
    if (isSubscribed) {
      const result = await homeService.cancelSubscribe(+match.match_id);
      if (result.success) {
        setIsSubscribed(false);
        message.success(intl.formatMessage({ id: 'key_unsubscribed' }));
      } else {
        message.error(result.message || 'Request Error');
      }
    } else {
      setNotificationVisible(true);
      const result = await homeService.setSubscribe(+match.match_id);
      if (result.success) {
        setIsSubscribed(true);
        message.success(intl.formatMessage({ id: 'key_subscribed' }));
      } else {
        message.error(result.message || 'Request Error');
      }
      if (reportCate && reportAction) {
        report({
          action: reportAction,
          cate: reportCate,
        });
      }
    }
  };
  const status = getMatchStatus(match.status);
  const showScore = status !== MatchStatus.Before && status !== MatchStatus.TBD;
  const final = match.final_scores;
  const time = moment(new Date(match.match_time * 1000)).format('MM-DD HH:mm');
  const { round } = match;
  let nameSuffix = '';

  if (round?.round_name) {
    nameSuffix += `${round.show_name}`;
  }
  const hasHighlight = Boolean(
    status === MatchStatus.Going && match?.has_highlight && match?.highlights.length,
  );
  const hasPlayback = Boolean(status === MatchStatus.Complete && match?.playback_link);
  const showOtOrPen = final.has_ot || final.has_penalty;
  return (
    <div
      className={styles.matchInfo}
      ref={ref}
      style={{ marginLeft: 'min(calc((100% - 100vw) / 2), 0px)' }}
    >
      <Notification
        visible={notificationVisible}
        onCancel={() => setNotificationVisible(false)}
        onOk={() => setNotificationVisible(false)}
      />
      <div className={styles.wrapper}>
        <div className={styles.top}>
          <div className={styles.time}>{time}</div>
          <div
            className={styles.reminder}
            onClick={() => {
              handleSubscribe();
            }}
          >
            {isSubscribed ? (
              <Iconfont type="icon-dingyue-xuanzhong" size={26} color="#3B9270" />
            ) : (
              <Iconfont type="icon-dingyue-weixuanzhong" size={26} color="#959394" />
            )}
            {/* {status === MatchStatus.Before && (
            <PopupLogin
              onLogin={handleSubscribe}
            >
              <div className={`${styles.imgWrapper} ${isSubscribed ? styles.sub : styles.unsub}`}>
                <div className={styles.subscribed} />
                <div className={styles.unsubscribed} />
              </div>
            </PopupLogin>
          )} */}
          </div>
          {match.competition_name}
          {nameSuffix}
        </div>
        <div className={styles.mid}>
          <div className={styles.team}>
            <Link
              className={styles.name}
              title={match.home_team_name}
              to={`../teamdetails/${match.home_team_id}`}
            >
              {match.home_team_name}
            </Link>
            <Link to={`../teamdetails/${match.home_team_id}`}>
              <img className={styles.logo} src={match.home_team_logo || emptyLogo} />
            </Link>
          </div>
          <div className={styles.scores}>
            <span>{showScore ? final.home : '-'}</span>
            <span>VS</span>
            <span>{showScore ? final.away : '-'}</span>
          </div>
          <div className={`${styles.team} ${styles.reverse}`}>
            <Link
              className={styles.name}
              title={match.away_team_name}
              to={`../teamdetails/${match.away_team_id}`}
            >
              {match.away_team_name}
            </Link>
            <Link to={`../teamdetails/${match.away_team_id}`}>
              <img className={styles.logo} src={match.away_team_logo || emptyLogo} />
            </Link>
          </div>
        </div>
        <div className={styles.bottom}>
          {final.has_ot ? `AET ${final.ot_home || 0}:${final.ot_away || 0}` : ''}
          {final.has_ot && final.has_penalty && <>&nbsp;&nbsp;&nbsp;&nbsp;</>}
          {final.has_penalty ? `PEN ${final.penalty_home || 0}:${final.penalty_away || 0}` : ''}
          {!final.has_ot && !final.has_penalty ? (
            <>
              {status === MatchStatus.Complete && getMatchStatusDes(match.status)}
              {status === MatchStatus.TBD && getMatchStatusDes(match.status)}
              {(status === MatchStatus.Before || status === MatchStatus.Going) && (
                <div className={styles.progress}>
                  {status === MatchStatus.Before
                    ? intl.formatMessage({ id: 'key_to_play' })
                    : match.minutes}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>

      <div className={styles.mobileWrapper}>
        <div className={styles.name}>{match.competition_name}</div>
        <div className={styles.time}>{time}</div>
        <div className={styles.progress}>
          {status === MatchStatus.Complete && getMatchStatusDes(match.status)}
          {status === MatchStatus.TBD && getMatchStatusDes(match.status)}
          {(status === MatchStatus.Before || status === MatchStatus.Going) && (
            <>
              {status === MatchStatus.Before
                ? intl.formatMessage({ id: 'key_to_play' })
                : match.minutes}
            </>
          )}
        </div>
        <div
          className={styles.reminder}
          onClick={() => {
            handleSubscribe();
          }}
        >
          {isSubscribed ? (
            <Iconfont type="icon-dingyue-xuanzhong" size={20} color="#fff" />
          ) : (
            <Iconfont type="icon-dingyue-weixuanzhong" size={20} color="#fff" />
          )}
        </div>
        <div className={styles.teams}>
          <Link className={styles.team} to={`../teamdetails/${match.home_team_id}`}>
            <img className={styles.logo} src={match.home_team_logo || emptyLogo} />
            <div className={styles.name} title={match.home_team_name}>
              {match.home_team_name}
            </div>
          </Link>
          <div className={`${styles.score} ${showOtOrPen ? styles.top : ''}`}>
            {showScore ? (
              <>
                <div className={styles.num}>{final.home}</div>
                <div className={styles.colon}>:</div>
                <div className={styles.num}>{final.away}</div>
              </>
            ) : (
              'VS'
            )}
          </div>
          <Link className={styles.team} to={`../teamdetails/${match.away_team_id}`}>
            <img className={styles.logo} src={match.away_team_logo || emptyLogo} />
            <div className={styles.name} title={match.away_team_name}>
              {match.away_team_name}
            </div>
          </Link>
          {showOtOrPen && (
            <div className={styles.otPen}>
              {final.has_ot ? `AET ${final.ot_home || 0}:${final.ot_away || 0}` : ''}
              {final.has_ot && final.has_penalty && <>&nbsp;&nbsp;&nbsp;&nbsp;</>}
              {final.has_penalty ? `PEN ${final.penalty_home || 0}:${final.penalty_away || 0}` : ''}
            </div>
          )}
        </div>
        {(hasHighlight || hasPlayback) && (
          <CallAppModal title={intl.formatMessage({ id: 'key_watch_in_app' })}>
            <div className={styles.livePlayback}>
              <div className={styles.livePlaybackWrapper}>
                <div className={styles.icon} />
                <div className={styles.text}>
                  {hasHighlight && <FormattedMessage id="key_live_video" />}
                  {!hasHighlight && hasPlayback && <FormattedMessage id="key_playback" />}
                </div>
              </div>
            </div>
          </CallAppModal>
        )}
      </div>
    </div>
  );
};
