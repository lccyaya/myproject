import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import Court from '@/components/Football/Court';
import PlayerList from '@/components/Football/Player/List';
import * as matchService from '@/services/match';
import MEmpty from '@/components/Empty';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import { FormattedMessage } from 'umi';

import classnames from 'classnames';
import styles from './index.less';
import { checkIsPhone } from '@/utils/utils';

const arr = (count: number) => {
  const s = [];
  for (let index = 1; index <= count; index++) {
    if (index === 1 || index === count) {
      s.push({
        x: 50 * index,
        y: 5 * index,
        name: `messi - ${index}`,
        number: '11',
        red: true,
      });
    } else if (index % 2 === 0) {
      s.push({
        x: 50 * index,
        y: 10 * index,
        name: `messi - ${index}`,
        number: '11',
        time: '90',
        yellow: true,
      });
    } else {
      s.push({
        x: 40 * index,
        y: 25 * index,
        name: `messi - ${index}`,
        number: '11',
        out: true,
        time: '90',
      });
    }
  }
  return s;
};

interface IProps {
  matchId: number;
  isPhone?: boolean;
  status: number;
}
const LineUp: React.FC<IProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<matchService.MatchLineup>();

  const init = async () => {
    setLoading(true);
    const result = await matchService.matchLineup({ match_id: props.matchId }); // http://localhost:8000/#/details/3540548
    setLoading(false);
    if (result.success) {
      setData(result.data);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Spin spinning={loading}>
      <>
        {data && data.confirmed ? (
          <div className={styles.container}>
            <div className={styles.formatWrapper}>
              <div className={styles.formatStr}>
                <div className={classnames(styles.formatInfo)}>
                  <span className={styles.name}>{data.home_name}</span>
                  <span className={styles.format}>{data.home_formation}</span>
                </div>
                <div className={classnames(styles.formatInfo, styles.rightInfo)}>
                  <span className={styles.name}>{data.away_name}</span>
                  <span className={styles.format}>{data.away_formation}</span>
                </div>
              </div>
              <Court
                isPhone={checkIsPhone()}
                data={[...data.away.filter(i => i.first).map(i => {
                  return { ...i, isHome: false }
                }), ...data.home.filter(i => i.first).map(i => {
                  return { ...i, isHome: true }
                })]}
                status={props.status}
              />
              <PlayerList
                data={[
                  {
                    type: 'coach',
                    name: <FormattedMessage id="key_coach" />,
                    home: [{ ...data.home_coach, isHome: true } as any],
                    away: [{ ...data.away_coach, isHome: false } as any],
                  },
                  {
                    type: 'bench',
                    name: <FormattedMessage id="key_bench" />,
                    home: data.home.filter(i => !i.first).map(i => {
                      return { ...i, isHome: true }
                    }),
                    away: data.away.filter(i => !i.first).map(i => {
                      return { ...i, isHome: false }
                    }),
                  },
                  {
                    type: 'absence',
                    name: <FormattedMessage id="key_absence" />,
                    home: data.home_absence && data.home_absence.map(i => {
                      return {
                        ...i, isHome: true,
                      }
                    }) as any,
                    away: data.away_absence && data.away_absence.map(i => {
                      return {
                        ...i, isHome: false,
                      }
                    }) as any,
                  },
                ]}
              />
            </div>
          </div>
        ) : (
          <MEmpty style={{ paddingBottom: '40px' }} />
        )}
      </>
    </Spin>
  );
};


export default connect(({ user, divice }: ConnectState) => ({
  isPhone: divice.isPhone,
}))(LineUp);
