import type { ReactNode } from 'react';
import React, { useState } from 'react';
import moment from 'moment';
import { connect, FormattedMessage, Link } from 'umi';
import type { ConnectState } from '@/models/connect';
import classnames from 'classnames';
import { Col, message, Row } from 'antd';
import Icon, { RightOutlined } from '@ant-design/icons';
import styles from './index.less';
import type { matchType } from '@/services/matchPage';
import * as homeService from '@/services/home';
import { statesPrams } from '../../pages/Home';
import Disclaimer from '../Disclaimer';
import { ReactComponent as Subscribed } from '../../assets/stats/subscribed.svg';
import emptyLogo from '../../assets/emptyLogo.png';
import type { UserInfoType } from '@/services/user';
import LoginModal from './Login';
import { getMatchStatus, getScore, MatchStatus } from '@/utils/match';
import { normalizeFloat } from '@/utils/tools';

import liveVideo from '@/assets/liveVideo.svg';
import liveVideoDisable from '@/assets/liveVideoDisable.svg';
import playback from '@/assets/playback.svg';
import { genIcon } from '@/components/MatchCardScore';
import type { REPORT_CATE } from '@/constants';
import { REPORT_ACTION } from '@/constants';
import { report } from '@/services/ad';
import { checkIsPhone } from '@/utils/utils';
import Notification from '@/components/Notification';
import highlightIcon from '@/assets/highlight.svg';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { useIntl } from 'umi';

export function checkIsBefore(match: matchType) {
  return getMatchStatus(match.status) === MatchStatus.Before;
}

interface matchCardProps {
  data: matchType;
  setParams: (id: number, bool: boolean) => void;
  from?: string;
  handleChangeLiveMatch?: (id: number) => void;
  currentUser?: UserInfoType | null;
  reportCate?: REPORT_CATE;
  smallView?: boolean;
  whiteBg?: boolean;
}

