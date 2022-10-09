/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { LoadingOutlined } from '@ant-design/icons';

import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import ProForm from '@ant-design/pro-form';
import type { Dispatch } from 'umi';
import { useIntl, FormattedMessage, connect } from 'umi';
// @ts-ignore
// import Captcha from 'easy-react-captcha';
import * as userService from '@/services/user';
import * as certificationService from '@/services/certification';
import type { RegisterCallbackParams, ITicketParams, IThirdLoginType } from '../index';

import styles from './index.less';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import CodeBox from '@/components/CodeBox';
import EventEmitter from '@/utils/event';

export type IProps = {
  data: RegisterCallbackParams;
  onSuccess?: (e?: ITicketParams) => void;
  onError?: () => void;
  seconds: number;
  dispatch: Dispatch;
  thirdLoginType?: IThirdLoginType;
};

const Login: React.FC<IProps> = (props) => {
  // const { userLogin = {}, submitting } = props;
  const { onSuccess, onError, data, thirdLoginType } = props;
  const [summitLoading, setSummitLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [seconds, setSeconds] = useState<number>(props.seconds);
  const intl = useIntl();
  const customerInterval = (s: number) => {
    setSeconds(s);
    if (s - 1 >= 0) {
      setTimeout(() => {
        customerInterval(s - 1);
      }, 1000);
    } else {
      setSeconds(0);
    }
  };

  useEffect(() => {
    customerInterval(seconds);
    return () => {
      customerInterval(0);
    };
  });

  const onResendCode = async () => {
    if (resendLoading) return;
    setResendLoading(true);
    const { account, channel, scene } = data;
    const result = await certificationService.getCaptchaCode({ account, channel, scene });
    setResendLoading(false);
    if (result.success) {
      customerInterval(60);
    } else {
      message.error(result.message || 'Request Error');
    }
  };

  const getUserInfo = async () => {
    EventEmitter.emit('register');
    setSummitLoading(true);
    const userInfo = await userService.queryCurrent();
    setSummitLoading(false);
    if (userInfo.success) {
      message.success(
        intl.formatMessage({
          id: 'key_welcome',
        }) +
          ' ' +
          userInfo.data.nickname,
      );
      //
      const { dispatch } = props;
      if (dispatch) {
        dispatch({
          type: 'user/saveCurrentUser',
          payload: {
            data: userInfo.data,
          },
        });
      }
      onSuccess && onSuccess();
    } else {
      message.error(userInfo.message);
      onError && onError();
    }
  };
  const handleSubmit = async (ticket: string) => {
    report({
      action: REPORT_ACTION.forget_password_verify,
      cate: REPORT_CATE.forget_password,
    });
    setSummitLoading(true);
    let result;
    if (data.action === 'bindAccount') {
      result = await certificationService.bindAccount({ ...data, ticket });
      if (result.success) {
        onSuccess && onSuccess();
      }
    } else if (data.action === 'retrieve') {
      onSuccess && onSuccess({ ticket, ...data });
    } else if (data.action === 'bind') {
      if (thirdLoginType === 'line') {
        result = await certificationService.lineBindMail({
          email: data.email,
          access_token: data.access_token!,
          code,
        });
      } else if (thirdLoginType === 'facebook') {
        result = await certificationService.facebookBindMail({
          email: data.email,
          access_token: data.access_token!,
          code,
        });
      } else {
        result = await certificationService.bindEmail({
          email: data.email,
          id_token: data.tokenId!,
          client: 'web',
          code,
        });
      }
      if (result.success) {
        await getUserInfo();
        onSuccess && onSuccess();
      }
    } else {
      result = await certificationService.register({ ...data, ticket });
      if (result.success) {
        await getUserInfo();
        onSuccess && onSuccess();
      }
    }
    setSummitLoading(false);
    if (result && !result.success) {
      message.error(result.message);
      onError && onError();
    }
  };

  const checkCode = async () => {
    if (!code) return;
    const result = await certificationService.checkCode({ ...data, code });
    if (result.success) {
      handleSubmit(result.data.ticket);
    } else {
      message.error(result.message);
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
            submitText: intl.formatMessage({
              id: 'key_verify',
            }),
          },
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: summitLoading,
            disabled: !(code && code.replace(/\s/g, '').length >= 4),
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
        onFinish={() => {
          checkCode();
          return Promise.resolve();
        }}
      >
        <CodeBox
          onChange={(codeArray) => {
            setCode(codeArray.filter((e) => e).join(''));
          }}
        />
        <div className={styles.send_code}>
          {seconds && seconds > 0 ? (
            <p className={styles.code_text}>
              {intl.formatMessage({ id: 'key_resend_code_in' }, { p: seconds })}
            </p>
          ) : (
            <a onClick={onResendCode}>
              {resendLoading && <LoadingOutlined style={{ marginRight: '4px' }} />}
              <FormattedMessage id="key_resend_code" />
            </a>
          )}
        </div>
        {/* <ProFormText
          name="code"
          fieldProps={{
            size: 'large',
            prefix: <MailFilled className={styles.prefixIcon} />,
          }}
          placeholder={intl.formatMessage({
            id: 'pages.login.email.placeholder',
            defaultMessage: 'Email',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.login.email.required"
                  defaultMessage="this is require."
                />
              ),
            },
          ]}
        /> */}
      </ProForm>
    </div>
  );
};

export default connect(({}) => ({}))(Login);
