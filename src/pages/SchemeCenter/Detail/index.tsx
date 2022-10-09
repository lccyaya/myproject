import { OddTags } from '@/utils/scheme';
import { Divider, NavBar, Space } from 'antd-mobile';
import React from 'react';
import { useHistory, useLocation } from 'umi';
import styles from './index.less';
import lodash from 'lodash';

type Props = {};

const SchemDetail: React.FC<Props> = (props) => {
  const location = useLocation<any>();
  const history = useHistory();
  const back = () => {
    history.goBack();
  };
  const { state } = location;
  const odds = state?.play_odds?.odds?.find((item: any) => item?.selected);

  return (
    <div className={styles.container}>
      <NavBar className={styles.navbar} onBack={back}>
        查看攻略详情
      </NavBar>
      <div className={styles.info_box}>
        <div className={styles.card}>
          <div className={styles.odds_box}>
            <div>
              <span>{state.type_id == 1 ? '竞彩' : '北单'}</span>
              <Divider direction="vertical" style={{ margin: '0px 10px' }} />
              <Space>
                <span>{`${state.home_team_name}VS${state.away_team_name}`}</span>
                <span>{state?.play_odds?.scheme_title}</span>
              </Space>
              <Divider direction="vertical" style={{ margin: '0px 10px' }} />
              <span>
                {OddTags.title(odds?.tag)}
                {odds?.odd}
              </span>
            </div>
          </div>
          <div className={styles.odds_box} style={{ marginTop: '10px' }}>
            <div>
              <span>单关</span>
              <Divider direction="vertical" style={{ margin: '0px 10px' }} />
              <span>{state.gold_coin == 0 ? '免费' : `${state.gold_coin}金豆`}</span>
            </div>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.scheme_text}>{state.describe}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.scheme_text}>
            {lodash.isEmpty(state.intro) ? '无' : state.intro}
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.scheme_text}>{state.detail}</div>
        </div>
      </div>
    </div>
  );
};

export default SchemDetail;
