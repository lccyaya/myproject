import React, { useState } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import classnames from 'classnames';
import { FormattedMessage } from 'umi';
import type { ColumnProps } from 'antd/es/table';
// import Mark from '@/components/Mark';
import { normalizeFloat } from '@/utils/tools';

import HistoryModal from '../history';

import type * as matchService from '@/services/match';

import styles from './index.less';
import hot from '@/assets/hot.svg';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { report } from '@/services/ad';
import MEmpty from '@/components/Empty';

const hasInit = (record: matchService.OddsCompanyType) => {
  if (record.init && record.spot) return true;
};

interface IProps {
  data: matchService.OddsCompanyType[];
  match: matchService.MatchDetails;
  matchId: number;
  type: matchService.OddsType;
  smallView?: boolean;
}
const Ranking: React.FC<IProps> = (props) => {
  const { data: dataSource, smallView } = props;
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<matchService.OddsCompanyType | null>(null);

  const columns: ColumnProps<matchService.OddsCompanyType>[] = [
    {
      title: <FormattedMessage id="key_company" />,
      dataIndex: 'name',
      key: 'name',
      width: '10%',
      render: (name) => {
        return (
          <div className={classnames(styles.title)}>
            {/* <Mark className={styles.mark} text="Hot" color="red" textColor="#fff" /> */}
            {!smallView && <img className={styles.mark} src={hot} />}
            <span className={styles.name}>{name}</span>
          </div>
        );
      },
    },
    {
      title: <FormattedMessage id="key_type" />,
      dataIndex: 'type',
      key: 'type',
      width: '7%',
      render: (_, record) => {
        return (
          <div className={`${styles.company} ${smallView ? styles.smallView : ''}`}>
            <div>
              <FormattedMessage id="key_spot" />
            </div>
            <div>
              <FormattedMessage id="key_inital" />
            </div>
          </div>
        );
      },
    },
    {
      title: <FormattedMessage id="key_home" />,
      dataIndex: 'home',
      key: 'home',
      width: '6%',
      render: (_, record) => {
        if (!hasInit(record)) return null;
        return (
          <div
            className={classnames(styles.company, styles.home, smallView ? styles.smallView : '')}
          >
            <div className={styles.spot}>{normalizeFloat(record.spot.home)}</div>
            <div>{normalizeFloat(record.init.home)}</div>
          </div>
        );
      },
    },
    {
      title: <FormattedMessage id="key_draw" />,
      dataIndex: 'draw',
      key: 'draw',
      width: '6%',
      render: (_, record) => {
        if (!hasInit(record)) return '-';
        return (
          <div
            className={classnames(styles.company, styles.draw, smallView ? styles.smallView : '')}
          >
            <div className={styles.spot}>{normalizeFloat(record.spot.draw)}</div>
            <div>{normalizeFloat(record.init.draw)}</div>
          </div>
        );
      },
    },
    {
      title: <FormattedMessage id="key_away" />,
      dataIndex: 'away',
      key: 'away',
      width: '6%',
      render: (_, record) => {
        if (!hasInit(record)) return '-';
        return (
          <div
            className={classnames(styles.company, styles.away, smallView ? styles.smallView : '')}
          >
            <div className={styles.spot}>{normalizeFloat(record.spot.away)}</div>
            <div>{normalizeFloat(record.init.away)}</div>
          </div>
        );
      },
    },
    {
      title: <FormattedMessage id="key_time" />,
      dataIndex: 'time',
      key: 'time',
      width: '10%',
      ellipsis: true,
      render: (_, record) => {
        if (!hasInit(record)) return '-';
        return (
          <div className={styles.title}>
            <div>{moment(new Date(record.spot.updated_at * 1000)).format('DD MMM')}</div>
            <div>{moment(new Date(record.spot.updated_at * 1000)).format('hh:mm A')}</div>
            {/* <div>{moment(new Date(record.init.updated_at * 1000)).format('DD MMM HH:mm a')}</div> */}
          </div>
        );
      },
    },
  ];
  return (
    <div className={`${styles.stats} ${smallView ? styles.smallView : ''}`}>
      <Table
        locale={{ emptyText: <MEmpty style={{ paddingBottom: '40px' }} /> }}
        onRow={(record) => {
          return {
            onClick: (event) => {
              setHistoryVisible(true);
              setCurrentItem(record);
              report({
                cate: REPORT_CATE.match_detail,
                action: REPORT_ACTION.match_detail_company_click,
              });
            }, // 点击行
          };
        }}
        dataSource={dataSource}
        rowClassName={(record, index) => (!!record.hot ? styles.markWrapper : '')}
        pagination={false}
        columns={columns}
        rowKey="id"
      />
      {currentItem && (
        <HistoryModal
          type={props.type}
          matchId={props.matchId}
          match={props.match}
          odd={currentItem}
          visible={historyVisible}
          onCancel={() => {
            setHistoryVisible(false);
            setCurrentItem(null);
          }}
        />
      )}
    </div>
  );
};

export default Ranking;
