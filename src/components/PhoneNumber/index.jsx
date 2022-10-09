import React, { useState, useRef, useMemo } from 'react';
import dialCode from '@/constants/dial-code';
import styles from './index.less';
import { Input, Dropdown } from 'antd';
import { useIntl } from 'umi';
import Iconfont from '@/components/IconFont';
import SendMsg from '@/components/SendMsg';
import { useFocusWithin } from 'ahooks';
import cls from 'classnames';
import { type } from '../../services/competition';

const PhoneNumber = ({
  onChange = () => {},
  sendCode = false,
  placeholder,
  name,
  prefix,
  value = '',
}) => {
  const code_list = {
    zh: '+86',
    en: '+1',
    th: '+66',
  };
  const language = navigator.language;
  const systemCode = code_list[language?.split('-')[0]];
  const [defaultCode, defaultPhone] = value.split('-');
  const [code, setCode] = useState(defaultCode || systemCode || '+1');
  const [phone, setPhone] = useState(defaultPhone || '');
  const [visible, setVisible] = useState(false);
  const [keyWords, setKeyWords] = useState('');
  const intl = useIntl();
  const ref = useRef();
  const isFocusWithin = useFocusWithin(ref);
  const handleSearch = (e) => {
    setKeyWords(e.target.value);
  };
  const onVisibleChange = (val) => {
    setVisible(val);
  };
  const result = useMemo(() => {
    return dialCode.filter((item) => {
      const country = item.country && item.country.toLocaleLowerCase();
      const code = item.code && item.code.toLocaleLowerCase();
      return (
        country.indexOf(keyWords && keyWords.toLocaleLowerCase()) > -1 ||
        code.indexOf(keyWords && keyWords.toLocaleLowerCase()) > -1
      );
    });
  }, [keyWords]);

  const menu = () => {
    return (
      <div className={styles.container}>
        <div className={styles.search_box}>
          <Input
            placeholder={intl.formatMessage({
              id: 'key_search',
            })}
            className={styles.search}
            prefix={<Iconfont name="icon-shurusousuo" size={18} color="#A8A8A8" />}
            onChange={handleSearch}
            value={keyWords}
          />
        </div>
        <div className={styles.list_wrap}>
          {result.map((item, index) => {
            return (
              <div
                className={cls(styles.item, item.code === code ? styles.active : null)}
                key={index}
                onClick={() => {
                  triggerChange(item.code);
                  setCode(item.code);
                  setVisible(false);
                  setKeyWords('');
                }}
              >
                <span>{item.country}</span>
                <span>{item.code}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  const PhonePrefix = (
    <Dropdown trigger="click" overlay={menu} visible={visible} onVisibleChange={onVisibleChange}>
      <div className={styles.phone_prefix}>
        <span>{prefix || <Iconfont type="icon-shouji" size={14} />}</span>
        <span className={styles.dial_code}>{code}</span>
        <Iconfont type="icon-biaoqianjiantou" color="#A8A8A8" />
      </div>
    </Dropdown>
  );

  const triggerChange = (val) => {
    onChange(`${val}-${phone}`);
  };
  const onInputChange = (e) => {
    const val = e.target.value;
    setPhone(val);
    onChange(`${code}-${val}`);
  };
  return (
    <div className={cls(styles.form_item_wrap, isFocusWithin ? styles.focused : null)} ref={ref}>
      <Input
        placeholder={placeholder}
        allowClear
        maxLength={11}
        addonBefore={PhonePrefix}
        onChange={onInputChange}
        name={name}
        defaultValue={defaultPhone}
      />
      <div className={styles.form_item_send_btn} style={{ display: sendCode ? 'block' : 'none' }}>
        <SendMsg phone={code + '-' + phone} scene="sms-login" />
      </div>
    </div>
  );
};
export default PhoneNumber;
