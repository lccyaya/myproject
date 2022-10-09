import React, { useRef, useState } from 'react';
import { Avatar, message } from 'antd';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { UserOutlined } from '@ant-design/icons';
import defaultAvatar from '@/assets/icon/avatar.svg';

import type { Dispatch } from 'umi';
import { FormattedMessage, useIntl, connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import * as certificationService from '@/services/certification';
import * as userService from '@/services/user';

import type { UserInfoType } from '@/services/user';

import styles from './index.less';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { report } from '@/services/ad';
import { randomHex } from '@/utils/utils';
import { sign } from '@/services/s3';
import request from 'umi-request';
import type { Result } from '@/utils/tools';

type IProfile = {
  onSummit: (e: { nickname: string }) => void;
  currentUser?: UserInfoType | null;
  dispatch: Dispatch;
};

type NicknameParams = {
  nickname: string;
};

const Profile: React.FC<IProfile> = (props) => {
  const { onSummit, currentUser } = props;
  const intl = useIntl();
  const [summitLoading, setSummitLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [blobUrl, setBlobUrl] = useState('');
  const [file, setFile] = useState<File | undefined>();

  const getUserInfo = async () => {
    setSummitLoading(true);
    const userInfo = await userService.queryCurrent();
    setSummitLoading(false);
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

  const uploadAvatar = async () => {
    if (!file) return '';
    // const ext = file.type.replace(/image\//i, '').toLowerCase();
    // const key = `avatar/${randomHex(32)}.${ext}`;
    // const { success, data } = await sign(key);
    // if (!success || !data.presign_url) return '';
    try {
      const result = await request.post('http://10.149.59.220:8080/api/v1/pre-sign-oss-url', {
        body: file,
        requestType: 'form',
      });
      console.log(result);
      return result.cdn_upload;
    } catch (e) {
      console.error('error in uploadAvatar:', e);
    }
    return '';
  };

  const handleSubmit = async (values: NicknameParams) => {
    // 判断是否相同
    if (currentUser && values.nickname === currentUser.nickname && !file) {
      message.info(
        intl.formatMessage({
          id: 'key_no_modification',
        }),
      );
      return;
    }
    setSummitLoading(true);
    let saveAvatarRes: Result<string> | undefined;
    let saveNicknameRes: Result<string> | undefined;
    if (file) {
      const avatar = await uploadAvatar();
      saveAvatarRes = await certificationService.modifyNickname({ key: 'avatar', value: avatar });
    }
    if (values.nickname !== currentUser!.nickname) {
      saveNicknameRes = await certificationService.modifyNickname({
        key: 'nickname',
        value: values.nickname,
      });
      if (saveAvatarRes?.success) {
        setFile(undefined);
      }
    }

    setSummitLoading(false);
    if ((saveAvatarRes || saveNicknameRes)?.success) {
      await getUserInfo();
      onSummit(values);
      message.success(
        intl.formatMessage({
          id: 'key_profile_update',
        }),
      );
    } else {
      // @ts-ignore
      message.error((saveAvatarRes || saveNicknameRes)?.message || 'Request Error');
    }

    report({
      cate: REPORT_CATE.me,
      action: REPORT_ACTION.me_name_save,
    });
  };

  const handleAvatarChange = () => {
    const f = inputRef.current?.files?.[0];
    if (!f) {
      return;
    }
    setFile(f);
    const url = window.URL.createObjectURL(f);
    setBlobUrl(url);
    inputRef.current!.value = '';
  };

  return (
    <div className={styles.container}>
      <div className={styles.avatarWrapper}>
        <Avatar className={styles.avatar} src={blobUrl || currentUser?.avatar || defaultAvatar} />
        <div className={styles.editBtn} onClick={() => inputRef.current?.click()}>
          <FormattedMessage id="key_change" />
        </div>
        <input
          ref={inputRef}
          type="file"
          hidden
          accept="image/jpeg,image/png"
          onChange={handleAvatarChange}
        />
      </div>
      <div className={styles.main}>
        {currentUser?.nickname ? (
          <ProForm
            autoFocusFirstInput={false}
            initialValues={{
              nickname: currentUser?.nickname,
            }}
            submitter={{
              searchConfig: {
                submitText: intl.formatMessage({
                  id: 'key_save',
                }),
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: summitLoading,
                size: 'large',
                style: {
                  // width: '100%',
                },
              },
            }}
            onFinish={(values) => {
              handleSubmit(values as NicknameParams);
              return Promise.resolve();
            }}
          >
            <ProFormText
              name="nickname"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              label={
                <div className={styles.label}>
                  <FormattedMessage id="key_username" />
                </div>
              }
              placeholder={intl.formatMessage({
                id: 'key_username_chars',
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
          </ProForm>
        ) : null}
      </div>
    </div>
  );
};
export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(Profile);
