import type { ReactNode } from 'react';
import styles from './header.less';
import { Link } from 'umi';
import { FormattedMessage } from '@@/plugin-locale/localeExports';

export default function Header(props: {
  title: ReactNode;
  hideMore?: boolean;
  morePath?: string;
  right?: ReactNode;
}) {
  return <div className={styles.commonHeader}>
    <div className={styles.commonHeaderLeft}>{props.title}</div>
    {props.right
      ? props.right
      : Boolean(!props.hideMore && props.morePath) &&
      <Link className={styles.commonHeaderRight} to={props.morePath!}>
        <FormattedMessage id='key_more' />
        <div className={styles.arrow} />
      </Link>}
  </div>;
}
