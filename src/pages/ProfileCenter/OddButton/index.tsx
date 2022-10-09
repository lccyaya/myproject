import React, { MouseEventHandler } from 'react';
import styles from './index.less';
import classnames from 'classnames';

type Props = {
  selected?: boolean;
  disabled?: boolean;
};

const OddButton: React.FC<Props> = (props) => {
  return (
    <div
      className={classnames(
        styles.container,
        props.selected ? styles.selected : null,
        props.disabled ? styles.disabled : null,
      )}
    >
      {props.children}
    </div>
  );
};

export default OddButton;
