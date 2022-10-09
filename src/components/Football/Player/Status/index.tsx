import React from 'react';
import { Avatar, Space } from 'antd';
import styles from './index.less';
import * as matchService from '@/services/match';
import classnames from 'classnames';
import { STATS_CODE } from '@/constants';

// 红牌
import RedCard from '@/assets/icon/status_red.svg';
// 进球
import Goal from '@/assets/icon/status_goal.svg'
// 换人
import Substitution from '@/assets/icon/status_substitution.svg'
// 点球
import PenaltyKick from '@/assets/icon/status_spot.svg'
// 乌龙
import OwnGoal from '@/assets/icon/status_own.svg'
// 黄牌
import YellowCard from '@/assets/icon/status_yellow.svg';

// import Out from '@/assets/icon/status_out.svg';
import StatusIcon from '../../StatusIcon';



export type ICourt = {
  data: matchService.Incident[];
  noBackground?: boolean;
};
const Court: React.FC<ICourt> = (props) => {
  const { data, noBackground } = props;
  return (
    <Space>
      {
        data && data.map(i => {
          switch (i.type) {
            case STATS_CODE.RedCard:
              return <StatusIcon noBackground={noBackground} src={RedCard} />;
            case STATS_CODE.YellowCard:
              return <StatusIcon noBackground={noBackground} src={YellowCard} />;
            case STATS_CODE.Goal:
              return <StatusIcon noBackground={noBackground} src={Goal} />;
            case STATS_CODE.Substitution:
              return <StatusIcon noBackground={noBackground} src={Substitution} />;
            case STATS_CODE.PenaltyKick:
              return <StatusIcon noBackground={noBackground} src={PenaltyKick} />;
            case STATS_CODE.OwnGoal:
              return <StatusIcon noBackground={noBackground} src={OwnGoal} />;
            default:
              return null;
          }
        })
      }
    </Space>
  );
};

export default Court;
