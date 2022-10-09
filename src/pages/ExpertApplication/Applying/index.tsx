import { ConnectState } from '@/models/connect';
import { UserInfoType } from '@/services/user';
import { ExpertStatus } from '@/utils/scheme';
import { Avatar, Button, Form, Input, message, Spin, Upload } from 'antd';
import { Image, NavBar } from 'antd-mobile';
import React, { useMemo, useState } from 'react';
import { useDispatch, useHistory, useSelector } from 'umi';
import ApplicationSteps from '../ApplicationSteps';
import styles from './index.less';
import avatarImg from '@/assets/mine/avatar.png';
import FormField from '../FormField';
import { getAPIHost } from '@/utils/env';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/lib/upload';
import IconFont from '@/components/IconFont';
import lodash from 'lodash';
import { applicationExpert } from '@/services/expert';

type Props = {};

const Applying: React.FC<Props> = (props) => {
  const user = useSelector<ConnectState, UserInfoType | null | undefined>(
    (s) => s.user.currentUser,
  );
  const [submitLoading, setSubmitLoading] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const [picAvatar, setPicAvatar] = useState('');
  const [picIdFront, setPicIdFront] = useState('');
  const [picIdBack, setPicIdBack] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const uploadUrl = `${getAPIHost()}/api/v1/pre-sign-oss-url`;
  const headers = {
    'X-Requested-With': null,
  };

  const loading = useMemo(() => {
    return picLoading || submitLoading;
  }, [picLoading, submitLoading]);

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
      form.setFieldValue('avatar', presign_url);
    }
  };

  const onIDFrontChange = (info: UploadChangeParam<UploadFile<any>>) => {
    // 设置loading
    setPicLoading(info.file.status === 'uploading');

    if (info.file.status === 'done') {
      const presign_url = info.file.response?.data?.presign_url ?? '';
      setPicIdFront(presign_url);
      form.setFieldValue('ic_front', presign_url);
    }
  };

  const onIDBackChange = (info: UploadChangeParam<UploadFile<any>>) => {
    // 设置loading
    setPicLoading(info.file.status === 'uploading');

    if (info.file.status === 'done') {
      const presign_url = info.file.response?.data?.presign_url ?? '';
      setPicIdBack(presign_url);
      form.setFieldValue('ic_tail', presign_url);
    }
  };

  const onSubmit = async () => {
    const values = form.getFieldsValue();
    if (lodash.isEmpty(values.avatar)) {
      message.error('请上传头像');
      return;
    }
    if (lodash.isEmpty(values.nickname)) {
      message.error('请输入昵称');
      return;
    }
    if (lodash.isEmpty(values.introduce)) {
      message.error('请输入简介');
      return;
    }
    if (lodash.isEmpty(values.name)) {
      message.error('请输入姓名');
      return;
    }
    if (lodash.isEmpty(values.id_card)) {
      message.error('请输入身份证');
      return;
    }
    if (lodash.isEmpty(values.connect)) {
      message.error('请输入手机号');
      return;
    }
    if (lodash.isEmpty(values.ic_front)) {
      message.error('请上传身份证正面照片');
      return;
    }
    if (lodash.isEmpty(values.ic_tail)) {
      message.error('请上传身份证反面照片');
      return;
    }
    setSubmitLoading(true);
    const result = await applicationExpert(values);
    setSubmitLoading(false);
    if (result.err) {
      message.error(result.message);
      return;
    } else {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  };

  return (
    <Spin spinning={loading}>
      <Form form={form}>
        <Form.Item name="avatar">
          <FormField title="头像" subTitle="申请通过后不可更改" required>
            <Upload
              action={uploadUrl}
              showUploadList={false}
              maxCount={1}
              headers={headers}
              accept="image/png, image/jpeg"
              beforeUpload={beforeUpload}
              onChange={onFileChange}
            >
              {picAvatar.length > 0 ? (
                <Avatar src={picAvatar} size={46} />
              ) : (
                <IconFont type="icon-jiaru1" color="#F3F4F6" size={46} />
              )}
            </Upload>
          </FormField>
        </Form.Item>
        <FormField title="昵称" subTitle="专家昵称2-6个字，审核通过后，不可修改" required>
          <Form.Item name="nickname">
            <Input
              className={styles.field_input}
              style={{ width: '100px' }}
              placeholder="请输入"
              bordered={false}
              maxLength={12}
            />
          </Form.Item>
        </FormField>
        <FormField title="类别" required>
          <Form.Item name="types" initialValue={1}>
            <span>足球分析</span>
          </Form.Item>
        </FormField>
        <FormField title="介绍" required type="vertical">
          <Form.Item name="introduce">
            <Input.TextArea
              placeholder="请输入您的专家介绍，可以通过描述自身的优"
              bordered={false}
              rows={4}
            />
          </Form.Item>
        </FormField>
        <FormField title="真实姓名" required>
          <Form.Item name="name">
            <Input
              className={styles.field_input}
              placeholder="请输入"
              bordered={false}
              maxLength={20}
            />
          </Form.Item>
        </FormField>
        <FormField title="证件号码" required>
          <Form.Item name="id_card">
            <Input
              className={styles.field_input}
              placeholder="请输入"
              bordered={false}
              maxLength={20}
            />
          </Form.Item>
        </FormField>
        <FormField title="手机号码" required>
          <Form.Item name="connect">
            <Input
              className={styles.field_input}
              placeholder="请输入"
              bordered={false}
              maxLength={20}
              // type='number'
            />
          </Form.Item>
        </FormField>
        <FormField title="上传身份证照片" required type="vertical">
          <div className={styles.upload_box}>
            <Form.Item name="ic_front">
              <Upload
                action={uploadUrl}
                showUploadList={false}
                maxCount={1}
                headers={headers}
                accept="image/png, image/jpeg"
                beforeUpload={beforeUpload}
                onChange={onIDFrontChange}
              >
                <div className={styles.idcard_front}>
                  {picIdFront.length > 0 ? (
                    <Image src={picIdFront} width="100%" height="100%" />
                  ) : (
                    <IconFont type="icon-jiaru1" color="#FA5900" size={46} />
                  )}
                </div>
              </Upload>
            </Form.Item>
            <Form.Item name="ic_tail">
              <Upload
                action={uploadUrl}
                showUploadList={false}
                maxCount={1}
                headers={headers}
                accept="image/png, image/jpeg"
                beforeUpload={beforeUpload}
                onChange={onIDBackChange}
              >
                <div className={styles.idcard_back}>
                  {picIdBack.length > 0 ? (
                    <Image src={picIdBack} width="100%" height="100%" />
                  ) : (
                    <IconFont type="icon-jiaru1" color="#FA5900" size={46} />
                  )}
                </div>
              </Upload>
            </Form.Item>
          </div>
          <span className={styles.upload_note}>注：我们将严格保密您上传的资料，请放心上传。</span>
        </FormField>
        <Form.Item>
          <div className={styles.footer}>
            <Button className={styles.submit_button} type="primary" onClick={onSubmit}>
              <span className={styles.submit_title}>提交</span>
            </Button>
            <span className={styles.footer_title}>添加客服企业微信，更快了解审核状态</span>
          </div>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default Applying;
