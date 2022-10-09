import React, { useState } from 'react';
import classNames from 'classnames';
import { Row, Button } from 'antd';
import { LikeOutlined } from '@ant-design/icons';
import { VOTE_TYPE } from '@/services/match';
import PiechartVertical from '../PiechartVertical';
import PopupLogin from '@/components/PopupLogin';
import styles from './index.less';
import type { MatchDetails } from '@/services/match';
import type { OddsItemType } from '@/services/match';
import { FormattedMessage, useIntl } from 'react-intl';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { report } from '@/services/ad';

export type SupportVoteData = {
  home_team_vote: number;
  away_team_vote: number;
  draw_vote: number;
  odds: {
    asia: OddsItemType;
    bs: OddsItemType;
    eu: OddsItemType;
  }
};

export type SupportYourTeamProps = {
  match?: MatchDetails;
  data: SupportVoteData;
  onVote: (type: VOTE_TYPE, cb: (e?: string) => void) => void;
};

const SupportYourTeam: React.FC<SupportYourTeamProps> = (props) => {
  const { data, onVote, match } = props;
  const total = data.home_team_vote + data.away_team_vote + data.draw_vote;
  const [homeLoading, setHomeLoading] = useState<boolean>(false);
  const [drawLoading, setDrawLoading] = useState<boolean>(false);
  const [awayLoading, setAwayLoading] = useState<boolean>(false);
  const isFinish = match && match.status === 8;
  const [disabled, setDisabled] = useState<boolean>(!!isFinish || !!(match && match!.is_voted));
  const [voteType, setVoteType] = useState<number>(match ? match.vote_type : 8);
  const [isVoted, setIsVoted] = useState<boolean>(match ? match.is_voted : false);

  const voteHandler = (type: VOTE_TYPE) => {
    let setLoading = setHomeLoading;
    let reportAction: REPORT_ACTION | undefined;
    if (type === VOTE_TYPE.HOME) {
      setLoading = setHomeLoading
      reportAction = REPORT_ACTION.dt_vote_h;
    } else if (type === VOTE_TYPE.DRAW) {
      setLoading = setDrawLoading;
      reportAction = REPORT_ACTION.dt_vote_d;
    } else {
      setLoading = setAwayLoading;
      reportAction = REPORT_ACTION.dt_vote_a;
    }
    setLoading(true);
    onVote(type, (e) => {
      if (!e) {
        setDisabled(true);
        setVoteType(type);
      }
      setLoading(false);
    });
    setIsVoted(true);
    report({
      cate: REPORT_CATE.match_detail,
      action: reportAction,
    });
  }

  const pieData = {
    total,
    home_team_vote: data.home_team_vote,
    draw_vote: data.draw_vote,
    away_team_vote: data.away_team_vote,
    odds: data.odds,
    home_odds: (data.odds && data.odds.eu) ? data.odds.eu.home : 0,
    away_odds: (data.odds && data.odds.eu) ? data.odds.eu.away : 0,
    draw_odds: (data.odds && data.odds.eu) ? data.odds.eu.draw : 0,
  }

  const isSelected = (e: VOTE_TYPE) => {
    return disabled && isVoted && voteType === e;
  }

  return (
    <div className={styles.supportContainer}>
      <Row className={styles.title}><FormattedMessage id="key_support_your_team" /></Row>
      <Row className={styles.votes}>{`${total} ${useIntl().formatMessage({ id: 'key_votes' })}`}</Row>
      <div className={styles.info}>
        <PiechartVertical data={pieData} />
        <Row className={styles.voteContainer}>
          <PopupLogin
            onLogin={() => voteHandler(VOTE_TYPE.HOME)}
          >
            <Button
              disabled={disabled}
              loading={homeLoading}
              className={classNames(styles.button, styles.home, disabled ? styles.disable : '', isSelected(VOTE_TYPE.HOME) ? styles.selected : '')}
              icon={<LikeOutlined />}>
              <FormattedMessage id="key_vote" />
            </Button>
          </PopupLogin>
          <PopupLogin
            onLogin={() => voteHandler(VOTE_TYPE.DRAW)}
          >
            <Button
              disabled={disabled}
              loading={drawLoading}
              className={classNames(styles.button, styles.draw, disabled ? styles.disable : '', isSelected(VOTE_TYPE.DRAW) ? styles.selected : '')}
              icon={<LikeOutlined />}
            >
              <FormattedMessage id="key_vote" />
            </Button>
          </PopupLogin>
          <PopupLogin
            onLogin={() => voteHandler(VOTE_TYPE.AWAY)}
          >
            <Button
              disabled={disabled}
              loading={awayLoading}
              className={classNames(styles.button, styles.away, disabled ? styles.disable : '',
                isSelected(VOTE_TYPE.AWAY) ? styles.selected : '')}
              icon={<LikeOutlined />}
            >
              <FormattedMessage id="key_vote" />
            </Button>
          </PopupLogin>
        </Row>
      </div>
    </div>
  );
};
export default SupportYourTeam;
