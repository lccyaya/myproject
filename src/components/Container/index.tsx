
import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import classnames from 'classnames';
import styles from './index.less';



interface ContainerType {
  className?: string;
}

const Container: React.FC<ContainerType> = (props) => {
  const { children, className } = props;
  return <PageContainer header={{ title: null }} content={children} className={classnames(styles.main, className)} />;
};

export default Container;
