import IconFont from '@/components/IconFont';
import { OddInfo } from '@/pages/ProfileCenter/create/createPc';
import { Grid } from 'antd-mobile';
import dayjs from 'dayjs';
import { matches } from 'lodash';
import React from 'react';
import styles from './index.less';
import classnames from 'classnames';

type Props = {
  match: any;
  typeId: number;
  onSelected: (info: OddInfo) => void;
  selectOdds: OddInfo | undefined;
};

const MatchCell: React.FC<Props> = (props) => {
  const { match, typeId, onSelected, selectOdds } = props;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.home_des}>[主]</span>
        <span className={styles.team_name}>{match.match.home_team_name}</span>
        <IconFont type="icon-VS" color="#4E6280" size={20} />
        <span className={styles.team_name}>{match.match.away_team_name}</span>
      </div>
      <div className={styles.info_box}>
        <div className={styles.match_info}>
          <div className={styles.competition_name}>{match.match.competition_name}</div>
          <div className={styles.match_time}>
            {dayjs(match.match.match_time * 1000).format('HH:mm')}
          </div>
        </div>
        <div className={styles.odds_table}>
          {match.odds?.map((item: any) => (
            <Grid
              className={styles.odds_row}
              columns={typeId == 1 ? 4 : 3}
              gap={5}
              key={item.odd_scheme_id}
            >
              <Grid.Item className={styles.odds_cell} key={item.odd_scheme_id}>
                <div className={styles.odds_title}>{item.scheme_title}</div>
              </Grid.Item>
              {item.odds.map((odds: any, index: number) => {
                const info = {
                  odd_scheme_id: item.odd_scheme_id,
                  match_id: match.match.match_id,
                  tag: odds.tag,
                  odd: odds.odd,
                  home_team_name: match.match.home_team_name,
                  away_team_name: match.match.away_team_name,
                  scheme_title: item.scheme_title,
                };
                const selected =
                  selectOdds?.odd_scheme_id == item.odd_scheme_id && selectOdds?.tag == odds.tag;
                const disabled = typeId == 1 && odds.odd < 1.4;
                return (
                  <Grid.Item
                    className={classnames(
                      styles.odds_cell,
                      selected ? styles.selected : '',
                      disabled ? styles.disabled : '',
                    )}
                    key={index}
                    onClick={() => {
                      if (disabled) {
                        return;
                      }
                      onSelected(info);
                    }}
                  >
                    <div className={styles.odds_title}>{odds.title}</div>
                    <div className={styles.odds_title}>{odds.odd}</div>
                  </Grid.Item>
                );
              })}
            </Grid>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchCell;
