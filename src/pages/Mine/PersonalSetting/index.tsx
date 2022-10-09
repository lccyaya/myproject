import IconFont from '@/components/IconFont';
import { ConnectState } from '@/models/connect';
import { UserInfoType } from '@/services/user';
import { ExpertStatus } from '@/utils/scheme';
import { NavBar } from 'antd-mobile';
import React, { useMemo, useState } from 'react';
import { useDispatch, useHistory, useSelector } from 'umi';
import styles from './index.less';
import avatarImg from '@/assets/mine/avatar.png';
import { Avatar, Button, Form, Input, message, Modal, Spin, Upload } from 'antd';
import { getAPIHost } from '@/utils/env';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/lib/upload';
import lodash from 'lodash';
import { modifyNickname } from '@/services/certification';

type Props = {};

const PersonalSetting: React.FC<Props> = (props) => {
  const user = useSelector<ConnectState, UserInfoType | null | undefined>(
    (s) => s.user.currentUser,
  );
  const history = useHistory();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const avatar = user?.expert?.status == ExpertStatus.Accept ? user?.expert?.avatar : user?.avatar;
  const nickname =
    user?.expert?.status == ExpertStatus.Accept ? user?.expert?.nickname : user?.nickname;
  const status = user?.expert?.status ?? ExpertStatus.None;

  const settingItems = [
    {
      title: '头像',
      key: 'avatar',
    },
    {
      title: '用户名',
      key: 'nickname',
    },
  ];

  const back = () => {
    history.goBack();
  };

  const uploadUrl = `${getAPIHost()}/api/v1/pre-sign-oss-url`;
  const headers = {
    'X-Requested-With': null,
  };

  const [visible, setVisible] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const [picAvatar, setPicAvatar] = useState('');

  const loading = useMemo(() => {
    return picLoading;
  }, [picLoading]);

  const beforeUpload = (file: RcFile) => {
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('图片大小不可以超过5MB!');
    }
    return isLt2M;
  };

  const onFileChange = (info: UploadChangeParam<UploadFile<any>>) => {
    // 设置loading
    setPicLoading(info.file.status === 'uploading');

    if (info.file.status === 'done') {
      const presign_url = info.file.response?.data?.presign_url ?? '';
      setPicAvatar(presign_url);
      updateUserInfo({ key: 'avatar', value: presign_url });
    }
  };

  const updateUserInfo = async (params: any) => {
    setPicLoading(true);
    const result = await modifyNickname(params);
    setPicLoading(false);
    if (result.err) {
      message.error(result.message);
      return;
    } else {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  };

  const avatarResource = useMemo(() => {
    if (!lodash.isEmpty(picAvatar)) {
      return picAvatar;
    }
    if (!lodash.isEmpty(avatar)) {
      return avatar;
    }
    return avatarImg;
  }, [picAvatar]);

  const clickItem = (key: string) => {
    if (status == ExpertStatus.Accept) {
      message.error('认证专家资料修改请联系客服');
      return;
    }
    if (key === 'nickname') {
      setVisible(true);
    }
  };

  const onCancel = () => {
    setVisible(false);
  };

  const updateNickname = async (values: any) => {
    await updateUserInfo({ key: 'nickname', value: values.nickname });
    setVisible(false);
  };

  return (
    <div className={styles.container}>
      <NavBar className={styles.navbar} onBack={back}>
        个人设置
      </NavBar>
      <Spin spinning={loading}>
        <div className={styles.items_container}>
          {settingItems.map((settingItem) => (
            <div
              className={styles.item_box}
              key={settingItem.key}
              onClick={() => clickItem(settingItem.key)}
            >
              <div className={styles.item_content}>
                <div className={styles.item_title}>{settingItem.title}</div>
                {settingItem.key == 'avatar' ? (
                  <Upload
                    action={uploadUrl}
                    showUploadList={false}
                    maxCount={1}
                    headers={headers}
                    accept="image/png, image/jpeg"
                    beforeUpload={beforeUpload}
                    onChange={onFileChange}
                    disabled={status == ExpertStatus.Accept}
                  >
                    <Avatar src={avatarResource} size={40} />
                  </Upload>
                ) : (
                  <div className={styles.nickname}>{nickname}</div>
                )}
              </div>
              <IconFont
                className={styles.arrow_icon}
                type="icon-jiantouyou"
                color="#BBBBBB"
                size={14}
              ></IconFont>
            </div>
          ))}
        </div>
        <Modal
          destroyOnClose
          visible={visible}
          footer={null}
          // title="修改昵称"
          closable={false}
          centered
          wrapClassName={styles.modal}
          onCancel={onCancel}
        >
          <Form form={form} onFinish={updateNickname}>
            <div>
              <div className={styles.header_box}>
                <div className={styles.close_box} onClick={onCancel}>
                  <IconFont type="icon-guanbi" size={22} />
                </div>
              </div>
              <Form.Item
                name="nickname"
                initialValue={nickname}
                rules={[
                  {
                    required: true,
                    message: '请输入昵称',
                  },
                ]}
              >
                <Input
                  className={styles.input}
                  maxLength={12}
                  placeholder="请输入昵称"
                  bordered={false}
                />
              </Form.Item>
              <div className={styles.footer_box}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    修改昵称
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </Modal>
      </Spin>
    </div>
  );
};

export default PersonalSetting;
