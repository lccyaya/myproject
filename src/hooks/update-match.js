import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { MatchByIds } from '@/services/matchPage';
import { getMatchStatus, MatchStatus } from '@/utils/match';
import moment from 'moment';

const getNeedUpdateMatch = (matchList) => {
  return matchList.filter(
    (e) =>
      getMatchStatus(e.status) === MatchStatus.Going ||
      (getMatchStatus(e.status) === MatchStatus.Before &&
        Math.abs(moment().unix() - e.match_time) < 30 * 60),
  );
};
export const useUpdateMatch = (matchList = [], updateMatchList) => {
  const listRef = useRef([]);
  useEffect(() => {
    listRef.current = matchList;
  }, [matchList]);
  useEffect(() => {
    let timer = setInterval(async () => {
      const needUpdateMatchList = getNeedUpdateMatch(listRef.current);
      const ids = needUpdateMatchList.map((item) => item.match_id);
      if (ids.length !== 0) {
        MatchByIds({
          match_ids: ids,
        }).then((e) => {
          if (e.success) {
            updateMatchList(
              listRef.current,
              e.data?.map((item) => {
                return item;
              }),
            );
          }
        });
      }
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return [];
};
