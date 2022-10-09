import { FinalScore } from '@/services/match';
import * as matchService from '@/services/matchPage';
import { matchType } from '@/services/matchPage';

export enum MatchStatus {
  Before = 'Before',
  Going = 'Going',
  Complete = 'Complete',
  TBD = 'TBD',
}

/**
 * 0 比赛异常，说明：暂未判断具体原因的异常比赛，可能但不限于：腰斩、取消等等，建议隐藏处理
1 未开赛
2 上半场
3 中场
4 下半场
5 加时赛
6 加时赛(弃用)
7 点球决战
8 完场
9 推迟
10 中断
11 腰斩
12 取消
13 待定
 */
export const getMatchStatus = (code: number): MatchStatus => {
  if (code === 1) {
    return MatchStatus.Before;
  } else if (code > 1 && code <= 7) {
    return MatchStatus.Going;
  } else if (code === 8) {
    return MatchStatus.Complete;
  } else {
    return MatchStatus.TBD;
  }
};

export const getMatchStatusDes = (code: number): String => {
  if (code === 0) {
    return "异常";
  } else if (code === 1) {
    return "未开赛";
  } else if (code === 2) {
    return "上半场";
  } else if (code === 3) {
    return "中场";
  } else if (code === 4) {
    return "下半场";
  } else if (code === 5) {
    return "加时赛";
  } else if (code === 7) {
    return "点球决战";
  } else if (code === 8) {
    return "完场";
  } else if (code === 9) {
    return "推迟";
  } else if (code === 10) {
    return "中断";
  } else if (code === 11) {
    return "腰斩";
  } else if (code === 12) {
    return "取消";
  } else if (code === 13) {
    return "待定";
  } else {
    return "异常";
  }
}

export const getScore = (scores: number[]) => {
  if (scores && scores.length >= 7) {
    // 0:"比分(常规时间) - int" 1:"半场比分 - int" 2:"红牌 - int" 3:"黄牌 - int" 4:"角球，-1表示没有角球数据 - int" 5:"加时比分(120分钟，即包括常规时间比分)，加时赛才有 - int" 6:"点球大战比分(不包含常规时间及加时赛比分)，点球大战才有 - int"
    // 5 加时比分(120分钟，即包括常规时间比分)，加时赛才有. 小于等于0的时候取 比分(常规时间)
    if (scores[5] > 0) {
      return scores[5]
    } else {
      return scores[0]
    }

  } else {
    return 0;
  }
};

// 最终比分：常规赛 + 加时赛 + 点球大战
export const getFinalScore = (score: FinalScore) => {
  let { home, away } = score;
  if (score.has_ot) {
    home += score.ot_home || 0;
    away += score.ot_away || 0;
  }
  if (score.has_penalty) {
    home += score.penalty_home || 0;
    away += score.penalty_away || 0;
  }
  return { home, away };
};

// 获取给定日期至少前后3天的比赛，可能包含这3天以后的数据
export const getAtLeastThreeDayMatch = async (params: {
  secondDayTimestamp: number;
  zone: number;
  tab_type: 1 | 2 | 3;
  tab_competition_ids?: number[];
}) => {
  const { secondDayTimestamp, zone, tab_competition_ids, tab_type } = params;
  const secondDayTimestampSeconds = secondDayTimestamp / 1000;
  const firstDayTimestampSeconds = secondDayTimestampSeconds - 86400;
  const thirdDayTimestampSeconds = secondDayTimestampSeconds + 86400;

  const data: matchType[] = [];
  let timestamp = firstDayTimestampSeconds;
  while (timestamp <= thirdDayTimestampSeconds) {
    // 查询传入日期昨天和当天的比赛，当第一天的比赛大于50场的时候，不会返回第二天的比赛
    // eslint-disable-next-line no-await-in-loop
    const res = await matchService.newFetchMatchList({
      timestamp,
      zone,
      init: 0,
      is_pre: false,
      keywords: '',
      tab_type,
      tab_competition_ids,
    });
    if (res.success) {
      data.push(...res.data.matches);
      timestamp = Number(res.data.next_time);

      if (!res.data.has_next) {
        break;
      }
    } else {
      break;
    }
  }

  return data;
};


// 获取tab列表
export const getMatchesTabs = async () => {
  const res = await matchService.getMatchesTabs();
  return res.data;
};

// 获取比赛列表
export const getMatchListV3 = async (params: {
  page: number;
  size: number;
  zone: number;
  tab_type: number;
  competition_ids?: number[];
}) => {
  const res = await matchService.MatchListV3(params);
  return res.data;
};
