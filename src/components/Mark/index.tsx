import React from 'react';
import classnames from 'classnames';
import styles from './index.less';

interface IProps {
  text: string;
  textColor: string;
  color: string;
  className?: string;
}

const Mark: React.FC<IProps> = (props) => {
  return <div style={{ background: props.color }} className={classnames(styles.wrapper, props.className)}>
    <div className={styles.content}>
      <span style={{ color: props.textColor }} className={styles.text}>{props.text}</span>
    </div>
    <div className={styles.triangle} />
  </div>;
};

export default Mark;
