import React from 'react';
import { Table } from 'antd';
import { padStart } from 'lodash';
import classnames from 'classnames';
import type { ColumnProps } from 'antd/es/table';
import { FormattedMessage, history } from 'umi';
import type * as matchService from '@/services/match';

import styles from './index.less';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { report } from '@/services/ad';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import MEmpty from '@/components/Empty';

interface IProps {
  data: matchService.TeamRankingItemType[];
  match?: matchService.MatchDetails;
  size?: 'small';
}
const Ranking: React.FC<IProps> = (props) => {

  const { data: dataSource, match, size } = props;

  let columns: ColumnProps<matchService.TeamRankingItemType>[] = [
    {
      title: <FormattedMessage id="key_ranking" />,
      dataIndex: 'ranking',
      key: 'ranking',
      width: '100',
      render: (_, record) => {
        return (
          <div className={classnames(styles.leagueRanking, size === 'small' ? styles.smallRank : '')}>
            <span className={classnames(styles.position, record.position <= 3 ? styles.good : '')}>{padStart(`${record.position}`, 2, '0')}</span>
            <img className={styles.logo} src={record.team_logo} />
            <span className={styles.teamName}>{record.team_name}</span>
          </div>
        )
      }
    },
    {
      title: "P",
      dataIndex: 'played',
      key: 'played',
      width: size === 'small' ? '10px' : '5%',
    },
    {
      title: "W",
      dataIndex: 'won',
      key: 'won',
      width: size === 'small' ? '10px' : '5%',
    },
    {
      title: "D",
      dataIndex: 'drawn',
      key: 'drawn',
      width: size === 'small' ? '10px' : '5%',
    },
    {
      title: "L",
      dataIndex: 'lost',
      key: 'lost',
      width: size === 'small' ? '10px' : '5%',
    },

  ];

  columns = columns.concat([
    {
      title: "P/A",
      dataIndex: 'pa',
      key: 'pa',
      width: size === 'small' ? '10px' : '5%',
      render: (_, record) => {
        return (
          <div className={styles.leagueRanking}>
            <span>{record.goals}</span>
            <span>/</span>
            <span>{record.against}</span>
          </div>
        )
      }
    },
    {
      title: <FormattedMessage id="key_pts" />,
      dataIndex: 'pts',
      key: 'pts',
      width: size === 'small' ? '10px' : '5%',
    },
  ])

  return (
    <div className={classnames(styles.stats, size === 'small' ? styles.small : '')}>
      <Table
        rowClassName={(record) => {
          return (match && (record.team_name === match.home_team_name || record.team_name === match.away_team_name)) ? styles.current : ''
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              if (/details\/\d+/.test(history.location.pathname)) {
                report({
                  cate: REPORT_CATE.match_detail,
                  action: REPORT_ACTION.match_detail_team_enter,
                });
              } else if (/info/.test(history.location.pathname)) {
                report({
                  cate: REPORT_CATE.info,
                  action: REPORT_ACTION.info_team_enter,
                });
              }
              const lang = toShortLangCode(locale.getLocale());
              history.push(`/${lang}/teamdetails/${record.team_id}`);
            },
          };
        }}
        // rowClassName={styles.current}
        locale={{ emptyText: <MEmpty style={{ paddingBottom: '40px' }} /> }}
        dataSource={dataSource}
        pagination={false}
        columns={columns}
        rowKey='team_id'
      />
    </div>
  );
};

export default Ranking;
