import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import moment from 'moment';
import Empty from '@/components/Empty';

import * as matchPageService from '@/services/matchPage';

import MatchList from './list';

export type MatchDateFormatDataItem = {
  key: string;
  month: string;
  day: string;
  data: matchPageService.matchType[];
};

interface IProps {
  competitionId: number;
  seasonId?: number;
}

function formatMatchData(list: matchPageService.matchType[]) {
  const _list: MatchDateFormatDataItem[] = [];
  list.forEach((i) => {
    const key = moment(new Date(i.match_time * 1000)).format('YYYY-MM-DD');
    if (_list.filter((_l) => _l.key === key).length > 0) {
      _list.forEach((_i) => {
        if (_i.key === key) {
          _i.data.push(i);
        }
      });
    } else {
      const _item: MatchDateFormatDataItem = {
        key: moment(new Date(i.match_time * 1000)).format('YYYY-MM-DD'),
        month: moment(new Date(i.match_time * 1000)).format('MM'),
        day: moment(new Date(i.match_time * 1000)).format('DD'),
        data: [i],
      };
      _list.push(_item);
    }
  });
  return _list;
}

const Stats: React.FC<IProps> = (props) => {
  const { competitionId, seasonId } = props;

  const [loading, setLoading] = useState<boolean>(false);

  const [matchList, setMatchList] = useState<MatchDateFormatDataItem[]>([]);

  const init = async (id: number, season_id?: number) => {
    setLoading(true);
    const result = await matchPageService.fetchMatchListForInfo({
      tab_type: 0,
      competition_id: competitionId,
      timestamp: 0,
      asc: true,
      season_id,
    });
    setLoading(false);
    if (result.success) {
      const { matches } = result.data;
      if (matches) {
        setMatchList(formatMatchData(matches));
      } else {
        setMatchList([]);
      }
    }
  };

  useEffect(() => {
    if (!competitionId || !seasonId) return;
    init(competitionId, seasonId);
  }, [competitionId, seasonId]);

  return (
    <Spin spinning={loading}>
      <div>{matchList && matchList.length > 0 ? <MatchList data={matchList} /> : <Empty />}</div>
    </Spin>
  );
};

export default Stats;
