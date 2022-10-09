import React, { useEffect, useState } from 'react';
import styles from './pc.module.less';
import IconFont from '@/components/IconFont';
import cls from 'classnames';

const Container = React.memo(
  ({ show, children, active, title, className, icon, onClick = () => {} }) => {
    const [isReady, setReady] = useState(false);
    useEffect(() => {
      setReady(true);
    }, []);
    if (!isReady) {
      return null;
    }
    return show === false ? null : (
      <div className={cls(styles.icon_button, active ? styles.active : null, className)}>
        <div className={styles.box} onClick={onClick}>
          {icon ? <IconFont className={styles.icon} type={icon} size={26} /> : null}
          <span className={styles.title}>{title}</span>
          <IconFont className={styles.arrow} type="icon-zhankai" size={26} />
        </div>
        {children}
      </div>
    );
  },
);

export default Container;
