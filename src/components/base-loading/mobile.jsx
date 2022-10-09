import React from 'react';
import styles from './mobile.module.less';
import cls from 'classnames';
const Mobile = ({ className = null, style }) => {
  return (
    <div className={cls(styles.loading_box, className)} style={style}>
      <img
        src={
          'https://cryptotwits-image.s3.ap-southeast-1.amazonaws.com/cryptotwits-static/3694ad10a1bf16c81cec294298315e94.gif'
        }
      />
    </div>
  );
};

export default Mobile;
