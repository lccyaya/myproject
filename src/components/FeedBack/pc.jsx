import { BackTop, Modal, Input, Button, message, Form } from 'antd';
import IconFont from '@/components/IconFont';
import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import ImageUpload from '@/components/ImageUpload';
import { updateFeedbackQuestion, getFeedbackCategory } from '@/services/feedback';
import { useIntl } from 'umi';
import styles from './pc.module.less';

const FeedBack = ({ visible, setVisible }) => {
  const MAX_LEN = 500;
  const intl = useIntl();
  const [curLen, setCurLen] = useState(0);
  const [imgList, setImgList] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]);
  const [categoryId, setCategoryId] = useState();
  const [defaultId, setDefaultId] = useState();
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [hasError, setHasError] = useState(false);
  const [form] = Form.useForm();

  const disabled = useMemo(() => {
    return !description || !categoryId || hasError;
  }, [description, categoryId, hasError]);

  const onUploadChange = (val) => {
    setImgList(val);
  };
  const onChange = (e) => {
    const val = e.target.value;
    const len = Array.from(val).length;
    setCurLen(len);
    setDescription(val);
  };
  const onEmailChange = (e) => {
    const val = e.target.value;
    if (!val) {
      setHasError(false);
    } else {
      const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g;
      if (!reg.test(val)) {
        setEmail('');
        setHasError(true);
      } else {
        setEmail(val);
        setHasError(false);
      }
    }
  };

  const onSubmit = async () => {
    const resp = await updateFeedbackQuestion({
      project: '007',
      category_id: categoryId,
      description,
      images: imgList.map((item) => item.url),
      email,
    });
    if (resp.success) {
      message.success(intl.formatMessage({ id: 'key_feedback_successful' }));
      onReset();
    }
  };
  const onReset = () => {
    setVisible(false);
    setCategoryId(defaultId);
    setEmail('');
    setDescription('');
    setImgList([]);
    form.resetFields();
  };
  useEffect(() => {
    let isUnmount = false;
    const getData = async () => {
      const resp = await getFeedbackCategory('007');
      if (resp.success && !isUnmount) {
        const data = resp.data;
        data.forEach((item) => {
          if (item.default) {
            setDefaultId(item.id);
            setCategoryId(item.id);
          }
        });
        setCategoryItems(data || []);
      }
    };
    getData();
    return () => (isUnmount = true);
  }, []);
  return (
    <Modal
      destroyOnClose
      visible={visible}
      footer={null}
      centered
      closable={false}
      wrapClassName={styles.modal}
    >
      <Form form={form}>
        <div
          className={styles.feedback_wrap}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className={styles.close} onClick={onReset}>
            <IconFont className={styles.icon} type="icon-guanbi" size={22} />
          </div>
          <div className={styles.title}>{intl.formatMessage({ id: 'key_feedback' })}</div>
          <div className={styles.content}>
            <div className={styles.label}>
              {intl.formatMessage({ id: 'key_feedback_category' })}
            </div>
            <div className={styles.category}>
              {categoryItems.map((item) => {
                return (
                  <div
                    className={classNames(
                      styles.category_item,
                      item.id === categoryId ? styles.active : null,
                    )}
                    key={item.id}
                    onClick={() => {
                      setCategoryId(item.id);
                    }}
                  >
                    {item.content}
                  </div>
                );
              })}
            </div>
            <div className={styles.label}>
              {intl.formatMessage({ id: 'key_question_description' })}
            </div>

            <div className={styles.description}>
              <div className={styles.textarea_box}>
                <Form.Item name="description">
                  <Input.TextArea
                    placeholder={intl.formatMessage({ id: 'key_problem_detail' })}
                    maxLength={MAX_LEN}
                    bordered={false}
                    onChange={onChange}
                  />
                </Form.Item>
                <ImageUpload
                  imgList={imgList}
                  onChange={onUploadChange}
                  className={styles.img_upload}
                />
                <div className={styles.word_num}>
                  {curLen}/{MAX_LEN}
                </div>
              </div>
            </div>
            <div className={styles.label}>{intl.formatMessage({ id: 'key_feedback_email' })}</div>
            <div className={styles.email_input}>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: false,
                  },
                  {
                    pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g,
                    message: intl.formatMessage({ id: 'key_invalid_email' }),
                  },
                ]}
              >
                <Input
                  placeholder={intl.formatMessage({ id: 'key_feedback_email2' })}
                  onChange={onEmailChange}
                />
              </Form.Item>
              {/* <p className={styles.errorTip}>
                  {hasError ? intl.formatMessage({ id: 'key_invalid_email' }) : ''}
                </p> */}
            </div>
          </div>
          <div className={styles.btns}>
            <Button type="primary" disabled={disabled} onClick={onSubmit}>
              {intl.formatMessage({ id: 'key_submit' })}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};
export default FeedBack;
