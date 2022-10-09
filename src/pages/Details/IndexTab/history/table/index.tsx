import React from 'react';
import { Table } from 'antd';
import { FormattedMessage, useIntl } from 'umi';
import moment from 'moment';
import classnames from 'classnames';
import ScrollView from 'react-custom-scrollbars';
import Empty from '@/components/Empty';
import type { ColumnProps } from 'antd/es/table';
import Mark from '@/components/Mark';

import type * as matchService from '@/services/match';

import styles from './index.less';

const hasInit = (record: matchService.OddsItem) => {
  if (record) return true;
};

interface IProps {
  data: matchService.OddsCompanyType[];
  name: string;
}
const Ranking: React.FC<IProps> = (props) => {
  const intl = useIntl()
  const { data: dataSource } = props;

  const columns: ColumnProps<matchService.OddsItem>[] = [
    {
      title: <FormattedMessage id="key_company" />,
      dataIndex: 'name',
      key: 'name',
      width: '10%',
      render: () => {
        
        return (
          <div className={classnames(styles.title)}>
            <Mark className={styles.mark} text={intl.formatMessage({id: 'key_hot'})} color="red" textColor="#fff" />
            <span className={styles.name}>{props.name}</span>
          </div>
        );
      },
    },
    // {
    //   title: 'Type',
    //   dataIndex: 'type',
    //   key: 'type',
    //   render: (_, record) => {
    //     return (
    //       <div className={styles.company}>
    //         <div>Spot</div>
    //         <div>Initial</div>
    //       </div>
    //     )
    //   }
    // },
    {
      title: <FormattedMessage id="key_home" />,
      dataIndex: 'home',
      key: 'home',
      width: '5%',
      render: (_, record) => {
        if (!hasInit(record)) return null;
        return (
          <div className={classnames(styles.company, styles.home)}>
            {/* <div className={styles.spot}>{record!.home}</div> */}
            <div>{record!.home}</div>
          </div>
        );
      },
    },
    {
      title: <FormattedMessage id="key_draw" />,
      dataIndex: 'draw',
      key: 'draw',
      width: '5%',
      render: (_, record) => {
        if (!hasInit(record)) return '-';
        return (
          <div className={classnames(styles.company, styles.draw)}>
            {/* <div className={styles.spot}>{record!.draw}</div> */}
            <div>{record!.draw}</div>
          </div>
        );
      },
    },
    {
      title: <FormattedMessage id="key_away" />,
      dataIndex: 'away',
      key: 'away',
      width: '5%',
      render: (_, record) => {
        if (!hasInit(record)) return '-';
        return (
          <div className={classnames(styles.company, styles.away)}>
            {/* <div className={styles.spot}>{record!.away}</div> */}
            <div>{record!.away}</div>
          </div>
        );
      },
    },
    {
      title: <FormattedMessage id="key_time" />,
      dataIndex: 'time',
      key: 'time',
      render: (_, record) => {
        if (!hasInit(record)) return '-';
        return (
          <div className={styles.company}>
            {/* <div>{moment(new Date(record!.updated_at * 1000)).format('DD MMM HH:mm a')}</div> */}
            <div>
              {moment(new Date(Number(record!.updated_at) * 1000)).format('DD MMM')}
            </div>
            <div>
              {moment(new Date(Number(record!.updated_at) * 1000)).format('HH:mm a')}
            </div>
            {/* <div>
              {moment(new Date(Number(record!.updated_at) * 1000)).format('HH:mm a')}
            </div> */}
          </div>
        );
      },
    },
  ];
  return (
    <ScrollView autoHeight
      autoHeightMin={300}
      autoHeightMax={500}>
      <div className={styles.stats}>
        {
          // @ts-ignore
          <Table
            locale={{ emptyText: <Empty /> }}
            dataSource={dataSource}
            pagination={false}
            columns={columns}
          />
        }
      </div>
    </ScrollView>

  );
};

export default Ranking;
