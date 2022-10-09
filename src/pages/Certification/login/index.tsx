/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { LockOutlined, MailFilled } from '@ant-design/icons';
import { Space, message, Tabs, Modal } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import type { Dispatch } from 'umi';
import { useIntl, FormattedMessage, connect } from 'umi';
import * as certificationService from '@/services/certification';
import * as userService from '@/services/user';
import type { LoginParamsType } from '@/services/certification';
import MModal from '@/components/Modal';
import PhoneNumber from '@/components/PhoneNumber';
import styles from './index.less';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import md5 from 'blueimp-md5';
import IconFont from '@/components/IconFont';
import LineIcon from '@/assets/icon/line.png';
import FacebookIcon from '@/assets/icon/fecebook.png';
import GoogleIcon from '@/assets/icon/google.png';
import { PHONE_RULE } from '@/constants/rules';
import { checkIsPhone, isForChina } from '@/utils/utils';
import { handleReport } from '@/utils/report';
import { ExpertStatus } from '@/utils/scheme';

const { TabPane } = Tabs;
export type LoginProps = {
  onSuccess?: () => void;
  onError?: () => void;
  dispatch?: Dispatch;
  onForgetPassword: (params?: Record<string, any>) => void;
  onGetGoogleToken: (e: { tokenId: string }) => void;
  onGetLineAccessToken: (e: { access_token: string }) => void;
  onGetFacebookAccessToken: (e: { access_token: string }) => void;
};

