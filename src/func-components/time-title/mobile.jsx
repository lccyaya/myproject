import React, { useState } from 'react';
import styles from './mobile.module.less';
import cls from 'classnames';

const TimeTitle = ({ title, className, sticky, top = 0 }) => {
  return (
    <div
      className={cls(styles.time_title, className)}
      style={sticky ? { position: 'sticky', top } : {}}
    >
      {title}
    </div>
  );
};

export default TimeTitle;
