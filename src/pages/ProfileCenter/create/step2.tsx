import { ConnectState } from '@/models/connect';
import { addScheme, getMatchOdds } from '@/services/scheme';
import { UserInfoType } from '@/services/user';
import { OddTags } from '@/utils/scheme';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Form, Input, message, Modal } from 'antd';
import React, { useEffect } from 'react';
import { useHistory, useLocation, useParams, useSelector } from 'umi';
import Editor from 'wangeditor';
import { OddInfo } from './index';

//转意符换成普通字符
const convertIdeogramToNormalCharacter = (val: string) => {
  const arrEntities = { lt: '<', gt: '>', nbsp: ' ', amp: '&', quot: '"' };
  return val.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
    return arrEntities[t];
  });
};

// 获取富文本的纯文字内容
const getPlainText = (richCont: string | null) => {
  const str = richCont;
  let value = richCont;
  if (richCont) {
    // 方法一：
    value = value.replace(/\s*/g, ''); //去掉空格
    value = value.replace(/<[^>]+>/g, ''); //去掉所有的html标记
    value = value.replace(/↵/g, ''); //去掉所有的↵符号
    value = value.replace(/[\r\n]/g, ''); //去掉回车换行
    value = value.replace(/&nbsp;/g, ''); //去掉空格
    value = convertIdeogramToNormalCharacter(value);
    return value;
  } else {
    return null;
  }
};

type Props = {};
type ParamsInfo = OddInfo & { type_id: number; gold_coin: number };

let editor: Editor | undefined = undefined;

const SchemeCreateStep2 = (props: Props) => {
  const location = useLocation<ParamsInfo>();
  const { state } = location;
  const [form] = Form.useForm();
  const history = useHistory();
  const user = useSelector<ConnectState, UserInfoType | null | undefined>(
    (s) => s.user.currentUser,
  );

  console.log(state);
  const rechoose = () => {
    history.push('/zh/profile/center/create', state);
  };

  useEffect(() => {
    editor = new Editor('#J_Editor_FENXI');

    editor.config = {
      ...editor.config,
      menus: ['head', 'indent', 'emoticon', 'undo', 'redo'],
      withCredentials: true,
      height: 400,
      zIndex: 100,
      placeholder: '请输入攻略正文,需要满足定价条件才可以查看，纯文本需200字以上',
      onchange: (newHtml: any) => form.setFieldsValue({ detail: newHtml }),
    };

    editor.create();
    form.setFieldsValue({
      matchInfo: undefined,
      oddSchemeInfo: undefined,
      expert_id: undefined,
      gold_coin: undefined,
      describe: undefined,
      published_at: undefined,
      detail: undefined,
    });

    return () => editor?.destroy();
  }, []);

  const confirmScheme = async (values: any) => {
    console.log(values);
    const params = {
      ...state,
      ...values,
      expert_id: user?.expert?.id,
      published_at: Math.round(Date.now()/1000),
      detail_count: values.detail ? getPlainText(values.detail)?.length : 0,
    };

    const result = await getMatchOdds({ match_id: state.match_id, type_id: state.type_id });
    if (result.err) {
      message.error(result.message)
      return
    }
    const odds = result.data.odds as Array<any>
    const oddsItem = odds.find(item => item.odd_scheme_id == state.odd_scheme_id)
    const tagOdds = oddsItem.odds.find(item => item.tag == state.tag)
    if (tagOdds.odd != state.odd) {
      Modal.confirm({
        title: '赔率发生了变化，是否继续？',
        content: `选择的比赛：${state.home_team_name} VS ${state.away_team_name},最新赔率是${tagOdds.odd}`,
        onOk() {
          submitScheme(params)
        },
        onCancel() {
          
        },
      });
    }else {
      submitScheme(params)
    }

  };

  const submitScheme = async (params: any) => {
    const result = await addScheme(params);
    if (result.err) {
      message.error(result.message)
      return
    }else {
      history.push('/zh/profile/center')
    }
  };

  return (
    <PageContainer>
      <Card>
        <Form layout="inline" style={{ marginBottom: 16, justifyContent: 'flex-end' }}>
          <Form.Item label="彩种选择">{state.type_id == 1 ? '竞彩' : '北单'}</Form.Item>
          <Form.Item label="推荐项">{`[主]${state.home_team_name} VS [客]${state.away_team_name} ${
            state.scheme_title
          } ${OddTags.title(state.tag)}@${state.odd}`}</Form.Item>
          <Form.Item label="过关玩法">单关</Form.Item>
          <Form.Item label="攻略定价">{`${state.gold_coin}金豆`}</Form.Item>
          <Form.Item>
            <Button type="primary" onClick={rechoose}>
              重新选择
            </Button>
          </Form.Item>
        </Form>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ lotteryType: 1 }}
          onFinish={confirmScheme}
        >
          <Form.Item label="攻略标题" name="describe" rules={[{ required: true }]}>
            <Input placeholder="请输入标题，44字以内" maxLength={44} />
          </Form.Item>
          <Form.Item label="攻略描述" name="intro">
            <Input.TextArea
              placeholder="请输入攻略描述，50字以上，可不填"
              maxLength={200}
              showCount
            />
          </Form.Item>
          <Form.Item label="攻略正文" name="detail" rules={[{ required: true }]}>
            {/* <Input.TextArea
              placeholder="请输入攻略正文,需要满足定价条件才可以查看，纯文本需200字以上"
              maxLength={2000}
              showCount
            /> */}
            <div
              id="J_Editor_FENXI"
              // className={styles.disbaled_box}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交审核
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default SchemeCreateStep2;
