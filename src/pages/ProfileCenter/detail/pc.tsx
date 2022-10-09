import { SCHEME_STATE } from '@/constants/index';
import { OddTags } from '@/utils/scheme';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Form } from 'antd';
import dayjs from 'dayjs';
import React from 'react'
import { useLocation } from 'umi';

type Props = {}

const SchemeDetail: React.FC<Props> = (props) => {

  const location = useLocation<any>();
  const { state } = location;
  const odds = state?.play_odds?.odds?.find((item: any) => item?.selected)

  console.log(state)

  return (
    <PageContainer>
      <Card>
        <Form style={{ marginBottom: 16, justifyContent: 'flex-end' }}>
          <Form.Item label="彩种选择">{state.type_id == 1 ? '竞彩' : '北单'}</Form.Item>
          <Form.Item label="推荐项">{`[主]${state.home_team_name} VS [客]${state.away_team_name}     ${
            state?.play_odds?.scheme_title
          }     ${OddTags.title(odds?.tag)}@${odds?.odd}`}</Form.Item>
          <Form.Item label="过关玩法">单关</Form.Item>
          <Form.Item label="攻略定价">{`${state.gold_coin}金豆`}</Form.Item>
          <Form.Item label="发布时间">{dayjs(state.published_at * 1000).format('YYYY-MM-DD HH:mm:ss')}</Form.Item>
          <Form.Item label="方案状态">{SCHEME_STATE[state.state]}</Form.Item>
          <Form.Item label="攻略标题">{`${state.describe}`}</Form.Item>
          <Form.Item label="攻略描述">{`${state.intro ?? ''}`}</Form.Item>
          <Form.Item label="攻略正文">{`${state.detail}`}</Form.Item>
        </Form>
      </Card>
    </PageContainer>
  )
}

export default SchemeDetail