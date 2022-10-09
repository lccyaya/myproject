import React from 'react';
import styles from './index.less';
import classnames from 'classnames';

type PlayerStatus = {
  src?: string;
  text?: string;
  noBackground?: boolean;
};

const StatusIcon: React.FC<PlayerStatus> = (props) => {
  const { src, text, noBackground } = props;
  return (
    <div className={classnames(styles.container, text ? styles.text : '', !noBackground ? styles.gray : '')}>
      {src && <img src={src} />}
      {text && <span>{text}</span>}
    </div>
  );
};

export default StatusIcon;
