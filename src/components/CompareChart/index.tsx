import React from 'react';
import { Progress } from 'antd';
import styles from './index.less';
import { FormattedMessage } from 'react-intl';

export type historyCompoare = {
  home: number;
  opponent: number;
};

export type TimelineProps = {
  shotsOnTarget: historyCompoare;
};

const ComparePieChart: React.FC<TimelineProps> = (props) => {
  const { shotsOnTarget } = props;
  const total = shotsOnTarget.home + shotsOnTarget.opponent;
  const percent = (shotsOnTarget.home / total) * 100;

  return (
    <div className={styles.compareContainer}>
      <div className={styles.title}><FormattedMessage id="key_shots_on_target" /></div>
      <div className={styles.compareBox}>
        <div className={styles.number}>{shotsOnTarget.home}</div>
        <Progress
          className={styles.compare}
          percent={percent}
          showInfo={false}
          strokeWidth={4}
          trailColor="#0066E3"
          strokeColor="#D80000"
        />
        <div className={styles.number}>{shotsOnTarget.opponent}</div>
      </div>
    </div>
  );
};
export default ComparePieChart;
