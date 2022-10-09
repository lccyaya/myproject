import React, { useState } from 'react';
import moment from 'moment';
import { Link, connect, FormattedMessage } from 'umi';
import type { ConnectState } from '@/models/connect';
import classnames from 'classnames';
import { Row, Col, message } from 'antd';
import Icon from '@ant-design/icons';
import styles from './index.less';
import type { matchType } from '@/services/matchPage';
import * as homeService from '@/services/home';
import { statesPrams } from '../../pages/Home';
import Disclaimer from '../Disclaimer';
import { ReactComponent as GoingWithLive } from '../../assets/stats/going_with_live.svg';
import { ReactComponent as GoingNoLive } from '../../assets/stats/going_no_live.svg';
import { ReactComponent as TBD } from '../../assets/stats/tbd.svg';

import { ReactComponent as NoSubscribe } from '../../assets/stats/subscribe.svg';
import { ReactComponent as Subscribed } from '../../assets/stats/subscribed.svg';
import { ReactComponent as Complete } from '../../assets/stats/complete.svg';
import emptyLogo from '../../assets/emptyLogo.png';
import type { UserInfoType } from '@/services/user';
import LoginModal from './Login';
import { getMatchStatus, getScore, MatchStatus } from '@/utils/match';
import { normalizeFloat } from '@/utils/tools';
import { genIcon } from '@/components/MatchCardScore';
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
}

const MatchCard: React.FC<matchCardProps> = (props) => {
  const { data, setParams, currentUser } = props;
  const dateFormat = 'HH:mm';
  const time = moment(new Date(data.match_time * 1000)).format(dateFormat);
  const { asia, bs, eu } = data.odds;
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loginVisible, setLoginVisible] = useState<boolean>(false);
  const intl = useIntl()
  const handleSubscribe = async () => {
    if (data.subscribed) {
      const result = await homeService.cancelSubscribe(data.match_id);
      if (result.success) {
        message.success(intl.formatMessage({id: "key_unsubscribed"}));
      }
      setParams(data.match_id, false);
    } else {
      const result = await homeService.setSubscribe(data.match_id);
      if (result.success) {
        message.success(intl.formatMessage({id: "key_subscribed"}));
      }
      setParams(data.match_id, true);
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
      } else {
        setLoginVisible(true);
      }
    } else {
      handleLiveMatch();
    }
  };

  const onLoginHandler = () => {
    setLoginVisible(false);
    checkIsBefore(data) ? handleSubscribe() : handleLiveMatch();
  };

  const stats = statesPrams[data.status];

  const homeScore = getScore(data.home_score);
  const awayScore = getScore(data.away_score);

  // const score = `${homeScore} : ${awayScore}`;
  // const scoreDiv = <div className={styles.score}>{score}</div>;
  const isMatchStats = stats === 'subscribe';
  // from && from === 'match' ? stats === 'subscribe' : stats === 'subscribe' || stats === 'going';
  const lang = toShortLangCode(locale.getLocale());
  return (
    <div className={styles.card}>
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
      <Link to={`/${lang}/details/${data.match_id}`} className={styles.cardContainer}>
        <Row className={styles.header}>
          <Col span={2}>
            {/* <PopupLogin
              onLogin={stats === 'subscribe' ? handleSubscribe : handleLiveMatch}
            > */}
            <Icon
              className={isMatchStats ? styles.icon : styles.iconDisabled}
              component={genIcon(data)}
              onClick={(e) => {
                onSubscribeHandle(e);
              }}
            />
          </Col>
          <Col className={styles.time} span={3}>
            {time}
          </Col>
          <Col className={styles.competitionName} span={7}>
            <span className={styles.competitionNameText}>{props.data.competition_name}</span>
          </Col>
          <Col className={styles.text} span={4}>
            <FormattedMessage id="key_1x2" />
          </Col>
          <Col className={styles.text} span={4}>
            <FormattedMessage id="key_handicap" />
          </Col>
          <Col className={classnames(styles.text, styles.last)} span={4}>
            <FormattedMessage id="key_over_under" />
          </Col>
        </Row>
        <Row>
          <Col className={styles.logoContent} span={12}>
            <Row className={styles.left}>
              <Col span={4}>
                <img className={styles.logo} src={data.home_team_logo || emptyLogo} />
              </Col>
              <Col className={styles.name} title={data.home_team_name} span={16}>
                {data.home_team_name}
              </Col>
              {stats !== 'subscribe' && (
                <Col
                  className={classnames(styles.score, stats === 'finish' ? styles.finishScore : '')}
                  span={4}
                >
                  {homeScore}
                </Col>
              )}
            </Row>
            <Row className={styles.left}>
              <Col span={4}>
                <img className={styles.logo} src={data.away_team_logo || emptyLogo} />
              </Col>
              <Col className={styles.name} title={data.away_team_name} span={16}>
                {data.away_team_name}
              </Col>
              {stats !== 'subscribe' && (
                <Col
                  className={classnames(styles.score, stats === 'finish' ? styles.finishScore : '')}
                  span={4}
                >
                  {awayScore}
                </Col>
              )}
            </Row>
          </Col>
          <Col span={12}>
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
                <div className={asia ? styles.draw2 : styles.empty}>
                  {asia && asia.draw
                    ? asia.draw > 0
                      ? `+${normalizeFloat(asia.draw)}`
                      : asia.draw
                    : '-'}
                </div>
              </Col>
              <Col className={styles.trd} span={8}>
                {/* <div className={classnames(styles.intro, styles.away)}> </div> */}
                <div className={bs ? styles.draw2 : styles.empty}>
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
        </Row>
      </Link>
    </div>
  );
};
// export default MatchCard;
export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(MatchCard);
