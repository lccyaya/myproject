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

import { Alert, Space, message, Tabs, Form } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, connect, FormattedMessage } from 'umi';
import type { Dispatch } from 'umi';
import type { StateType } from '@/models/login';
import type { ConnectState } from '@/models/connect';
import * as certificationService from '@/services/certification';

import type { ITicketParams } from '../index';

import styles from './index.less';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { report } from '@/services/ad';

export type LoginProps = {
  dispatch: Dispatch;
  // onSummit: () => void;
  // // data: ITicketParams;
};

type SummitTypes = {
  password: string;
  newPassword: string;
}

const Login: React.FC<LoginProps> = (props) => {
  // const { userLogin = {}, submitting } = props;
  // const { data, onSummit } = props;
  const [form] = Form.useForm();

  // const { status, type: loginType } = userLogin;
  const [summitLoading, setSummitLoading] = useState<boolean>(false);

  const intl = useIntl();

  const handleSubmit = async (values: SummitTypes) => {
    setSummitLoading(true);
    // const result = await certificationService.resetPassword({ ...data, password: values.password });
    setSummitLoading(false);
    // if (result.success) {
    //   message.success('Please log in');
    //   // onSummit();
    // } else {
    //   message.error(result.message);
    // }
  };

  //新密码一致校验
  const handleCheckPwd = (_: any, value: any, callback: any) => {
    const cfmPwd = form.getFieldValue('password');
    if (!/^[a-zA-Z0-9!@#$%^&*?().]{8,16}$/g.test(value)) {
      callback(
        new Error(
          intl.formatMessage({
            id: 'key_password_chars',
          }),
        ),
      );
    } else if (cfmPwd && value && cfmPwd !== value) {
      callback(
        new Error(
          intl.formatMessage({
            id: 'key_entered_password_differ',
          }),
        ),
      );
    } else {
      callback();
    }
  }


  return (
    <div className={styles.main}>
      <ProForm
        form={form}
        initialValues={{
          autoLogin: true,
        }}
        submitter={{
          searchConfig: {
            submitText: 
              intl.formatMessage({
                id: 'Continue',
              })
            ,
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
                id="key_password_chars"
              />,
            }
          ]}
        />
        <ProFormText.Password
          name="confirmPassword"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={styles.prefixIcon} />,
          }}
          placeholder={intl.formatMessage({
            id: 'key_confirm_password',
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
              validator: (rules, value, callback) => { handleCheckPwd(rules, value, callback) },
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
