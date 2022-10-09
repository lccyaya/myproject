import React from 'react';
import styles from './index.module.less';

const Bounce = () => {
  return (
    <div className={styles.bounce}>
      <img src={require('@/assets/image/living.gif')} alt="" />
    </div>
  );
};

export default Bounce;
