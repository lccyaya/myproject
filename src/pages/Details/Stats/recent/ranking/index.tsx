import React from 'react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import classnames from 'classnames';
import moment from 'moment';
import Empty from '@/components/Empty';

import * as matchService from '@/services/match';

import styles from './index.less';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { checkIsPhone, toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';

interface IProps {
  data: matchService.TeamHistoryVSItemType[];
  isPhone: boolean;
}
const Ranking: React.FC<IProps> = (props) => {
  const { data: dataSource } = props;
  const isPhone = checkIsPhone();

  let columns: ColumnProps<matchService.TeamHistoryVSItemType>[] = [
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
          isPhone ? (
            <div>
              <div className={classnames(styles.away, styles.team)}>
                <img className={styles.logo} src={record.home.team_logo} />
                <span title={record.home.team_name} className={styles.team_name}>{record.home.team_name}</span>
              </div>
              <div className={styles.score}>
                <span>{record.home.score}</span>
                <span>:</span>
                <span>{record.away.score}</span>
              </div>
              <div className={classnames(styles.away, styles.team)}>
                <img className={styles.logo} src={record.away.team_logo} />
                <span title={record.away.team_name} className={styles.team_name}>{record.away.team_name}</span>
              </div>
            </div>
          ) : (
            <div className={classnames(styles.home, styles.team)}>
              <img className={styles.logo} src={record.home.team_logo} />
              <span title={record.home.team_name} className={styles.team_name}>{record.home.team_name}</span>
            </div>
          )

          // <div className={classnames(styles.home, styles.team)}>
          //   <img className={styles.logo} src={record.home.team_logo} />
          //   <span title={record.home.team_name} className={styles.team_name}>{record.home.team_name}</span>
          // </div>
        )
      }
    },
    // {
    //   title: 'score',
    //   dataIndex: 'score',
    //   key: 'score',
    //   render: (_, record) => {
    //     return (
    //       <div className={styles.score}>
    //         <span>{record.home.score}</span>
    //         <span>:</span>
    //         <span>{record.away.score}</span>
    //       </div>
    //     )
    //   }
    // },
    // {
    //   title: 'away',
    //   dataIndex: 'away',
    //   key: 'away',
    //   render: (_, record) => {
    //     return (
    //       <div className={classnames(styles.away, styles.team)}>
    //         <img className={styles.logo} src={record.away.team_logo} />
    //         <span title={record.away.team_name} className={styles.team_name}>{record.away.team_name}</span>
    //       </div>
    //     )
    //   }
    // },
  ];

  if (!isPhone) {
    columns = columns.concat([
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
              <img className={styles.logo} src={record.away.team_logo} />
              <span title={record.away.team_name} className={styles.team_name}>{record.away.team_name}</span>
            </div>
          )
        }
      },
    ])
  }
  const lang = toShortLangCode(locale.getLocale());
  return (
    <div className={styles.table}>
      <Table
        locale={{ emptyText: <Empty /> }}
        onRow={(record) => {
          return {
            onClick: () => {
              report({
                cate: REPORT_CATE.match_detail,
                action: REPORT_ACTION.match_detail_match_enter,
              });
              window.open(`/${lang}/details/${record.match_id}`);
            },
          };
        }}
        dataSource={dataSource}
        pagination={false}
        columns={columns}
      />
    </div>
  );
};

// export default Details;
export default connect(({ divice }: ConnectState) => ({
  isPhone: divice.isPhone,
}))(Ranking);
