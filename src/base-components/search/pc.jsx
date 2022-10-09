import React, { useState } from 'react';
import { Input } from 'antd';
import { useIntl } from 'umi';
import styles from './pc.module.less';
import IconFont from '@/components/IconFont';
import cls from 'classnames';

const Search = ({ width = '100%', className, value, placeholder, onFocus = () => {}, onChange = () => {}, onEnter = () => {} }) => {
  const intl = useIntl();
  const [isFocus, setIsFocus] = useState(false);
  const initPlaceholder = intl.formatMessage({ id: 'key_search_the_team' })
  const usePlaceholder = value === '' && !isFocus;
  return (
    <>
    <div style={{ width }} className={cls(styles.search, className)}>
      <Input
        // placeholder={placeholder || intl.formatMessage({ id: 'key_search_the_team' })}
        className={cls(styles.input, usePlaceholder ? styles.placeholder : null)}
        value={usePlaceholder ? placeholder || initPlaceholder : value}
        onFocus={() => {
          setIsFocus(true);
          onFocus();
        }}
        onBlur={() => setIsFocus(false)}
        onPressEnter={() => onEnter(value)}
        onChange={(v) => onChange(v.target.value)}
      />
      <IconFont type="icon-sousuo" className={styles.SearchOutlined} size={22} />
    </div>
    </>
  );
};

export default Search;
