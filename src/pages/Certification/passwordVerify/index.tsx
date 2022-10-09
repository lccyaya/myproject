import {
  MessageOutlined,
  LockOutlined,
  MailFilled,
  GoogleOutlined,
  FacebookOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { createFromIconfontCN } from '@ant-design/icons';
import md5 from 'blueimp-md5';

import { Alert, Space, message, Tabs, Form } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, connect, FormattedMessage } from 'umi';
import type { Dispatch } from 'umi';
import type { StateType } from '@/models/login';
import type { ConnectState } from '@/models/connect';
import * as certificationService from '@/services/certification';

import styles from './index.less';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { report } from '@/services/ad';

export type LoginProps = {
  dispatch: Dispatch;
  onSummit: (password?: string, ticket?: string) => void;
};

type SummitTypes = {
  password: string;
}

const Login: React.FC<LoginProps> = (props) => {
  const { onSummit } = props;
  const [form] = Form.useForm();

  // const { status, type: loginType } = userLogin;
  const [summitLoading, setSummitLoading] = useState<boolean>(false);

  const intl = useIntl();

  const handleSubmit = async (values: SummitTypes) => {
    setSummitLoading(true);
    const result = await certificationService.checkPwd({ password: md5(values.password) });
    setSummitLoading(false);
    if (result.success) {
      // message.success('Please log in');
      onSummit(values.password, result.data?.ticket);
    } else {
      message.error(result.message);
    }
    report({
      cate: REPORT_CATE.me,
      action: REPORT_ACTION.me_password_verify,
    });
  };

  return (
    <div className={styles.main}>
      <ProForm
        form={form}
        initialValues={{
          autoLogin: true,
        }}
        submitter={{
          searchConfig: {
            submitText: intl.formatMessage({
              id: 'key_verify',
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
          handleSubmit(values as SummitTypes);
          return Promise.resolve();
        }}
      >
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={styles.prefixIcon} />,
          }}
          placeholder={intl.formatMessage({
            id: 'key_password_chars',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="key_this_is_required"
                />
              ),
            },
            {
              pattern: new RegExp('^[a-zA-Z0-9!@#$%^&*?\(\).]{8,16}$'),
              message: <FormattedMessage
                id="key_invalid_password_reenter"
              />,
            }
          ]}
        />
      </ProForm>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
