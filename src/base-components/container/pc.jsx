import React from 'react';

import styles from './pc.module.less';

const Container = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};
Container.defaultProps = {};

export const ContainerWarp = ({ children, backgroundColor }) => {
  return (
    <div className={styles.containerWarp} style={{ backgroundColor }}>
      {children}
    </div>
  );
};
ContainerWarp.defaultProps = {
  backgroundColor: '#fff',
};

export default Container;
