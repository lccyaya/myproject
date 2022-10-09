/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import moment from 'moment';
import { Button, Badge, Row, Col } from 'antd';
import { FormattedMessage, useIntl } from 'umi';
import { DownOutlined } from '@ant-design/icons';
import Video from '@/components/Video';
import Holder from './holder';
import Channel from './channel';
import styles from './index.less';
import type * as matchService from '@/services/match';
import emptyLogo from '../../assets/emptyLogo.png';
import { report } from '@/services/ad';
import { FOOTBALL_DISMISS_LIVE_RISK, REPORT_ACTION, REPORT_CATE } from '@/constants';

export type ILive = {
  name: string;
  id: number;
  url: string;
} | null;

type IProps = {
  match: matchService.MatchDetails;
  immediately: boolean;
};

const Live: React.FC<IProps> = (props) => {
  const {
    normal_live_link,
    high_live_link,
    match_id,
    match_time,
    live_animation_link,
    playback_link,
    status,
  } = props.match
    ? props.match
    : {
        normal_live_link: '',
        high_live_link: '',
        match_id: 0,
        match_time: 0,
        live_animation_link: '',
        playback_link: '',
        status: 0,
      };

  const isHideRisk = localStorage.getItem(FOOTBALL_DISMISS_LIVE_RISK) === 'yes'

  const list = [];

  if ([1, 2, 3, 4, 5, 6, 7].includes(status)) {
    if (normal_live_link) {
      list.push({
        name: `${useIntl().formatMessage({ id: 'key_live_video' })} 1`,
        id: 1,
        url: normal_live_link,
      });
    }
    if (high_live_link) {
      list.push({
        name: `${useIntl().formatMessage({ id: 'key_live_video' })} 2`,
        id: 2,
        url: high_live_link,
      });
    }
    if (live_animation_link) {
      list.push({
        name: `${useIntl().formatMessage({ id: 'key_live_animation' })}`,
        id: 3,
        url: live_animation_link,
      });
    }
  }

  if (playback_link) {
    list.push({
      name: `${useIntl().formatMessage({ id: 'key_live_playback' })}`,
      id: 4,
      url: playback_link,
    });
  }

  const [visible, setVisible] = useState<boolean>(false);
  const [data, setData] = useState<ILive>(list.length > 0 ? list[0] : null);
  const [isPlaying, setIsPlaying] = useState<boolean>(
    isHideRisk ||
    Boolean(!normal_live_link && !high_live_link && live_animation_link)
  );
  const time = moment(new Date(match_time * 1000)).format('DD MMM HH:mm a');

  return (
    <>
      {data ? (
        <div className={styles.liveContainer}>
          <div className={styles.channel}>
            <span className={styles.title}>
              <FormattedMessage id="key_live" />
            </span>
            {isPlaying && (
              <Button className={styles.change} onClick={() => setVisible(true)}>
                <Badge color="#3CF8A6" />
                <span>{data.name}</span>
                <DownOutlined />
              </Button>
            )}
          </div>
          <div className={styles.video}>
            <div className={styles.videoHead}>
              <Row className={styles.competitionCon}>
                <Col span={20} className={styles.competition}>
                  {props.match && props.match.competition_name}
                </Col>
                <Col span={4} className={styles.condition} />
              </Row>
              <Row className={styles.infoCon}>
                <Col span={7} className={styles.homeTeam}>
                  <span className={styles.homeTeamText}>
                    {props.match && props.match.home_team_name}
                  </span>
                
                </Col>
                <Col span={3} className={styles.logoCon}>
                  <img
                    className={styles.logo}
                    src={(props.match && props.match.home_team_logo) || emptyLogo}
                   />
                </Col>
                <Col span={4} className={styles.time}>
                  {time}
                </Col>
                <Col span={3} className={styles.logoCon}>
                  <img
                    className={styles.logo}
                    src={(props.match && props.match.away_team_logo) || emptyLogo}
                   />
                </Col>
                <Col span={7} className={styles.awayTeam}>
                    <span className={styles.awayTeamText}>
                      {props?.match?.away_team_name}
                      </span>
                </Col>
              </Row>
            </div>
            {isPlaying ? (
              data.id === 3 ? (
                <div className={styles.iframeContainer}>
                  <iframe
                    className={styles.iframe}
                    width="100%"
                    height="100%"
                    frameBorder={0}
                    src={data.url}
                   />
                </div>
              ) : (
                <Video
                  url={data.url}
                  key={data.url}
                  autoplay
                  volume={30}
                  needPause
                  needExpand
                  needVolume
                  isLive={props.match.has_live}
                  needShowError
                  onFullScreenChange={() => {
                    report({
                      cate: REPORT_CATE.match_detail,
                      action: REPORT_ACTION.match_detail_fullscreen_live,
                    });
                  }}
                  // muted
                />
              )
            ) : (
              <Holder
                key={data.url}
                immediately={props.immediately}
                onPlay={() => setVisible(true)}
                match={props.match}
              />
            )}
          </div>
          <Channel
            list={list}
            selectId={data.id}
            visible={visible}
            onCancel={() => setVisible(false)}
            onChange={(e) => {
              setData(e);
              setVisible(false);
              setIsPlaying(true);
            }}
          />
        </div>
      ) : null}
    </>
  );
};
export default Live;