let MatchCardHome: React.FC<matchCardProps> = (props) => {
  const intl = useIntl();
  const { data, setParams, currentUser, reportCate, smallView, whiteBg } = props;
  const dateFormat = 'DD/MM HH:mm';
  const time = moment(new Date(data.match_time * 1000)).format(dateFormat);
  const { asia, bs, eu } = data.odds;
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loginVisible, setLoginVisible] = useState<boolean>(false);
  const [notificationVisible, setNotificationVisible] = useState(false);

  const handleSubscribe = async () => {
    if (data.subscribed) {
      const result = await homeService.cancelSubscribe(data.match_id);
      if (result.success) {
        message.success(intl.formatMessage({ id: 'key_unsubscribed' }));
      }
      setParams(data.match_id, false);
    } else {
      const result = await homeService.setSubscribe(data.match_id);
      if (result.success) {
        message.success(intl.formatMessage({ id: 'key_subscribed' }));
      }
      setParams(data.match_id, true);
      if (reportCate) {
        report({
          action: REPORT_ACTION.match_remind,
          cate: reportCate,
        });
      }
    }
  };

  const changeLiveMatch = () => {
    if (props.handleChangeLiveMatch) {
      props.handleChangeLiveMatch(data.match_id);
    }
  };

  const handleLiveMatch = () => {
    changeLiveMatch && changeLiveMatch();
    // const storedData = window.localStorage.getItem('NO__MORE___HINTS_NEXT___TIME');
    // if (storedData) {
    //   const boolData = JSON.parse(storedData);
    //   if (boolData.hiddenDisclaimer) {
    //     changeLiveMatch();
    //   } else {
    //     setOpenModal(true);
    //     changeLiveMatch();
    //   }
    // } else {
    //   setOpenModal(true);
    //   changeLiveMatch();
    // }
  };

  const onSubscribeHandle = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (getMatchStatus(data.status) === MatchStatus.Before) {
      // 登录后
      if (currentUser) {
        handleSubscribe();
        if (!data.subscribed) {
          setNotificationVisible(true);
        }
      } else {
        setLoginVisible(true);
      }
    } else {
      handleLiveMatch();
    }
  };

  const onLoginHandler = () => {
    setLoginVisible(false);
    if (checkIsBefore(data)) {
      handleSubscribe();
      setNotificationVisible(true);
    } else {
      handleLiveMatch();
    }
  };

  const stats = statesPrams[data.status];

  const homeScore = data.final_scores.home;
  const awayScore = data.final_scores.away;

  const isMatchStats = stats === 'subscribe';
  const isPhone = checkIsPhone();

  const status = getMatchStatus(data.status);

  let videoDisabled = false;
  let videoCls = '';
  let videoIcon = '';
  const videoText: ReactNode[] = [];
  if (status === MatchStatus.Complete) {
    videoCls = styles.playback;
    if (data.playback_link) {
      videoIcon = playback;
      videoText.push(<FormattedMessage id="key_playback" />);
    }
    if (data.has_highlight) {
      // 不存在回放的情况下，使用集锦 icon
      if (!videoIcon) {
        videoIcon = highlightIcon;
      } else {
        // 存在回放和集锦的情况，展示格式：${回放 icon 回放文字 / 集锦文字}
        videoText.push(<span> / </span>);
      }
      videoText.push(<FormattedMessage id="key_highlight" />);
    }
  } else if (data.has_live) {
    videoIcon = liveVideo;
    videoCls = styles.hasVideo;
    if (status !== MatchStatus.Going) {
      videoDisabled = true;
    }
    videoText.push(<FormattedMessage id="key_live_video" />);
  }
  const lang = toShortLangCode(locale.getLocale());
  return (
    <div
      className={`${styles.card} ${smallView ? styles.smallView : ''} ${
        whiteBg ? styles.whiteBg : ''
      }`}
    >
      <Notification
        visible={notificationVisible}
        onCancel={() => setNotificationVisible(false)}
        onOk={() => setNotificationVisible(false)}
      />
      <LoginModal
        visible={loginVisible}
        onLogin={onLoginHandler}
        onCancel={() => {
          setLoginVisible(false);
        }}
      />
      <Disclaimer
        open={openModal}
        close={() => {
          changeLiveMatch();
          setOpenModal(false);
        }}
      />
      <Link
        to={`/${lang}/details/${data.match_id}`}
        className={styles.cardContainer}
        onClick={() => {
          if (reportCate) {
            report({
              action: REPORT_ACTION.match_enter,
              cate: reportCate,
            });
          }
        }}
      >
        {!smallView && (
          <Row className={styles.header}>
            <Col className={styles.time} span={9} style={{ paddingTop: isPhone ? '5px' : '0' }}>
              <span>{time}</span>
              <span className={styles.competitionName}>{props.data.competition_name}</span>
            </Col>
            <Col className={styles.minutes} span={isPhone ? 4 : 1}>
              {data.minutes ? `${data.minutes}` : "12'"}
            </Col>
            <Col
              span={4}
              className={`${styles.video} ${videoCls} ${videoDisabled ? styles.disabled : ''}`}
            >
              {Boolean(videoIcon) && (
                <>
                  <img className={styles.videoIcon} src={videoIcon} />
                  <div className={styles.videoText}>{videoText}</div>
                </>
              )}
            </Col>
            <Col span={isPhone ? 7 : 10} className={styles.iconContainer}>
              <Icon
                className={isMatchStats ? styles.icon : styles.iconDisabled}
                component={genIcon(data)}
                onClick={(e) => {
                  onSubscribeHandle(e);
                }}
              />
            </Col>
          </Row>
        )}
        <Row>
          <Col className={styles.logoContent} span={smallView ? 11 : 12}>
            <Row className={styles.left}>
              <Col span={smallView ? 3 : 4}>
                <img
                  loading="lazy"
                  className={styles.logo}
                  src={data.home_team_logo || emptyLogo}
                />
              </Col>
              <Col className={styles.name} title={data.home_team_name} span={14}>
                {data.home_team_name}
              </Col>
              {stats !== 'subscribe' &&
                (homeScore ? (
                  <Col
                    className={classnames(
                      styles.score,
                      data.minutes
                        ? styles.going
                        : ['', styles.win, styles.lose][data.final_scores.win],
                    )}
                    span={6}
                  >
                    {homeScore}
                  </Col>
                ) : (
                  <Col className={classnames(styles.default)} span={6}>
                    -
                  </Col>
                ))}
            </Row>
            <Row className={styles.left}>
              <Col span={smallView ? 3 : 4}>
                <img
                  loading="lazy"
                  className={styles.logo}
                  src={data.away_team_logo || emptyLogo}
                />
              </Col>
              <Col className={styles.name} title={data.away_team_name} span={14}>
                {data.away_team_name}
              </Col>
              {stats !== 'subscribe' &&
                (awayScore ? (
                  <Col
                    className={classnames(
                      styles.score,
                      data.minutes
                        ? styles.going
                        : ['', styles.lose, styles.win][data.final_scores.win],
                    )}
                    span={6}
                  >
                    {awayScore}
                  </Col>
                ) : (
                  <Col className={classnames(styles.default)} span={6}>
                    -
                  </Col>
                ))}
            </Row>
          </Col>
          <Col span={smallView ? 11 : 12}>
            <Row className={styles.line}>
              <Col className={styles.fst} span={8}>
                {/* {eu && <div className={styles.intro}>H</div>} */}
                <div className={eu ? styles.number : styles.empty}>
                  {eu ? `H ${normalizeFloat(eu.home)}` : '-'}
                </div>
              </Col>
              <Col className={styles.scd} span={8}>
                {/* {asia && <div className={styles.intro}>H</div>} */}
                <div className={asia ? styles.number : styles.empty}>
                  {asia ? `H ${normalizeFloat(asia.home)}` : '-'}
                </div>
              </Col>
              <Col className={styles.trd} span={8}>
                {/* {bs && <div className={styles.intro}>H</div>} */}
                <div className={bs ? classnames(styles.number, styles.draw) : styles.empty}>
                  {bs ? `H ${normalizeFloat(bs.home)}` : '-'}
                </div>
              </Col>
            </Row>
            <Row className={classnames(styles.line, styles.gray)}>
              <Col className={styles.fst} span={8}>
                {/* {eu && <div className={classnames(styles.intro, styles.away)}>A</div>} */}
                <div className={eu ? styles.draw : styles.empty}>
                  {eu ? `D ${normalizeFloat(eu.draw)}` : '-'}
                </div>
              </Col>
              <Col className={styles.scd} span={8}>
                {/* {asia && <div className={classnames(styles.intro, styles.away)}> </div>} */}
                <div className={asia ? styles.draw : styles.empty}>
                  {asia && asia.draw
                    ? asia.draw > 0
                      ? `+${normalizeFloat(asia.draw)}`
                      : asia.draw
                    : '-'}
                </div>
              </Col>
              <Col className={styles.trd} span={8}>
                {/* <div className={classnames(styles.intro, styles.away)}> </div> */}
                <div className={bs ? styles.draw : styles.empty}>
                  {bs ? normalizeFloat(bs.draw) : '-'}
                </div>
              </Col>
            </Row>
            <Row className={styles.end}>
              <Col span={8} className={styles.fst}>
                {/* {eu && <div className={styles.intro}>D</div>} */}
                <div className={eu ? classnames(styles.number, styles.away) : styles.empty}>
                  {eu ? `A ${normalizeFloat(eu.away)}` : '-'}
                </div>
              </Col>
              <Col className={styles.scd} span={8}>
                {/* {asia && <div className={styles.intro}>A</div>} */}
                <div className={asia ? styles.number : styles.empty}>
                  {asia ? `A ${normalizeFloat(asia.away)}` : '-'}
                </div>
              </Col>
              <Col className={styles.trd} span={8}>
                {/* {bs && <div className={styles.intro}>L</div>} */}
                <div className={bs ? styles.number : styles.empty}>
                  {bs ? `L ${normalizeFloat(bs.away)}` : '-'}
                </div>
              </Col>
            </Row>
          </Col>
          {smallView ? (
            <Col span={2} className={styles.rightIconWrapper}>
              <RightOutlined className={styles.rightIcon} />
            </Col>
          ) : null}
        </Row>
      </Link>
    </div>
  );
};

MatchCardHome = React.memo(MatchCardHome);
// export default MatchCard;
export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(MatchCardHome);
