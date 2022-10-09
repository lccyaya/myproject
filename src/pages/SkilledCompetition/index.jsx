import React from 'react';
import Page404 from '../404';
import Mobile from './mobile';
import Page from '@/components/page';
export default function () {
  return <Page pc={<Page404 />} mobile={<Mobile />} />;
}
