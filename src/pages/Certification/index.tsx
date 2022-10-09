/* eslint-disable no-else-return */
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, FormattedMessage, useIntl } from 'umi';
import Login from './login';
import Register from './register';
import Retrieve from './retrieve';
import Reset from './reset';
import Verification from './verification';
import Bind from './bind';
import BindAccount from './bindAccount';
import Modify from './modify';
import PasswordVerify from './passwordVerify';
import type { RegisterParamsType } from '@/services/certification';
import type { Dispatch } from 'umi';
import type { StateType } from '@/models/login';
import type { ConnectState } from '@/models/connect';
import styles from './index.less';
import pageConfig from '@/utils/pageConfig';
import IconFont from '@/components/IconFont';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';

type IType =
  | 'bindAccount'
  | 'register'
  | 'login'
  | 'retrieve'
  | 'reset'
  | 'verification'
  | 'bind'
  | 'modify'
  | 'passwordVerify';

export type RegisterCallbackParams = Pick<
  RegisterParamsType,
  'account' | 'nickname' | 'password'
> & {
  action: IType;
} & { tokenId?: string } & { access_token?: string };
export type RetrieveCallbackParams = Pick<RegisterParamsType, 'account'>;
export type BindCallbackParams = Pick<RegisterParamsType, 'account'>;

export type LoginProps = {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
  visible: boolean;
  action: IType;
  onCancel: () => void;
  onSuccess: (e?: string, ticket?: string) => void;
  channel?: string;
};

const Title: React.FC<{ type: IType; channel?: string }> = (props) => {
  if (props.type === 'login') {
    return <div><img className={styles.logo} src={pageConfig.logo} /></div>;
  } else if (props.type === 'register') {
    return <FormattedMessage id="key_create_account_web" />;
  } else if (props.type === 'retrieve') {
    return <FormattedMessage id="key_get_into_account_web" />;
  } else if (props.type === 'reset') {
    return <FormattedMessage id="key_set_new_password" />;
  } else if (props.type === 'verification') {
    return <FormattedMessage id="key_enter_verification_code_web" />;
  } else if (props.type === 'bind') {
    return <FormattedMessage id="key_create_account_web" />;
  } else if (props.type === 'modify') {
    return <FormattedMessage id="key_change_password" />;
  } else if (props.type === 'passwordVerify') {
    return <FormattedMessage id="key_password" />;
  } else if (props.type === 'bindAccount') {
    if (props.channel === 'email') {
      return <FormattedMessage id="key_enter_email" />;
    } else {
      return <FormattedMessage id="key_enter_your_phone_app" />;
    }
  }
  return null;
};

const Desc: React.FC<{ type: IType; account?: string; channel?: string }> = (props) => {
  const intl = useIntl();
  if (props.type === 'login') {
    return (
      <div className={styles.desc}>
        <FormattedMessage id="key_enter_your_credentials" />
      </div>
    );
  } else if (props.type === 'verification') {
    return (
      <div className={styles.desc}>
        {props.channel === 'email'
          ? intl.formatMessage({ id: 'key_sent_to_your_email' })
          : intl.formatMessage({ id: 'key_sent_to_your_phone_number' })}
        <div className={styles.email}> {props.account}</div>
      </div>
    );
  }
  return null;
};

const Footer: React.FC<{ type: IType; onChange: (type: IType) => void }> = (props) => {
  if (props.type === 'login' || props.type === 'retrieve') {
  // if (props.type === 'retrieve') {
    return (
      <>
        <span>
          <FormattedMessage id="key_have_no_account" />
        </span>
        <a
          style={{ textDecoration: 'underline' }}
          onClick={() => {
            report({
              action: REPORT_ACTION.login_signup,
              cate: REPORT_CATE.login,
            });
            props.onChange('register');
          }}
        >
          <FormattedMessage id="key_sign_up" />
        </a>
      </>
    );
  } else if (props.type === 'register') {
    return (
      <>
        <span>
          <FormattedMessage id="key_have_account" />
        </span>
        <a
          style={{ textDecoration: 'underline' }}
          onClick={() => {
            report({
              action: REPORT_ACTION.signup_login,
              cate: REPORT_CATE.signup,
            });
            props.onChange('login');
          }}
        >
          <FormattedMessage id="key_log_in" />
        </a>
      </>
    );
  } else if (props.type === 'reset') {
    return (
      <>
        <span>
          <FormattedMessage id="key_remember_the_code" />
        </span>
        <a
          style={{ textDecoration: 'underline' }}
          onClick={() => {
            report({
              action: REPORT_ACTION.forget_password_login,
              cate: REPORT_CATE.forget_password,
            });
            props.onChange('login');
          }}
        >
          <FormattedMessage id="key_log_in" />
        </a>
      </>
    );
  }
  return null;
};

export type ITicketParams = {
  ticket: string;
  email: string;
};

export type IThirdLoginType = 'line' | 'google' | 'facebook';

