import React from 'react';

import styles from './mobile.module.less';

const Container = ({ children, backgroundColor = '#fff' }) => {
  return <div className={styles.container} style={{ backgroundColor }}>{children}</div>;
};
Container.defaultProps = {};

export const ContainerWarp = ({ children, backgroundColor = '#fff' }) => {
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
