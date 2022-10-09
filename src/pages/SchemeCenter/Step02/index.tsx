import { OddInfo } from '@/pages/ProfileCenter/create/createPc';
import { OddTags } from '@/utils/scheme';
import { Button, Dialog, Divider, Input, NavBar, Space, TextArea } from 'antd-mobile';
import React, { useState } from 'react';
import { useHistory, useLocation, useSelector } from 'umi';
import styles from './index.less';
import lodash from 'lodash';
import { message } from 'antd';
import { addScheme, getMatchOdds } from '@/services/scheme';
import { ConnectState } from '@/models/connect';
import { UserInfoType } from '@/services/user';

type Props = {};
type ParamsInfo = OddInfo & { type_id: number; gold_coin: number };

const SchemeCreateStep2: React.FC<Props> = (props) => {
  const location = useLocation<ParamsInfo>();
  const history = useHistory();
  const user = useSelector<ConnectState, UserInfoType | null | undefined>(
    (s) => s.user.currentUser,
  );
  const { state } = location;
  const [describe, setDescribe] = useState('');
  const [intro, setIntro] = useState('');
  const [detail, setDetail] = useState('');

  const back = () => {
    history.goBack();
  };

  const retry = async () => {
    const result = await Dialog.confirm({
      content: '返回后您输入的内容将被删除，确认返回重新选择？',
    });
    if (result) {
      history.replace('/zh/profile/center/create');
    }
  };

  const confirmSubmit = async () => {
    if (lodash.isEmpty(describe)) {
      message.error('请输入标题');
      return;
    }
    if (lodash.isEmpty(detail)) {
      message.error('请输入攻略正文');
      return;
    }
    const result = await getMatchOdds({ match_id: state.match_id, type_id: state.type_id });
    if (result.err) {
      message.error(result.message);
      return;
    }

    const odds = result.data.odds as Array<any>;
    const oddsItem = odds.find((item) => item.odd_scheme_id == state.odd_scheme_id);
    const tagOdds = oddsItem.odds.find((item: any) => item.tag == state.tag);
    if (tagOdds.odd != state.odd) {
      const result = await Dialog.confirm({
        title: '赔率发生了变化，是否继续？',
        content: `选择的比赛：${state.home_team_name} VS ${state.away_team_name},最新赔率是${tagOdds.odd}`,
      });
      if (result) {
        submitScheme();
      }
    } else {
      const result = await Dialog.confirm({
        content: '确认提交？',
      });
      if (result) {
        submitScheme();
      }
    }
  };

  const submitScheme = async () => {
    const params = {
      ...state,
      detail,
      describe,
      intro,
      expert_id: user?.expert?.id,
      published_at: Math.round(Date.now() / 1000),
      detail_count: detail.length,
    };

    const result = await addScheme(params);
    if (result.err) {
      message.error(result.message);
      return;
    } else {
      history.replace('/zh/profile/center');
    }
  };

  return (
    <div className={styles.container}>
      <NavBar
        className={styles.navbar}
        onBack={back}
        right={
          <Button className={styles.retry_button} onClick={confirmSubmit}>
            提交
          </Button>
        }
      >
        发布攻略
      </NavBar>
      <div className={styles.info_box}>
        <div className={styles.card}>
          <div className={styles.odds_box}>
            <div>
              <span>{state.type_id == 1 ? '竞彩' : '北单'}</span>
              <Divider direction="vertical" style={{ margin: '0px 10px' }} />
              <Space>
                <span>{`${state.home_team_name}VS${state.away_team_name}`}</span>
                <span>{state.scheme_title}</span>
              </Space>
              <Divider direction="vertical" style={{ margin: '0px 10px' }} />
              <span>
                {OddTags.title(state.tag)}
                {state.odd}
              </span>
            </div>
          </div>
          <div className={styles.odds_box} style={{ marginTop: '10px' }}>
            <div>
              <span>单关</span>
              <Divider direction="vertical" style={{ margin: '0px 10px' }} />
              <span>{state.gold_coin == 0 ? '免费' : `${state.gold_coin}金豆`}</span>
            </div>
            <Button className={styles.retry_button} onClick={retry}>
              重新选择
            </Button>
          </div>
        </div>
        <div className={styles.card}>
          <Input
            className={styles.input}
            placeholder="请输入标题"
            value={describe}
            onChange={(val) => {
              setDescribe(val);
            }}
            maxLength={44}
          />
        </div>
        <div className={styles.card}>
          <TextArea
            className={styles.input}
            placeholder="请输入攻略描述"
            value={intro}
            onChange={(val) => {
              setIntro(val);
            }}
            maxLength={200}
            rows={4}
            showCount
          />
        </div>
        <div className={styles.card}>
          <TextArea
            className={styles.input}
            placeholder="请输入攻略正文，需要满足定价条件才可以查看"
            value={detail}
            onChange={(val) => {
              setDetail(val);
            }}
            rows={6}
            showCount
          />
        </div>
      </div>
    </div>
  );
};

export default SchemeCreateStep2;
