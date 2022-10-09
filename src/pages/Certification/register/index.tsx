import { LockOutlined, MailFilled, UserOutlined } from '@ant-design/icons';
import { message, Tabs } from 'antd';

import React, { useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { useIntl, connect, FormattedMessage, Link } from 'umi';
import type { ConnectState } from '@/models/connect';
import * as certificationService from '@/services/certification';
import type { RegisterCallbackParams } from '../index';
import PhoneNumber from '@/components/PhoneNumber';
import md5 from 'blueimp-md5';
import styles from './index.less';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { PHONE_RULE } from '@/constants/rules';
const { TabPane } = Tabs;
import { handleReport } from '@/utils/report';

export type IProps = {
  onSummit: (e: RegisterCallbackParams) => void;
};

const Login: React.FC<IProps> = (props) => {
  const { onSummit } = props;
  const intl = useIntl();
  const [summitLoading, setSummitLoading] = useState<boolean>(false);
  const [channel, setChannel] = useState<string>('phone');

  const handleSubmit = async (values: RegisterCallbackParams) => {
    handleReport({
      action: 'signup',
      cate: 'signup',
      tag: channel,
    });
    setSummitLoading(true);
    // 检查账户是否存在

    const { email, phone, password, nickname } = values;

    const params = {
      account: channel === 'email' ? email : phone,
      channel,
      nickname,
      password: md5(password),
    };
    // 检查参数
    const checkParams = await certificationService.checkAccountParams(params);
    if (checkParams.success) {
      if (checkParams.data?.is_registered) {
        message.error(
          intl.formatMessage({
            id: channel === 'email' ? 'k_email_used' : 'k_phone_used',
            defaultMessage:
              channel === 'email'
                ? 'The email has already been used, please re-enter.'
                : 'The phone number has already been used, please re-enter.',
          }),
        );
        setSummitLoading(false);
        return;
      }
    } else {
      message.error(checkParams.message || 'Params Error');
      setSummitLoading(false);
      return;
    }
    const result = await certificationService.getCaptchaCode({ ...params, scene: 'register' });
    setSummitLoading(false);
    if (result.success) {
      onSummit({ ...params, password: md5(password), nickname, scene: 'register' });
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
            id: 'key_sign_up',
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
      <ProFormText
        name="nickname"
        fieldProps={{
          size: 'large',
          prefix: <UserOutlined className={styles.prefixIcon} />,
        }}
        placeholder={intl.formatMessage({
          id: 'key_username',
        })}
        rules={[
          {
            required: true,
            message: <FormattedMessage id="key_this_is_required" />,
          },
          {
            pattern: new RegExp('^[\u4e00-\u9fa5_0-9a-zA-Z]{2,10}$', 'g'),
            message: <FormattedMessage id="key_username_chars" />,
          },
        ]}
      />
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
            message: <FormattedMessage id="key_this_is_required" />,
          },
          {
            pattern: new RegExp('^[a-zA-Z0-9!@#$%^&*?().]{8,16}$'),
            message: <FormattedMessage id="key_password_chars" />,
          },
        ]}
      />

      <div
        className={styles.privacyTip}
        style={{
          marginBottom: 16,
        }}
      >
        <div>
          <FormattedMessage id="k_click_signup" />
          <br />
          <a
            style={{
              // float: 'right',
              textDecoration: 'underline',
              marginBottom: 24,
            }}
            onClick={() => {
              report({
                action: REPORT_ACTION.signup_terms,
                cate: REPORT_CATE.signup,
              });
              const lang = toShortLangCode(locale.getLocale());
              window.open(`/${lang}/terms`);
            }}
          >
            <FormattedMessage id="key_terms_and_privacy_policy" />
          </a>
        </div>
      </div>
    </ProForm>
  );
  const PhoneForm = (
    <ProForm
      initialValues={{
        autoLogin: true,
      }}
      submitter={{
        searchConfig: {
          submitText: intl.formatMessage({
            id: 'key_sign_up',
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
      <ProFormText
        name="nickname"
        fieldProps={{
          size: 'large',
          prefix: <UserOutlined className={styles.prefixIcon} />,
        }}
        placeholder={intl.formatMessage({
          id: 'key_username',
        })}
        rules={[
          {
            required: true,
            message: <FormattedMessage id="key_this_is_required" />,
          },
          {
            pattern: new RegExp('^[\u4e00-\u9fa5_0-9a-zA-Z]{2,10}$', 'g'),
            message: <FormattedMessage id="key_username_chars" />,
          },
        ]}
      />
      <ProForm.Item name="phone" rules={PHONE_RULE(intl.formatMessage)}>
        <PhoneNumber
          name="phone"
          placeholder={intl.formatMessage({
            id: 'key_phone_number',
          })}
        />
      </ProForm.Item>
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
            message: <FormattedMessage id="key_this_is_required" />,
          },
          {
            pattern: new RegExp('^[a-zA-Z0-9!@#$%^&*?().]{8,16}$'),
            message: <FormattedMessage id="key_password_chars" />,
          },
        ]}
      />

      <div
        className={styles.privacyTip}
        style={{
          marginBottom: 16,
        }}
      >
        <div>
          <FormattedMessage id="k_click_signup" />
          <br />
          <a
            style={{
              // float: 'right',
              textDecoration: 'underline',
              marginBottom: 24,
            }}
            onClick={() => {
              report({
                action: REPORT_ACTION.signup_terms,
                cate: REPORT_CATE.signup,
              });
              const lang = toShortLangCode(locale.getLocale());
              window.open(`/${lang}/terms`);
            }}
          >
            <FormattedMessage id="key_terms_and_privacy_policy" />
          </a>
        </div>
      </div>
    </ProForm>
  );
  return (
    <div className={styles.main}>
      <Tabs
        defaultActiveKey={channel}
        onChange={(key) => {
          setChannel(key);
          handleReport({
            action: key,
            cate: 'signup',
          });
        }}
      >
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
