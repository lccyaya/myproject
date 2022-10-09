import React from 'react';
import styles from './mobile.module.less';

const Achievements = ({ records = [] }) => {
  if (records.length === 0) {
    return null;
  }
  return (
    <div className={styles.item}>
      <div className={styles.label}>近期战绩：</div>
      <div className={styles.achievements}>
        {records.map((item, index) => {
          return +item ? (
            <div className={styles.red} key={index}>
              红
            </div>
          ) : (
            <div className={styles.black} key={index}>
              黑
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
