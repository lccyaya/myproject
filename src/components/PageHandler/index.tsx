import React, { useState } from 'react';
import classnames from 'classnames';
import BackTopIcon from '@/assets/icon/mobile/back_top.svg';
import RefreshIcon from '@/assets/icon/mobile/refresh.svg';
import styles from './index.less';

const IconWrapper = (props: any) => {
  return <div className={styles.icon} onClick={props.onClick}>
    <img className={props.className} src={props.icon} />
  </div>
}
interface IProps {
  onBackTop: () => void;
  onRefresh: () => void;
}
const PageHandler: React.FC<IProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onRefreshHandler = () => {
    props.onRefresh();
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  return <div className={styles.wrapper}>
    <IconWrapper className={classnames(loading ? styles.refresh : '')} onClick={onRefreshHandler} icon={RefreshIcon} />
    <IconWrapper onClick={props.onBackTop} icon={BackTopIcon} />
  </div>
}

export default PageHandler;