const Certification: React.FC<LoginProps> = (props) => {
  // const { userLogin = {}, submitting } = props;
  const { visible, action, onCancel, onSuccess, channel } = props;
  // const { status, type: loginType } = userLogin;
  const [type, setType] = useState<IType>(action || 'login');
  const [verifyParams, setVerifyParams] = useState<RegisterCallbackParams>();
  const [ticketParams, setTicketParams] = useState<ITicketParams>();
  const [tokenId, setTokenId] = useState<string>();
  const [accessToken, setAccessToken] = useState<string>();
  const [thirdLoginType, setThirdLoginType] = useState<IThirdLoginType>();
  const [forgetParams, setForgetParams] = useState({});

  const onCancelHandle = () => {
    setType(action);
    onCancel();

    let reportCate: REPORT_CATE | undefined;
    let reportAction: REPORT_ACTION | undefined;
    if (['login'].includes(type)) {
      reportCate = REPORT_CATE.login;
      reportAction = REPORT_ACTION.login_close;
    } else if (['register'].includes(type)) {
      reportCate = REPORT_CATE.signup;
      reportAction = REPORT_ACTION.signup_close;
    } else if (['retrieve'].includes(type)) {
      reportCate = REPORT_CATE.forget_password;
      reportAction = REPORT_ACTION.forget_password_close;
    }
    if (!reportCate || !reportAction) return;
    report({
      action: reportAction,
      cate: reportCate,
    });
  };

  const onRegisterSummit = (e: RegisterCallbackParams) => {
    setType('verification');
    setVerifyParams(e);
  };
  const onRetrieveSummit = (e: RetrieveCallbackParams) => {
    setType('verification');
    setVerifyParams({ ...e, password: '', nickname: '', action: 'retrieve' });
  };
  const onBindSummit = (e: BindCallbackParams) => {
    setType('verification');
    setVerifyParams({
      ...e,
      password: '',
      nickname: '',
      action: 'bind',
      tokenId,
      access_token: accessToken,
    });
  };
  const onBindAccountSummit = (e: BindCallbackParams) => {
    setType('verification');
    setVerifyParams({
      ...e,
      action: 'bindAccount',
    });
  };

  const onVerificationSuccess = (e?: ITicketParams) => {
    if (e) {
      setType('reset');
      setTicketParams(e);
    } else {
      onSuccess();
      onCancelHandle();
    }
  };
  // const intl = useIntl();

  // const handleSubmit = (values: LoginParamsType) => {
  //   const { dispatch } = props;
  //   dispatch({
  //     type: 'login/login',
  //     payload: { ...values, type },
  //   });
  // };
  useEffect(() => {
    if (props.visible && type === 'login') {
      report({
        action: REPORT_ACTION.login_display,
        cate: REPORT_CATE.login,
      });
    }
  }, [props.visible, type]);
  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      visible={visible}
      onCancel={onCancelHandle}
      footer={false}
      wrapClassName={styles.modal}
      centered
      closable={false}
    >
      <div className={styles.container}>
        <div className={styles.close_icon} onClick={onCancelHandle}>
          <IconFont type="icon-guanbi" color="#999" size={32} />
        </div>
        <div className={styles.top}>
          <div className={styles.header}>
            <a className={styles.title}>
              <Title type={type} channel={channel} />
            </a>
          </div>
          <Desc
            type={type}
            account={type === 'verification' && verifyParams ? verifyParams?.account : ''}
            channel={type === 'verification' && verifyParams ? verifyParams?.channel : ''}
          />
        </div>
        <div className={styles.main}>
          {type === 'login' && (
            <Login
              onGetGoogleToken={(e) => {
                setTokenId(e.tokenId);
                setType('bind');
                setThirdLoginType('google');
              }}
              onGetLineAccessToken={(e) => {
                setAccessToken(e.access_token);
                setType('bind');
                setThirdLoginType('line');
              }}
              onGetFacebookAccessToken={(e) => {
                setAccessToken(e.access_token);
                setType('bind');
                setThirdLoginType('facebook');
              }}
              onForgetPassword={(forgetParams) => {
                report({
                  action: REPORT_ACTION.login_forget_password,
                  cate: REPORT_CATE.login,
                });
                setType('retrieve');
                setForgetParams(forgetParams);
              }}
              onSuccess={onSuccess}
            />
          )}
          {type === 'register' && <Register onSummit={onRegisterSummit} />}
          {type === 'retrieve' && (
            <Retrieve onSummit={onRetrieveSummit} forgetParams={forgetParams} />
          )}
          {type === 'reset' && (
            <Reset
              data={ticketParams!}
              onSummit={() => {
                setType('login');
              }}
            />
          )}
          {type === 'verification' && (
            <Verification
              thirdLoginType={thirdLoginType}
              seconds={60}
              data={verifyParams!}
              onSuccess={onVerificationSuccess}
            />
          )}
          {type === 'bind' && <Bind onSummit={onBindSummit} />}
          {type === 'bindAccount' && (
            <BindAccount channel={channel} onSummit={onBindAccountSummit} />
          )}
          {type === 'modify' && <Modify />}

          {type === 'passwordVerify' && (
            <PasswordVerify
              onSummit={(e, ticket) => {
                onSuccess(e, ticket);
              }}
            />
          )}
        </div>
        <div className={styles.footer}>
          <Footer
            type={type}
            onChange={(e) => {
              setType(e);
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Certification);
