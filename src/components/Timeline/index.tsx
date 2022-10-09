import React from 'react';
import classnames from 'classnames';
import { Progress, Row, Col } from 'antd';
import styles from './index.less';
import goal from '@/assets/timeline/goal.svg';
import redCard from '@/assets/timeline/redCard.svg';
import substitution from '@/assets/timeline/substitution.svg';
import yellowCard from '@/assets/timeline/yellowCard.svg';
import penaltyKick from '@/assets/timeline/penaltyKick.svg';
import oolongBall from '@/assets/timeline/oolongBall.svg';
import cornerKick from '@/assets/timeline/cornerKick.svg';
import type { processInfo, incident } from '@/services/home';

export type historyData = {
  action: string;
  time: number;
};

export type TimelineProps = {
  liveIncidents: incident[];
  liveMatchInfo: processInfo;
};

const svgList = {
  1: goal,
  4: redCard,
  9: substitution,
  3: yellowCard,
  8: penaltyKick,
  2: cornerKick,
  17: oolongBall
};

const Timeline: React.FC<TimelineProps> = (props) => {
  const { liveMatchInfo, liveIncidents } = props;
  const start = liveMatchInfo.start_time;
  const now = new Date().getTime() / 1000;
  // const time = diff / 3600;
  const matchState = liveMatchInfo.match_state;
  let time = 0;
  if (matchState === 8 || matchState === 5 || matchState === 7) {
    time = 90;
  } else if (matchState === 2) {
    time = (now - start) / 60 + 1
  } else if (matchState === 4) {
    time = (now - start) / 60 + 46
  } else if (matchState === 3) {
    time = 45;
  }

  return (
    <div className={styles.container}>
      <Row className={styles.timeline}>
        <img className={styles.home} src={liveMatchInfo.home_logo}></img>
        <img className={styles.opponent} src={liveMatchInfo.away_logo}></img>
        <Col span={2} className={styles.text}>
          0
        </Col>
        <Col span={20} className={styles.progressContainer}>
          {liveIncidents.filter(d => d.time <= 90).map((d, i) => {
            const dashStyle = d.position === 1 ? styles.dashHome : styles.dashOpponent;
            const iconStyle = d.position === 1 ? styles.iconHome : styles.iconOpponent;
            const left = `${(d.time / 90) * 100}%`;
            const key = `historyPad${i}`;
            return <div key={key} className={styles.history} style={{ left }}>
              <div className={classnames(styles.dash, dashStyle)} />
              <img className={classnames(styles.icon, iconStyle)} src={svgList[d.type]} />
            </div>
          })}
          <Progress
            strokeColor="#FA5900"
            className={styles.progress}
            percent={time < 270 ? time / 0.9 : 0}
            showInfo={false}
            strokeWidth={6}
          />
        </Col>
        <Col span={2} className={styles.text}>
          90
        </Col>
        <div className={styles.ht}>HT</div>
      </Row>
    </div>
  );
};
export default Timeline;
