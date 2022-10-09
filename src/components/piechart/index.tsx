import React from 'react';
import { Progress } from 'antd';
import styles from './index.less';
import { normalizeFloat } from '@/utils/tools';

export type historyCompoare = {
  home: number;
  away: number;
  type?: number;
};

export type piePrams = {
  name: string;
  params: historyCompoare;
}

export type TimelineProps = {
  totalShots: piePrams;
  corner: piePrams;
  posession: piePrams;
};

const PieChart: React.FC<TimelineProps> = (props) => {
  const { totalShots, corner, posession } = props;
  const pieBox = (title: string, compare: historyCompoare) => {
    const total = compare.home + compare.away;
    const percent = (compare.away / total) * 100;
    return (
      <div className={styles.pieBox}>
        <div className={styles.title}>{title}</div>
        <div className={styles.piechart}>
          <div className={styles.number}>{compare.home}</div>
          <Progress
            className={styles.pie}
            type="circle"
            percent={percent}
            width={36}
            showInfo={false}
            strokeWidth={12}
            // strokeLinecap="square"
            trailColor="#0066E3"
            strokeColor="#D80000"
          />
          <div className={styles.number}>{compare.away}</div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.pieContainer}>
      {pieBox(totalShots.name, totalShots.params)}
      {pieBox(corner.name, corner.params)}
      {pieBox(posession.name, posession.params)}
    </div>
  );
};
export default PieChart;
