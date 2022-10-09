import React, { useState } from 'react';
import styles from './pc.module.less';
import cls from 'classnames';

const TimeTitle = ({ title, className, sticky, top = 0, ref }) => {
  return (
    <div ref={ref}
      className={cls(styles.time_title, className)}
      style={sticky ? { position: 'sticky', top } : {}}
    >
      {title}
    </div>
  );
};

export default TimeTitle;
