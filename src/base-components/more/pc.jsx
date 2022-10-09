import React from 'react';
import { FormattedMessage, useIntl } from 'umi';
import styles from './pc.module.less';
import IconFont from '@/components/IconFont';
import cls from 'classnames';

const More = ({ show, type = 'icon-shuangjiantou', className, onClick = () => {} }) => {
  const intl = useIntl();
  return show === false ? null : <div className={cls(styles.more, className)} onClick={onClick}>
  <IconFont className={styles.icon} size={16} type={type}/>
  {intl.formatMessage({id: "key_scroll_down",defaultMessage: "key_scroll_down"})}
</div>
}
export default More;