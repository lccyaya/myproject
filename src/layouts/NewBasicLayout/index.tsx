import React from 'react';
import PC from './pc';
import Mobile, { BasicLayoutProps } from '../BasicLayout';
import Page from '@/components/page';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';

const Layout: React.FC<BasicLayoutProps> = (props) => {
  return <Page pc={<PC {...props} />} mobile={<Mobile {...props} />} />;
};

export default Layout;
