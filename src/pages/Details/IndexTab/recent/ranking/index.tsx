import React from 'react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import classnames from 'classnames';
import moment from 'moment';
import Empty from '@/components/Empty';
import { FormattedMessage } from 'umi';

import * as matchService from '@/services/match';

import styles from './index.less';

interface IProps {
  data: matchService.TeamHistoryVSItemType[];
}
const Ranking: React.FC<IProps> = (props) => {
  const { data: dataSource } = props;

  const columns: ColumnProps<matchService.TeamHistoryVSItemType>[] = [
    {
      title: 'match_time',
      dataIndex: 'match_time',
      key: 'match_time',
      render: (match_time) => {
        return moment(new Date(match_time * 1000)).format('MM/DD/YYYY');
      }
    },
    {
      title: 'competition_name',
      dataIndex: 'competition_name',
      key: 'competition_name',
    },
    {
      title: 'home',
      dataIndex: 'home',
      key: 'home',
      render: (_, record) => {
        return (
          <div className={classnames(styles.home, styles.team)}>
            <span>{record.home.team_name}</span>
            <img className={styles.logo} src={record.home.team_logo} />
          </div>
        )
      }
    },
    {
      title: 'score',
      dataIndex: 'score',
      key: 'score',
      render: (_, record) => {
        return (
          <div className={styles.score}>
            <span>{record.home.score}</span>
            <span>:</span>
            <span>{record.away.score}</span>
          </div>
        )
      }
    },
    {
      title: 'away',
      dataIndex: 'away',
      key: 'away',
      render: (_, record) => {
        return (
          <div className={classnames(styles.away, styles.team)}>
            <span>{record.away.team_name}</span>
            <img className={styles.logo} src={record.away.team_logo} />
          </div>
        )
      }
    },
  ];
  return (
    <div className={styles.table}>
      <Table locale={{ emptyText: <Empty /> }} dataSource={dataSource} pagination={false} columns={columns} />
    </div>
  );
};

export default Ranking;
