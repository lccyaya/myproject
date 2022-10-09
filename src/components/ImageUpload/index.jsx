import styles from './index.less';
import IconFont from '@/components/IconFont';
import React, { useRef, useState } from 'react';
import classnames from 'classnames';
import { signUrl } from '@/services/s3';
import { randomHex } from '@/utils/utils';
import request from 'umi-request';
import { Image, Spin, message } from 'antd';
import { useIntl } from 'umi';

const ImageUpload = ({
  imgList = [],
  maxCount = 3,
  fileKey = 'feedback',
  onChange = () => {},
  width = 68,
  height = 68,
  className = '',
}) => {
  const intl = useIntl();
  const inputRef = useRef();
  const [blobUrl, setBlobUrl] = useState();
  const [loading, setLoading] = useState(false);
  const handleChange = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      return;
    }
    const url = await uploadImage(file);
    if (url) {
      setBlobUrl(window.URL.createObjectURL(file));
      if (inputRef.current) {
        inputRef.current.value = '';
        onChange([...imgList, { url: url }]);
      }
    }
  };
  const uploadImage = async (file) => {
    if (!file) return '';
    setLoading(true);
    const ext = file.type.replace(/image\//i, '').toLowerCase();
    const key = `${fileKey}/${randomHex(32)}.${ext}`;
    const { success, data } = await signUrl(key);
    if (!success || !data.presign_url) {
      message.error(intl.formatMessage({ id: 'key_image_upload_failed' }));
      setLoading(false);
      return '';
    }
    try {
      const resp = await request.put(data.presign_url, { body: file });
      setLoading(false);
      return data.cdn_upload;
    } catch (e) {
      message.error(intl.formatMessage({ id: 'key_image_upload_failed' }));
      setLoading(false);
    }
    return '';
  };
  const handleRemove = (index) => {
    onChange(
      imgList.filter((item, eq) => {
        return index !== eq;
      }),
    );
  };
  return (
    <div className={classnames(styles.image_upload, className)}>
      {imgList.map((item, index) => {
        return (
          <div className={styles.img_item} key={index} style={{ width, height }}>
            <Image src={item.url} alt="" width="100%" height="100%" />
            <span
              className={styles.close}
              onClick={() => {
                handleRemove(index);
              }}
            >
              <IconFont type="icon-guanbi" size={14} color="#fff" />
            </span>
          </div>
        );
      })}
      {imgList.length < maxCount ? (
        <Spin spinning={loading}>
          <div
            className={styles.default}
            onClick={() => inputRef.current?.click()}
            style={{ width, height }}
          >
            <IconFont type="icon-xiangji" size={22} color="#999" />
            <input
              ref={inputRef}
              type="file"
              hidden
              accept="image/jpeg,image/png"
              onChange={handleChange}
            />
          </div>
        </Spin>
      ) : null}
    </div>
  );
};

export default ImageUpload;
