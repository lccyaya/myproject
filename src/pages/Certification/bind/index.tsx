import {
  MailFilled,
} from '@ant-design/icons';
import { message } from 'antd';

import React, { useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { useIntl, connect, FormattedMessage } from 'umi';
import type { ConnectState } from '@/models/connect';
import * as certificationService from '@/services/certification';

import type { RegisterCallbackParams } from '../index';

import styles from './index.less';

export type IProps = {
  onSummit: (e: RegisterCallbackParams) => void;

};

const Login: React.FC<IProps> = (props) => {
  const { onSummit } = props;
  const intl = useIntl();
  const [summitLoading, setSummitLoading] = useState<boolean>(false);

  const handleSubmit = async (values: RegisterCallbackParams) => {
    setSummitLoading(true);
    const result = await certificationService.getCaptchaCode({ email: values.email });
    setSummitLoading(false);
    if (result.success) {
      onSummit(values);
    } else {
      message.error(result.message || 'Request Error');
    }
  };

  return (
    <div className={styles.main}>
      <ProForm
        initialValues={{
          autoLogin: true,
        }}
        submitter={{
          searchConfig: {
            submitText: (
              intl.formatMessage({
                id: 'Sign up',
              })
            ),
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
          handleSubmit(values as RegisterCallbackParams);
          return Promise.resolve();
        }}
      >
        <ProFormText
          name="email"
          fieldProps={{
            size: 'large',
            prefix: <MailFilled className={styles.prefixIcon} />,
          }}
          placeholder={intl.formatMessage({
            id: 'key_email_address',
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
              pattern: new RegExp('^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$', 'g'),
              message:(
                <FormattedMessage
                  id="key_invalid_email"
                />
              ),
            },
          ]}
        />


        <div
          style={{
            marginBottom: 16,
          }}
        >
          <div>
            <FormattedMessage id="key_click_for_agree_policy" />
          </div>
          <a
            style={{
              // float: 'right',
              marginBottom: 24,
            }}
          >
            <FormattedMessage id="key_terms_and_privacy_policy" />
          </a>
        </div>
      </ProForm>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
