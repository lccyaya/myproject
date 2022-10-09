import { Tabs } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { message } from 'antd';
import { useIntl, connect, FormattedMessage } from 'umi';
import type { Dispatch } from 'umi';
import type { ConnectState } from '@/models/connect';
import * as certificationService from '@/services/certification';

import styles from './index.less';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import PhoneNumber from '@/components/PhoneNumber';
import {PHONE_RULE} from '@/constants/rules'
import IconFont from '@/components/IconFont';

export type LoginProps = {
  dispatch: Dispatch;
  onSummit: (e: { email: string }) => void;
};
const { TabPane } = Tabs;

const Login: React.FC<LoginProps> = (props) => {
  // const { userLogin = {}, submitting } = props;
  const { onSummit, forgetParams = {} } = props;
  const [summitLoading, setSummitLoading] = useState<boolean>(false);
  const [channel, setChannel] = useState<string>(forgetParams.channel || 'email');
  // const { status, type: loginType } = userLogin;
  const intl = useIntl();

  const handleSubmit = async (values: { email: string; phone: string }) => {
    // 检查参数
    const checkParams = await certificationService.checkAccountIsRegistered({
      account: channel === 'email' ? values.email : values.phone,
      channel
    });
    if (!checkParams.success || !checkParams.data.is_registered) {
      message.error(intl.formatMessage({id: channel === 'email' ? 'key_email_no_register': 'key_phone_no_register' }))
      return 
    }
    report({
      action: REPORT_ACTION.forget_password_next,
      cate: REPORT_CATE.forget_password,
    });
    setSummitLoading(true);
    const { phone, email } = values;
    const params = {
      account: channel === 'email' ? email : phone,
      channel,
      scene: 'pwd-reset',
    };
    const result = await certificationService.getCaptchaCode(params);
    setSummitLoading(false);
    console.log(result, 9999)
    if (result.success) {
      onSummit(params);
    } else {
      message.error(result.message || 'Request Error');
    }
  };
  const EmailForm = (
      <ProForm
        initialValues={{
          autoLogin: true,
        }}
        submitter={{
          searchConfig: {
            submitText: intl.formatMessage({
              id: 'key_next',
            }),
          },
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: summitLoading,
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
        onFinish={(values) => {
          handleSubmit(values as { email: string });
          return Promise.resolve();
        }}
      >
        <ProFormText
          name="email"
          fieldProps={{
            size: 'large',
            prefix: <IconFont type="icon-wangji" className={styles.prefixIcon} size={14} />,
          }}
          placeholder={intl.formatMessage({
            id: 'key_email_address',
          })}
          rules={[
            {
              required: true,
              message: <FormattedMessage id="key_this_is_required" />,
            },
            {
              pattern: /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g,
              message: <FormattedMessage id="key_invalid_email" />,
            },
          ]}
        />
      </ProForm>
  );
  const PhoneForm = (
      <ProForm
        initialValues={{
          autoLogin: true,
          phone: forgetParams.phone
        }}
        submitter={{
          searchConfig: {
            submitText: intl.formatMessage({
              id: 'key_next',
            }),
          },
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: summitLoading,
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
        onFinish={(values) => {
          handleSubmit(values as { phone: string });
          return Promise.resolve();
        }}
      >
        <ProForm.Item
          name="phone"
          rules={PHONE_RULE(intl.formatMessage)}
        >
          <PhoneNumber
            name="phone"
            placeholder={intl.formatMessage({
              id: 'key_phone_number',
            })}
            prefix={<IconFont type="icon-wangji" className={styles.prefixIcon} size={14} />}
          />
        </ProForm.Item>
      </ProForm>
    );
  return (
    <div className={styles.main}>
      <Tabs activeKey={channel} onChange={setChannel}>
        {/* <TabPane
          tab={intl.formatMessage({
            id: 'key_email_tab',
          })}
          key="email"
        >
          {EmailForm}
        </TabPane> */}
        <TabPane
          tab={intl.formatMessage({
            id: 'key_phone_tab',
          })}
          key="phone"
        >
         {PhoneForm}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
