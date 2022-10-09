import styles from './ad.less';
import Banner from '@/components/Banner';
import type { CSSProperties } from 'react';
import { useSelector } from 'umi';
import type { ConnectState } from '@/models/connect';

export default function Ad(props: {
  style?: CSSProperties;
}) {
  const abVersion = useSelector<ConnectState, ConnectState['abtest']['version']>((state) => state.abtest.version);

  return <div className={styles.wrapper} style={props.style}>
    <Banner reportTag={abVersion.toLowerCase()} />
  </div>
}