const Login: React.FC<LoginProps> = (props) => {
  const { onSuccess, onError, onForgetPassword } = props;
  const [summitLoading, setSummitLoading] = useState<boolean>(false);
  const [googleLoginTipVisible, setGoogleLoginTipVisible] = useState<boolean>(false);
  const [lineLoginTipVisible, setLineLoginTipVisible] = useState<boolean>(false);
  const [facebookLoginTipVisible, setFacebookLoginTipVisible] = useState<boolean>(false);
  // use phone for chinese
  const [channel, setChannel] = useState<string>(isForChina() ? 'phone' : 'email');
  const [formValues, setFormValues] = useState({});

  const intl = useIntl();

  const getUserInfo = async () => {
    setSummitLoading(true);
    const userInfo = await userService.queryCurrent();
    setSummitLoading(false);
    if (userInfo.success) {
      const { dispatch } = props;
      if(!checkIsPhone() && userInfo.data?.expert?.status != ExpertStatus.Accept) {
        if (dispatch) {
          dispatch({
            type: 'user/logout',
          });
        }
        Modal.error({content:'您还不是专家，请前往34体育APP申请专家'})
        return
      }
      message.success(
        `${intl.formatMessage({
          id: 'key_welcome_back_web',
        })} ${userInfo.data.nickname}`,
      );
      //
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

  const onFacebookConfirmHandler = async (accessToken?: string) => {
    if (accessToken) {
      setLineLoginTipVisible(false);
      const { onGetFacebookAccessToken } = props;
      const result = await certificationService.facebookWebLogin({ access_token: accessToken });
      if (result.success) {
        if (result.data.bound) {
          await getUserInfo();
        } else {
          onGetFacebookAccessToken({ access_token: accessToken });
        }
      } else {
        message.error(result.message!);
        onError && onError();
      }
    } else {
      message.error('Facebook Authorize Error');
    }
  };

  const onLineConfirmHandler = async (code?: string) => {
    if (code) {
      setLineLoginTipVisible(false);
      const { onGetLineAccessToken } = props;
      const result = await certificationService.lineWebLogin({ code });
      if (result.success) {
        if (result.data.bound) {
          await getUserInfo();
        } else {
          onGetLineAccessToken({ access_token: result.data.access_token });
        }
      } else {
        message.error(result.message!);
        onError && onError();
      }
    } else {
      message.error('Line Authorize Error');
    }
  };

  const onConfirmHandler = async (tokenId?: string) => {
    if (tokenId) {
      setGoogleLoginTipVisible(false);
      const { onGetGoogleToken } = props;
      const result = await certificationService.googleLogin({ id_token: tokenId, client: 'web' });
      if (result.success) {
        if (result.data.bound) {
          await getUserInfo();
        } else {
          onGetGoogleToken({ tokenId });
        }
      } else {
        message.error(result.message!);
        onError && onError();
      }
    } else {
      message.error('Authorize Error');
    }
  };

  const onFailureHandler = () => {
    message.error('Authorize Error');
  };

  const handleSubmit = async (values: LoginParamsType) => {
    handleReport({
      action: 'login',
      cate: 'login',
      tag: channel,
    });
    setSummitLoading(true);
    const { email, phone, password, code } = values;
    const result = await certificationService.login({
      account: channel === 'email' ? email : phone,
      channel,
      password: channel === 'sms-login' ? '' : md5(password),
      code,
    });
    setSummitLoading(false);

    if (result.success) {
      await getUserInfo();
      // location.reload();
    } else {
      message.error(result.message);
      onError && onError();
    }
  };
  const EmailForm = (
    <ProForm
      initialValues={{
        autoLogin: true,
      }}
      onValuesChange={(changeValues) => {
        setFormValues(changeValues);
      }}
      submitter={{
        searchConfig: {
          submitText: intl.formatMessage({
            id: 'key_log_in',
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
        handleSubmit(values as LoginParamsType);
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
          id: 'key_password',
        })}
        rules={[
          {
            required: true,
            message: <FormattedMessage id="key_this_is_required" />,
          },
          {
            pattern: new RegExp('^[a-zA-Z0-9!@#$%^&*?().]{8,16}$'),
            message: <FormattedMessage id="key_invalid_password_reenter" />,
          },
        ]}
      />

      {/* <div className={styles.actions}> */}
        {/* <ProFormCheckbox noStyle name="autoLogin">
    <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
  </ProFormCheckbox> */}
        {/* <div />
        <a
          onClick={() => {
            onForgetPassword({ channel, ...formValues });
          }}
        >
          <FormattedMessage id="key_forgot_password" />
        </a>
      </div> */}
    </ProForm>
  );
  const PhoneForm = (
    <ProForm
      onValuesChange={(changeValues) => {
        setFormValues(changeValues);
      }}
      initialValues={{
        autoLogin: true,
      }}
      submitter={{
        searchConfig: {
          submitText: intl.formatMessage({
            id: 'key_log_in',
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
        handleSubmit(values as LoginParamsType);
        return Promise.resolve();
      }}
    >
      <ProForm.Item name="phone" rules={PHONE_RULE(intl.formatMessage)}>
        <PhoneNumber
          name="phone"
          placeholder={intl.formatMessage({
            id: 'key_phone_number',
          })}
          sendCode={channel === 'phone' ? false : true}
        />
      </ProForm.Item>
      {channel === 'phone' ? (
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={styles.prefixIcon} />,
          }}
          placeholder={intl.formatMessage({
            id: 'key_password',
          })}
          rules={[
            {
              required: true,
              message: <FormattedMessage id="key_this_is_required" />,
            },
            {
              pattern: new RegExp('^[a-zA-Z0-9!@#$%^&*?().]{8,16}$'),
              message: <FormattedMessage id="key_invalid_password_reenter" />,
            },
          ]}
        />
      ) : null}

      {channel === 'sms-login' ? (
        <ProFormText
          name="code"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={styles.prefixIcon} />,
            maxLength: 4,
          }}
          placeholder={intl.formatMessage({
            id: 'key_4digit',
          })}
          rules={[
            {
              required: true,
              message: <FormattedMessage id="key_this_is_required" />,
            },
            {
              pattern: new RegExp('^[0-9]{4}$', 'g'),
              message: <FormattedMessage id="key_invalid_verification_code" />,
            },
          ]}
        />
      ) : null}

      <div className={styles.actions}>
        <div
          className={styles.switch}
          onClick={() => {
            setChannel(channel === 'phone' ? 'sms-login' : 'phone');
          }}
        >
          <IconFont type="icon-qiehuan" color="#999" />
          <span>
            {channel === 'phone'
              ? intl.formatMessage({ id: 'key_sms', defaultMessage: 'key_sms' })
              : null}
            {channel === 'sms-login'
              ? intl.formatMessage({
                  id: 'key_password_login',
                  defaultMessage: 'key_password_login',
                })
              : null}
          </span>
        </div>
        {channel !== 'sms-login' ? (
          <a
            onClick={() => {
              onForgetPassword({ channel, ...formValues });
            }}
          >
            <FormattedMessage id="key_forgot_password" />
          </a>
        ) : null}
      </div>
    </ProForm>
  );
  return (
    <div className={styles.main}>
      <Tabs
        activeKey={channel === 'sms-login' ? 'phone' : channel}
        onChange={(key) => {
          setChannel(key);
          handleReport({
            action: key,
            cate: 'login',
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

      {!isForChina() ? (
        <div className={styles.item}>
          <div className={styles.tips}>
            <FormattedMessage id="key_or_log_in_with" />
          </div>
          <div className={styles.loginIcon}>
            <Space size={16}>
              <span
                onClick={() => {
                  report({
                    action: REPORT_ACTION.login_third_google,
                    cate: REPORT_CATE.login,
                  });
                  setGoogleLoginTipVisible(true);
                }}
                className={styles.iconWrapper}
              >
                <img src={GoogleIcon} className={styles.icon} />
              </span>

              <span
                className={styles.iconWrapper}
                onClick={() => {
                  report({
                    action: REPORT_ACTION.login_third_line,
                    cate: REPORT_CATE.login,
                  });
                  setLineLoginTipVisible(true);
                }}
              >
                <img src={LineIcon} className={styles.icon} />
              </span>
              <span
                className={styles.iconWrapper}
                onClick={() => {
                  report({
                    action: REPORT_ACTION.login_third_facebook,
                    cate: REPORT_CATE.login,
                  });
                  setFacebookLoginTipVisible(true);
                }}
              >
                <img src={FacebookIcon} className={styles.icon} />
              </span>
            </Space>
          </div>
        </div>
      ) : null}
      <MModal
        key="facebook"
        title={intl.formatMessage({ id: 'key_connect_to_facebook' })}
        onCancel={() => {
          setFacebookLoginTipVisible(false);
        }}
        onConfirm={onFacebookConfirmHandler}
        visible={facebookLoginTipVisible}
        type="facebook"
        onFailure={onFailureHandler}
      >
        <div className={styles.tip}>
          <FormattedMessage id="key_login_with_facebook" />
        </div>
      </MModal>
      <MModal
        key="line"
        title={intl.formatMessage({ id: 'key_connect_to_line' })}
        onCancel={() => {
          setLineLoginTipVisible(false);
        }}
        onConfirm={onLineConfirmHandler}
        visible={lineLoginTipVisible}
        type="line"
        onFailure={onFailureHandler}
      >
        <div className={styles.tip}>
          <FormattedMessage id="key_sure_login_with_line" />
        </div>
      </MModal>
      <MModal
        key="google"
        title={intl.formatMessage({ id: 'key_connect_google' })}
        onCancel={() => {
          setGoogleLoginTipVisible(false);
        }}
        onConfirm={onConfirmHandler}
        visible={googleLoginTipVisible}
        type="google"
        onFailure={onFailureHandler}
      >
        <div className={styles.tip}>
          <FormattedMessage id="key_sure_login_with_google" />
        </div>
      </MModal>
    </div>
  );
};

// @ts-ignore
export default connect(({}) => ({}))(Login);
