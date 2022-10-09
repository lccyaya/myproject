import React, { useEffect, useState, memo } from 'react';
import { Text } from '@/base-components/pc';
import moment from 'moment';
import Iconfont from '@/base-components/iconfont';
import { useIntl, history } from 'umi';
import { message } from 'antd';
import { getMatchStatus, MatchStatus, getScore } from '@/utils/match';
import Notification from '@/components/Notification';
import * as homeService from '@/services/home';
import { toShortLangCode } from '@/utils/utils';
import Tag from '@/base-components/tag/pc';
import { locale } from '@/app';
import { normalizeFloat } from '@/utils/tools';
import EmptyLogo from '@/assets/emptyLogo.png';
import cls from 'classnames';
import { handleReport } from '@/utils/report';

import styles from './pc.module.less';
// type 支持 score【比分模式】和 index[指数模式]
const PC = ({ data, type = 'score', className = '' }) => {
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const intl = useIntl();
  useEffect(() => {
    setSubscribed(data?.subscribed);
  }, [data]);

  let status = getMatchStatus(data.status);
  let matchStatusText = {
    text: '',
    color: '#999',
  };
  if (status === MatchStatus.Complete) {
    matchStatusText.text = 'FT';
    matchStatusText.color = '#191919';
  } else if (status === MatchStatus.TBD) {
    matchStatusText.text = 'TBD';
    matchStatusText.color = '#999';
  } else if ([MatchStatus.Before].includes(status)) {
    matchStatusText.text = intl.formatMessage({ id: 'key_to_play' });
    matchStatusText.color = '#999';
  } else if (status === MatchStatus.Going) {
    matchStatusText.text = data.minutes;
    matchStatusText.color = '#FA5900';
  }
  const { asia, bs, eu } = data.odds;
  const isShowVS = status === MatchStatus.Before || status === MatchStatus.TBD;
  const isShowScore = status === MatchStatus.Going || status === MatchStatus.Complete;
  const homeScore = getScore(data.home_score);
  const awayScore = getScore(data.away_score);
  // 是否有集锦
  const hasHighlight = status === MatchStatus.Complete && data.has_highlight;
  // 是否有回放
  const hasPlayBack = status === MatchStatus.Complete && data?.playback_link;
  // 是否有方案
  const hasScheme = status === MatchStatus.Before && data?.schemes;
  // 是否有直播
  const hasLive = status === MatchStatus.Before && data?.has_live;
  // 直播正在进行中
  const hasDoingLive = status === MatchStatus.Going && data?.has_live;
  const final = data.final_scores;

  const handleSubscribe = async (data) => {
    setSubscribed(!subscribed);
    if (subscribed) {
      const result = await homeService.cancelSubscribe(data.match_id);
      if (result.success) {
        message.success(intl.formatMessage({ id: 'key_unsubscribed' }));
        setSubscribed(false);
      } else {
        setSubscribed(true);
      }
    } else {
      const result = await homeService.setSubscribe(data.match_id);

      if (result.success) {
        handleReport({ action: 'subscribe', tag: data.status + '' });
        setSubscribed(true);
        message.success(intl.formatMessage({ id: 'key_subscribed' }));
      } else {
        setSubscribed(false);
      }
    }
  };
  if (type === 'score') {
    return (
      <div
        className={cls(styles.match_card_box, className)}
        onClick={() => {
          const lang = toShortLangCode(locale.getLocale());
          handleReport({ action: 'match_enter', tag: data.status + '' });
          history.push(`/${lang}/details/${data.match_id}`);
        }}
      >
        <div className={styles.match_card_left}>
          <div className={styles.match_card_time}>
            {moment(data.match_time * 1000).format('HH:mm')}
          </div>
          <div className={styles.match_card_league_name}>
            <Text text={data.competition_name} numbuerOfLines={1} fontSize={12} color={'#999999'} />
          </div>
        </div>
        <div className={styles.match_status}>
          <Text
            fontSize={14}
            color={matchStatusText.color}
            text={matchStatusText.text}
            width={'auto'}
          />
        </div>
        <div className={styles.match_home}>
          {data?.final_scores?.home_red_card ? (
            <div className={styles.match_red_card}>{data?.final_scores?.home_red_card}</div>
          ) : null}
          <div className={styles.match_home_name}>
            <Text text={data.home_team_name} fontSize={16} color={'#333'} />
          </div>
          <img src={data.home_team_logo || EmptyLogo} className={styles.match_home_logo} alt="" />
        </div>
        <div className={styles.match_vs}>
          {isShowVS ? (
            <Text
              text={'VS'}
              fontSize={24}
              color={MatchStatus.TBD === status ? '#999999' : '#333'}
              width={'auto'}
            />
          ) : null}
          {isShowScore ? (
            <Text
              text={`${homeScore} - ${awayScore}`}
              fontSize={24}
              color={matchStatusText.color}
              width={'auto'}
            />
          ) : null}
        </div>
        <div className={styles.match_away}>
          <img src={data.away_team_logo || EmptyLogo} className={styles.match_away_logo} alt="" />
          <div className={styles.match_away_name}>
            <Text text={data.away_team_name} fontSize={16} color={'#333'} />
          </div>
          {data?.final_scores?.away_red_card ? (
            <div className={styles.match_red_card}>{data?.final_scores?.away_red_card}</div>
          ) : null}
        </div>
        <div className={styles.match_tag_box}>
          {hasPlayBack ? (
            <Tag
              icon="icon-shipin"
              color="#E9616B"
              text={intl.formatMessage({ id: 'key_playback', defaultMessage: 'key_playback' })}
            />
          ) : null}
          {hasHighlight ? (
            <Tag
              icon="icon-jijin1"
              color="#40A04E"
              text={intl.formatMessage({ id: 'key_highlight', defaultMessage: 'key_highlight' })}
            />
          ) : null}
          {hasScheme ? (
            <Tag
              icon="icon-fangan"
              color="#D28602"
              text={
                intl.formatMessage({ id: 'key_scheme', defaultMessage: 'key_scheme' }) +
                data?.schemes
              }
            />
          ) : null}
          {hasLive ? (
            <Tag
              icon="icon-shipin"
              color="#E9616B"
              text={intl.formatMessage({
                id: 'key_live_video',
                defaultMessage: 'key_live_video',
              })}
            />
          ) : null}
          {hasDoingLive ? (
            <Tag
              icon="icon-zhibo"
              color="#DA000B"
              text={intl.formatMessage({ id: 'key_living', defaultMessage: 'key_living' })}
            />
          ) : null}
        </div>
        <div
          className={styles.match_subscribe}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubscribe(data);
            if (!data.subscribed) {
              setNotificationVisible(true);
            }
          }}
        >
          <Iconfont
            className={styles.match_subscribe_icon}
            color={subscribed ? '#FA5900' : '#999999'}
            size={18}
            type={subscribed ? 'icon-dingyue-xuanzhong' : 'icon-dingyue-weixuanzhong'}
          />
        </div>
        <div className={styles.bottom}>
          {final.has_ot ? `AET: ${final.ot_home || 0}-${final.ot_away || 0}` : ''}
          {final.has_ot && final.has_penalty ? '　' : ''}
          {final.has_penalty ? `PEN: ${final.penalty_home || 0}-${final.penalty_away || 0}` : ''}
        </div>
        <Notification
          visible={notificationVisible}
          onCancel={() => setNotificationVisible(false)}
          onOk={() => setNotificationVisible(false)}
        />
      </div>
    );
  } else if (type === 'index') {
    return (
      <div
        className={cls(styles.match_index_box, className)}
        onClick={() => {
          const lang = toShortLangCode(locale.getLocale());
          handleReport({ action: 'match_enter', tag: data.status });
          history.push(`/${lang}/details/${data.match_id}`);
        }}
      >
        <div className={styles.match_index_header}>
          <div className={styles.match_index_header_left}>
            <div style={{ paddingLeft: 12 }}>
              <Text
                text={moment(data.match_time * 1000).format('HH:mm') + ' ' + data.competition_name}
                numbuerOfLines={1}
                fontSize={12}
                color={'#999999'}
              />
            </div>
          </div>
          <div className={styles.match_index_header_status}>
            <Text
              fontSize={14}
              color={matchStatusText.color}
              text={matchStatusText.text}
              width={'auto'}
            />
          </div>
          <div className={styles.match_index_header_tags}>
            {hasPlayBack ? (
              <Tag
                icon="icon-shipin"
                color="#E9616B"
                text={intl.formatMessage({ id: 'key_playback', defaultMessage: 'key_playback' })}
              />
            ) : null}
            {hasHighlight ? (
              <Tag
                icon="icon-jijin1"
                color="#40A04E"
                text={intl.formatMessage({
                  id: 'key_highlight',
                  defaultMessage: 'key_highlight',
                })}
              />
            ) : null}
            {hasScheme ? (
              <Tag
                icon="icon-fangan"
                color="#D28602"
                text={
                  intl.formatMessage({ id: 'key_scheme', defaultMessage: 'key_scheme' }) +
                  data?.schemes
                }
              />
            ) : null}
            {hasLive ? (
              <Tag
                icon="icon-shipin"
                color="#E9616B"
                text={intl.formatMessage({
                  id: 'key_live_video',
                  defaultMessage: 'key_live_video',
                })}
              />
            ) : null}
            {hasDoingLive ? (
              <Tag
                icon="icon-zhibo"
                color="#DA000B"
                text={intl.formatMessage({ id: 'key_living', defaultMessage: 'key_living' })}
              />
            ) : null}
          </div>
          <div
            className={styles.match_index_subscribe}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubscribe(data);
              if (!data.subscribed) {
                setNotificationVisible(true);
              }
            }}
          >
            <Iconfont
              className={styles.match_subscribe_icon}
              color={subscribed ? '#FA5900' : '#999999'}
              size={18}
              type={subscribed ? 'icon-dingyue-xuanzhong' : 'icon-dingyue-weixuanzhong'}
            />
          </div>
        </div>
        <div className={styles.match_index_body}>
          <div className={styles.match_index_body_left}>
            <div className={styles.match_index_team}>
              <img
                className={styles.match_index_team_logo}
                src={data.home_team_logo || EmptyLogo}
              />
              <div className={styles.match_index_team_name}>
                <Text text={data.home_team_name} fontSize={16} color={'#333'} />
              </div>
              <div className={styles.match_index_team_score}>
                <Text
                  text={
                    [MatchStatus.Going, MatchStatus.Complete].includes(status) ? `${homeScore}` : ''
                  }
                  fontSize={24}
                  color={matchStatusText.color}
                  width={'auto'}
                />
              </div>
            </div>
            <div className={styles.match_index_team}>
              <img
                className={styles.match_index_team_logo}
                src={data.away_team_logo || EmptyLogo}
              />
              <div className={styles.match_index_team_name}>
                <Text text={data.away_team_name} fontSize={16} color={'#333'} />
              </div>
              <div className={styles.match_index_team_score}>
                <Text
                  text={
                    [MatchStatus.Going, MatchStatus.Complete].includes(status) ? `${awayScore}` : ''
                  }
                  fontSize={24}
                  color={matchStatusText.color}
                  width={'auto'}
                />
              </div>
            </div>
          </div>
          <div className={styles.match_index_body_right}>
            <div className={styles.match_index_row}>
              <div className={styles.match_index_col}>
                <div style={{ color: '#FA5900' }}>
                  {eu ? `H ${normalizeFloat(eu.home)}` : <div style={{ color: '#c9c6c9' }}>-</div>}
                </div>
              </div>
              <div className={styles.match_index_col}>
                <div style={{ color: '#FA5900' }}>
                  {asia ? (
                    `H ${normalizeFloat(asia.home)}`
                  ) : (
                    <div style={{ color: '#c9c6c9' }}>-</div>
                  )}
                </div>
              </div>
              <div className={styles.match_index_col}>
                <div style={{ color: '#686568' }}>
                  {bs ? `H ${normalizeFloat(bs.home)}` : <div style={{ color: '#c9c6c9' }}>-</div>}
                </div>
              </div>
            </div>
            <div className={styles.match_index_row}>
              <div className={styles.match_index_col}>
                <div style={{ color: '#686568' }}>
                  {eu ? `D ${normalizeFloat(eu.draw)}` : <div style={{ color: '#c9c6c9' }}>-</div>}
                </div>
              </div>
              <div className={styles.match_index_col}>
                <div style={{ color: '#C9C6C9' }}>
                  {asia?.draw ? (
                    asia.draw > 0 ? (
                      `+ ${normalizeFloat(asia.draw)}`
                    ) : (
                      `- ${normalizeFloat(Math.abs(asia.draw))}`
                    )
                  ) : (
                    <div style={{ color: '#c9c6c9' }}>-</div>
                  )}
                </div>
              </div>
              <div className={styles.match_index_col}>
                <div style={{ color: '#C9C6C9' }}>
                  {bs ? normalizeFloat(bs.draw) : <div style={{ color: '#c9c6c9' }}>-</div>}
                </div>
              </div>
            </div>
            <div className={styles.match_index_row}>
              <div className={styles.match_index_col}>
                <div style={{ color: '#C60108' }}>
                  {eu ? `A ${normalizeFloat(eu.away)}` : <div style={{ color: '#c9c6c9' }}>-</div>}
                </div>
              </div>
              <div className={styles.match_index_col}>
                <div style={{ color: '#C60108' }}>
                  {asia ? (
                    `A ${normalizeFloat(asia.away)}`
                  ) : (
                    <div style={{ color: '#c9c6c9' }}>-</div>
                  )}
                </div>
              </div>
              <div className={styles.match_index_col}>
                <div style={{ color: '#686568' }}>
                  {bs ? `L ${normalizeFloat(bs.away)}` : <div style={{ color: '#c9c6c9' }}>-</div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Notification
          visible={notificationVisible}
          onCancel={() => setNotificationVisible(false)}
          onOk={() => setNotificationVisible(false)}
        />
      </div>
    );
  } else {
    return null;
  }
};

export default PC;
