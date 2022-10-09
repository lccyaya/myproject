import React from 'react';
import { Switch } from 'antd';
import styles from './mobile.module.less';
import cls from 'classnames';

const SwitchCom = ({ title, className, value, onChange = () => {} }) => {
  return (
    <div className={cls(styles.switch, className)}>
      <div className={styles.title}>{title}</div>
      <Switch
        className={cls(styles.button, value ? styles.active : null)}
        checked={value}
        onChange={(e) => {
          onChange(e);
        }}
      />
    </div>
  );
};

export default SwitchCom;
