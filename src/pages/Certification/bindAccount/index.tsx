import { MailFilled } from '@ant-design/icons';
import { message } from 'antd';

import React, { useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { useIntl, connect, FormattedMessage } from 'umi';
import type { ConnectState } from '@/models/connect';
import * as certificationService from '@/services/certification';

import type { RegisterCallbackParams } from '../index';

import styles from './index.less';
import PhoneNumber from '@/components/PhoneNumber';
import {PHONE_RULE} from '@/constants/rules'

export type IProps = {
  channel?: string;
  onSummit: (e: RegisterCallbackParams) => void;
};

const Login: React.FC<IProps> = (props) => {
  const { onSummit, channel } = props;
  const intl = useIntl();
  const [summitLoading, setSummitLoading] = useState<boolean>(false);

  const handleSubmit = async (values: RegisterCallbackParams) => {
    setSummitLoading(true);
    const params = {
      account: channel === 'email' ? values.email : values.phone,
      channel
    }
    const result = await certificationService.bindAccountCheck(params);
    setSummitLoading(false);
    if (result.success) {
      onSummit({...params, scene: 'bind'});
    } else {
      message.error(result.message || 'Request Error');
    }
  };
  const EmailForm = () => {
    return (
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
            message: <FormattedMessage id="key_this_is_required" />,
          },
          {
            pattern: /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g,
            message: <FormattedMessage id="key_invalid_email" />,
          },
        ]}
      />
    );
  };
  const PhoneForm = () => {
    return (
      <ProForm.Item
        name="phone"
        rules={PHONE_RULE(intl.formatMessage)}
      >
        <PhoneNumber
          name="phone"
          placeholder={intl.formatMessage({
            id: 'key_phone_number',
          })}
        />
      </ProForm.Item>
    );
  };
  return (
    <div className={styles.main}>
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
          handleSubmit(values as RegisterCallbackParams);
          return Promise.resolve();
        }}
      >
        {channel === 'email' ? <EmailForm /> : <PhoneForm />}
      </ProForm>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
