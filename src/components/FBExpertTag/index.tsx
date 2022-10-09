import React from 'react';
import styles from './index.less';

export enum FBTagType {
  HitRate = 0,
  Continue = 1,
}

type Props = {
  tag: string;
  type: FBTagType;
};

const FBExpertTag: React.FC<Props> = (props) => {
  const { tag, type } = props;

  return (
    <>
      {type === FBTagType.HitRate ? (
        <div className={styles.score_box}>
          <div className={styles.score}>{tag}</div>
        </div>
      ) : (
        <div className={styles.score_box}>
          <div className={styles.hit}>{tag}</div>
          <div className={styles.score}>连红</div>
        </div>
      )}
    </>
  );
};

export default FBExpertTag;
