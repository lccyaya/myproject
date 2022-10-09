import React, { useState } from 'react';
import { Divider, message, Spin, Form, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import type { UserInfoType } from '@/services/user';
import type { ConnectState } from '@/models/connect';
import type { Dispatch } from 'umi';
import { FormattedMessage, connect, useIntl } from 'umi';
import MModal from '@/components/Modal';
import * as certificationService from '@/services/certification';
import ProForm, { ProFormText } from '@ant-design/pro-form';

import classnames from 'classnames';
import { createFromIconfontCN, CloseCircleOutlined } from '@ant-design/icons';
import Certification from '@/pages/Certification';
import * as userService from '@/services/user';
import md5 from 'blueimp-md5';

import styles from './index.less';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { report } from '@/services/ad';

type IProfile = {
  currentUser?: UserInfoType | null;
  dispatch: Dispatch;

  // onSummit: (e: { nickname: string }) => void;
};

const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_2508651_yw6l5vn1zxl.js', //  icon-telegram icon-face icon-google
  ],
});

type SummitTypes = {
  password: string;
  newPassword: string;
};

const Setting: React.FC<IProfile> = (props) => {
  // const { onSummit } = props;
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [pwdSetVisible, setPwdSetVisible] = useState<boolean>(false);
  const [bindVisible, setBindVisible] = useState<boolean>(false);
  const [channel, setChannel] = useState<string>('');
  const { currentUser } = props;
  const [googleLoginTipVisible, setGoogleLoginTipVisible] = useState<boolean>(false);
  const [lineLoginTipVisible, setLineLoginTipVisible] = useState<boolean>(false);
  const [facebookLoginTipVisible, setFacebookLoginTipVisible] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [googleUnbindVisible, setGoogleUnbindVisible] = useState<boolean>(false);
  const [lineUnbindVisible, setLineUnbindVisible] = useState<boolean>(false);
  const [facebookUnbindVisible, setFacebookUnbindVisible] = useState<boolean>(false);

  const [summitLoading, setSummitLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [pwd, setPwd] = useState<string>('');
  const [ticket, setTicket] = useState<string>('');

  const googleItem = currentUser && currentUser.google ? currentUser.google : false;
  const lineItem = currentUser && currentUser.line ? currentUser.line : false;
  const facebookItem = currentUser && currentUser.facebook ? currentUser.facebook : false;

  const intl = useIntl();

  const getUserInfo = async () => {
    const userInfo = await userService.queryCurrent();
    if (userInfo.success) {
      const { dispatch } = props;
      if (dispatch) {
        dispatch({
          type: 'user/saveCurrentUser',
          payload: {
            data: userInfo.data,
          },
        });
      }
    } else {
      message.error(userInfo.message);
    }
  };

  const onFacebookConfirmHandler = async (accessToken?: string) => {
    if (accessToken) {
      setFacebookLoginTipVisible(false);
      setLoading(true);
      const result = await certificationService.bindFacebook({ access_token: accessToken });
      await getUserInfo();
      setLoading(false);
      if (!result.success) {
        message.error(result.message!);
      }
    } else {
      message.error('Facebook Authorize Error');
    }
  };

  const onLineConfirmHandler = async (code?: string) => {
    if (code) {
      setLineLoginTipVisible(false);
      setLoading(true);
      const result = await certificationService.bindLine({ code });
      await getUserInfo();
      setLoading(false);
      if (!result.success) {
        message.error(result.message!);
      }
    } else {
      message.error('Line Authorize Error');
    }
  };

  const onConfirmHandler = async (tokenId?: string) => {
    if (tokenId) {
      setGoogleLoginTipVisible(false);
      setLoading(true);
      const result = await certificationService.bindGoogle({ id_token: tokenId });
      await getUserInfo();
      setLoading(false);
      if (!result.success) {
        message.error(result.message!);
      }
    } else {
      message.error('Google Authorize Error');
    }
  };

  const onFailureHandler = () => {
    message.error('Google Authorize Error');
  };

  const onDisconnectConfirmHandler = async (channel: 'google' | 'line' | 'facebook') => {
    if (channel === 'line') {
      setLineUnbindVisible(false);
    } else if (channel === 'facebook') {
      setFacebookUnbindVisible(false);
    } else {
      setGoogleUnbindVisible(false);
    }
    setLoading(true);
    const result = await certificationService.unbindThird({ channel });
    await getUserInfo();
    setLoading(false);
    if (!result.success) {
      message.error(result.message!);
    }
  };

  const onUnbind = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setGoogleUnbindVisible(true);
  };

  const onLineUnbind = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setLineUnbindVisible(true);
  };

  const onFacebookUnbind = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setFacebookUnbindVisible(true);
  };

  const handleSubmit = async (values: SummitTypes) => {
    setSummitLoading(true);
    const result = await certificationService.modifyPwd({ password: md5(values.password), ticket });
    setSummitLoading(false);
    if (result.success) {
      message.success(
        intl.formatMessage({
          id: 'key_password_set_successfully',
        }),
      );
      setPwd('');
      form.resetFields();
      // onSummit();
    } else {
      message.error(result.message || intl.formatMessage({
        id: 'key_password_failed',
      }));
    }
    report({
      cate: REPORT_CATE.me,
      action: REPORT_ACTION.me_password_continue,
    });
  };
  const handleSetPwdSubmit = async (values: SummitTypes) => {
    setSummitLoading(true);
    const result = await certificationService.setUserPwd({ password: md5(values.password), password_confirm: md5(values.password) });
    setSummitLoading(false);
    if (result.success) {
      message.success(
        intl.formatMessage({
          id: 'key_password_set_successfully',
        }),
      );
      setPwdSetVisible(false)
      form.resetFields();
      await getUserInfo();
      // onSummit();
    } else {
      message.error(result.message || 'Password set failed');
    }
    report({
      cate: REPORT_CATE.me,
      action: REPORT_ACTION.me_password_continue,
    });
  };

  // 新密码一致校验
  const handleCheckPwd = (_: any, value: any, callback: any) => {
    const cfmPwd = form.getFieldValue('password');
    if (!value) {
      callback(
        new Error(
          intl.formatMessage({
            id: 'key_this_is_required',
          }),
        ),
      );
    } else if (!/^[a-zA-Z0-9!@#$%^&*?().]{8,16}$/g.test(value)) {
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
  };
  const ChangePwd = ({ pwd }) => {
    return !pwd ? (
      <div className={styles.item}>
        <div className={classnames(styles.label)}>
          <FormattedMessage id="key_password" />
        </div>
        <div
          onClick={() => {
            setModifyVisible(true);
            report({
              cate: REPORT_CATE.me,
              action: REPORT_ACTION.me_change_password,
            });
          }}
          className={classnames(styles.content, styles.password)}
        >
          <FormattedMessage id="key_change_password" />
        </div>
      </div>
    ) : (
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
                  id: 'key_save',
                }),
            },
            render: (_, dom) => {
              return [
                dom.pop(),
                <Button size="large" key="cancel" onClick={() => setPwd(undefined)}>
                 <FormattedMessage id="key_cancel" />
               </Button>,
              ];
            },
            submitButtonProps: {
              loading: summitLoading,
              size: 'large',
              style: {
                // width: '100%',
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
            label={
              <div className={styles.label}>
                {intl.formatMessage({
                  id: 'key_password',
                })}
              </div>
            }
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
          <ProFormText.Password
            name="newPassword"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            label={
              <div className={styles.label}>
                {intl.formatMessage({
                  id: 'key_confirm_password',
                })}
              </div>
            }
            placeholder={intl.formatMessage({
              id: 'key_confirm_password',
            })}
            rules={[
              {
                validator: (rules, value, callback) => {
                  handleCheckPwd(rules, value, callback);
                },
              },
            ]}
          />
        </ProForm>
      </div>
    );
  };
  const SetPwd = ({ visible, setVisible }: {visible: boolean, setVisible: (visible: boolean) => void}) => {
    return !visible ? (
      <div className={styles.item}>
        <div className={classnames(styles.label)}>
          <FormattedMessage id="key_password" />
        </div>
        <div
          onClick={() => {
            if (currentUser?.phone || currentUser?.email) {
              setVisible(true);
              report({
                cate: REPORT_CATE.me,
                action: REPORT_ACTION.me_change_password,
              });
            } else {
              message.error(intl.formatMessage({id: 'key_should_bind_phone_or_mail'}))
            }
          }}
          className={classnames(styles.content, styles.password)}
        >
          <FormattedMessage id="key_set_password" />
        </div>
      </div>
    ) : (
      <div className={styles.main}>
        <ProForm
          form={form}
          initialValues={{
            autoLogin: true,
          }}
          submitter={{
            searchConfig: {
              submitText: intl.formatMessage({
                id: 'key_save',
              }),
            },
            render: (_, dom) => {
              return [
                dom.pop(),
                <Button size="large" key="cancel" onClick={() => {
                  setPwdSetVisible(false)
                  _.form?.resetFields()
                }}>
                 <FormattedMessage id="key_cancel" />
               </Button>,
              ];
            },
            submitButtonProps: {
              loading: summitLoading,
              size: 'large',
              style: {
                // width: '100%',
              },
            },
          }}
          onFinish={(values) => {
            handleSetPwdSubmit(values as SummitTypes);
            return Promise.resolve();
          }}
        >
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            label={<div className={styles.label}><FormattedMessage id="key_password" /></div>}
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
          <ProFormText.Password
            name="newPassword"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            label={<div className={styles.label}>{intl.formatMessage({
              id: 'key_confirm_password',
            })}</div>}
            placeholder={intl.formatMessage({
              id: 'key_confirm_password',
            })}
            rules={[
              {
                validator: (rules, value, callback) => {
                  handleCheckPwd(rules, value, callback);
                },
              },
            ]}
          />
        </ProForm>
      </div>
    );
  };

  return (
    <Spin spinning={loading}>
      <div className={styles.container}>
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage id="key_email_tab" />
          </div>
          {currentUser?.email ? (
            <div className={styles.content}>{currentUser.email}</div>
          ) : (
            <div
              onClick={() => {
                setBindVisible(true);
                setChannel('email');
              }}
              className={classnames(styles.content, styles.password)}
            >
              <FormattedMessage id="key_click_to_bind" />
            </div>
          )}
        </div>
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage id="key_phone_number" />
          </div>
          {currentUser?.phone ? (
            <div className={styles.content}>{currentUser.phone}</div>
          ) : (
            <div
              onClick={() => {
                setBindVisible(true);
                setChannel('phone');
              }}
              className={classnames(styles.content, styles.password)}
            >
              <FormattedMessage id="key_click_to_bind" />
            </div>
          )}
        </div>
        {currentUser?.is_pwd_set ? <ChangePwd pwd={pwd} /> : <SetPwd visible={pwdSetVisible} setVisible={setPwdSetVisible} />}
        <Divider className={styles.divide} />

        <div className={styles.social}>
          <div className={styles.title}>
            <FormattedMessage id="key_social_profiles" />
          </div>
          <div className={styles.socialItem}>
            <div className={styles.subtitle}>
              <span className={styles.label}>Google</span>
              {googleItem && googleItem.bound && (
                <>
                  <span className={styles.divide}>-</span>
                  <span className={styles.nickname}>{googleItem.name}</span>
                </>
              )}
            </div>
            <div className={styles.handler}>
              <div
                className={styles.box}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setGoogleLoginTipVisible(true);
                  report({
                    cate: REPORT_CATE.me,
                    action: REPORT_ACTION.me_google_open,
                  });
                }}
              >
                <IconFont type="icon-google" className={styles.icon} />
                <span className={styles.name}>Google</span>
                {googleItem && googleItem.bound && (
                  <CloseCircleOutlined onClick={onUnbind} className={styles.untie} />
                )}
              </div>
            </div>
          </div>
          <div className={styles.socialItem}>
            <div className={styles.subtitle}>
              <span className={styles.label}>Line</span>
              {lineItem && lineItem.bound && (
                <>
                  <span className={styles.divide}>-</span>
                  <span className={styles.nickname}>{lineItem.name}</span>
                </>
              )}
            </div>
            <div className={styles.handler}>
              <div
                className={styles.box}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLineLoginTipVisible(true);
                  report({
                    cate: REPORT_CATE.me,
                    action: REPORT_ACTION.me_line_open,
                  });
                }}
              >
                <IconFont type="icon-line" className={styles.icon} />
                <span className={styles.name}>Line</span>
                {lineItem && lineItem.bound && (
                  <CloseCircleOutlined onClick={onLineUnbind} className={styles.untie} />
                )}
              </div>
            </div>
          </div>
          <div className={styles.socialItem}>
            <div className={styles.subtitle}>
              <span className={styles.label}>Facebook</span>
              {facebookItem && facebookItem.bound && (
                <>
                  <span className={styles.divide}>-</span>
                  <span className={styles.nickname}>{facebookItem.name}</span>
                </>
              )}
            </div>
            <div className={styles.handler}>
              <div
                className={styles.box}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFacebookLoginTipVisible(true);
                  report({
                    cate: REPORT_CATE.me,
                    action: REPORT_ACTION.me_facebook_open,
                  });
                }}
              >
                <IconFont type="icon-facebook" className={styles.icon} />
                <span className={styles.name}>Facebook</span>
                {facebookItem && facebookItem.bound && (
                  <CloseCircleOutlined onClick={onFacebookUnbind} className={styles.untie} />
                )}
              </div>
            </div>
          </div>
        </div>
        <Certification
          action="passwordVerify"
          visible={modifyVisible}
          onSuccess={(password, ticketVal) => {
            setPwd(password);
            setTicket(ticketVal);
            setModifyVisible(false);
          }}
          onCancel={() => {
            setPwd('');
            setTicket('');
            setModifyVisible(false);
            report({
              cate: REPORT_CATE.me,
              action: REPORT_ACTION.me_password_cancel,
            });
          }}
        />
        <Certification
          action="bindAccount"
          onSuccess={() => {
            getUserInfo();
            setBindVisible(false);
          }}
          visible={bindVisible}
          channel={channel}
          onCancel={() => {
            setBindVisible(false);
          }}
        />
        <MModal
          title={intl.formatMessage({ id: 'key_connect_to_facebook' })}
          onCancel={() => {
            setFacebookLoginTipVisible(false);
            report({
              cate: REPORT_CATE.me,
              action: REPORT_ACTION.me_facebook_close,
            });
          }}
          key="facebook"
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
          title={intl.formatMessage({ id: 'key_disconnect_facebook' })}
          onCancel={() => {
            setFacebookUnbindVisible(false);
          }}
          key="facebook-not"
          onConfirm={() => onDisconnectConfirmHandler('facebook')}
          visible={facebookUnbindVisible}
        >
          <div className={styles.tip}>
            {intl.formatMessage({ id: 'key_sure_unbind_line' })}
          </div>
        </MModal>
        <MModal
          title={intl.formatMessage({ id: 'key_connect_to_line' })}
          onCancel={() => {
            setLineLoginTipVisible(false);
            report({
              cate: REPORT_CATE.me,
              action: REPORT_ACTION.me_line_close,
            });
          }}
          key="line"
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
          title={intl.formatMessage({ id: 'key_disconnect_line' })}
          onCancel={() => {
            setLineUnbindVisible(false);
          }}
          key="line-not"
          onConfirm={() => onDisconnectConfirmHandler('line')}
          visible={lineUnbindVisible}
        >
          <div className={styles.tip}>
            {
              intl.formatMessage({ id: 'key_sure_unbind_line' })
            }
          </div>
        </MModal>
        <MModal
          title={intl.formatMessage({ id: 'key_connect_google' })}
          onCancel={() => {
            setGoogleLoginTipVisible(false);
            report({
              cate: REPORT_CATE.me,
              action: REPORT_ACTION.me_google_close,
            });
          }}
          key="google"
          onConfirm={onConfirmHandler}
          visible={googleLoginTipVisible}
          type="google"
          onFailure={onFailureHandler}
        >
          <div className={styles.tip}>
            <FormattedMessage id="key_sure_login_with_google" />
          </div>
        </MModal>
        <MModal
          title={intl.formatMessage({ id: 'key_disconnect_account_title' })}
          onCancel={() => {
            setGoogleUnbindVisible(false);
          }}
          key="google-not"
          onConfirm={() => onDisconnectConfirmHandler('google')}
          visible={googleUnbindVisible}
        >
          <div className={styles.tip}>
            <FormattedMessage id="key_sure_unbind_google" />
          </div>
        </MModal>
      </div>
    </Spin>
  );
};

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser || {},
  loading: loading.models.user,
}))(Setting);
