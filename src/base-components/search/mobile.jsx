import React from 'react';
import { Input } from 'antd';
import { useIntl } from 'umi';
import styles from './mobile.module.less';
import IconFont from '@/components/IconFont';
import cls from 'classnames';

let antiShakeTime = null;
const Search = ({ width = '100%', className, placeholder, value, onChange = () => {}, onEnter = () => {}, onFocus = () => {} }) => {
  const intl = useIntl();
  const handleChange = (v) => {
    const value = v.target.value;
    onChange(value)
    // 防抖一下
    antiShakeTime && clearTimeout(antiShakeTime);
    antiShakeTime = setTimeout(() => {
      onEnter(value);
    }, 500)
  }
  return <div style={{ width }} className={cls(styles.search, className)}>
    <Input
      placeholder={placeholder || intl.formatMessage({ id: 'key_search_the_team' })}
      className={cls(styles.input)}
      value={value} autoFocus
      onFocus={() => {
        onFocus();
      }}
      onChange={handleChange}
    />
    <IconFont type='icon-sousuo' className={styles.SearchOutlined} size={20}/>
  </div>
};

export default Search;