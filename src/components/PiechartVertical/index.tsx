import React, { CSSProperties } from 'react';
import classNames from 'classnames';
import { Progress } from 'antd';
import type { SupportVoteData } from '@/components/SupportYourTeam';
import styles from './index.less';
import { normalizeFloat } from '@/utils/tools';

export type pieChartStyle = {
  padding?: string;
};

type pieData = SupportVoteData & {
  total: number;
  away_odds?: number;
  home_odds?: number;
  draw_odds?: number;
}

export type PieChartVerticalProps = {
  data: pieData;
  style?: CSSProperties;
};

const PieChartVertical: React.FC<PieChartVerticalProps> = (props) => {
  const { data } = props;

  const pieBox = (
    currentType: string,
    currentClass: string,
    currentValue: number,
    total: number,
    color: string,
    odds?: number,
  ) => {
    const percent = (currentValue / total) * 100;
    return (
      <div className={styles.piechart}>
        <Progress
          className={classNames(styles.pie, styles[currentClass])}
          type="circle"
          percent={percent}
          width={60}
          format={(p) => {
            const value = Math.round(p || 0);
            return `${value}%`;
          }}
          strokeWidth={10}
          trailColor="#DDDDDD"
          strokeColor={color}
        />
        <div
          className={classNames(styles.number, styles[currentClass])}
        >{`${currentType} ${odds ? normalizeFloat(odds) : 0}`}</div>
      </div>
    );
  };

  return (
    <div className={styles.pieContainer} style={props.style}>
      {pieBox('H', 'home', data.home_team_vote, data.total, '#FA5900', data.home_odds)}
      {pieBox('D', 'draw', data.draw_vote, data.total, '#6B6B6B', data.draw_odds)}
      {pieBox('A', 'away', data.away_team_vote, data.total, '#D80000', data.away_odds)}
    </div>
  );
};
export default PieChartVertical;
