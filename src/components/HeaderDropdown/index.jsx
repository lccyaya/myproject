import { Dropdown } from 'antd';
import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

const HeaderDropdown = ({ overlayClassName, align, ...restProps }) => {
  return (
    <Dropdown
      overlayClassName={classNames(
        styles.container,
        overlayClassName,
        align === 'center' ? styles.center : null,
      )}
      {...restProps}
    />
  );
};

export default HeaderDropdown;
