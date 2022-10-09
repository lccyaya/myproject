import React from 'react';
import styles from './index.module.less';

const HelfContent = ({ children }) => {
  return <div className={styles.helf_content}>{children}</div>;
};

export default HelfContent;
