import PCHeader from '@/components/PCHeader';
import { Layout } from 'antd';
import React from 'react';
import { ReactNode } from 'react';
// const { Header, Footer, Sider, Content } = Layout;
import styles from "./pc.less";

type Props = {
  children?: ReactNode;
};

const NewBasicLayout: React.FC<Props> = (props: Props) => {
  return (
    <div className="h-full" style={{display: 'flex', flexDirection: 'column'}}>
      <PCHeader></PCHeader>
      <div className={styles.content}>{props.children}</div>
    </div>
    // <Layout>
    //   <Header style={{ position: 'fixed', zIndex: 1, width: '100%', height: '72px', padding: '0px' }}>
    //     <PCHeader></PCHeader>
    //   </Header>
    //   <Content>{props.children}</Content>
    // </Layout>
  );
};

export default NewBasicLayout;
