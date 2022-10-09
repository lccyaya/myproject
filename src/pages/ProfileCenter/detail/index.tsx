import React from 'react';
import PC from './pc';
import Mobile from '@/pages/SchemeCenter/Detail';
import Page from '@/components/page';
export default function () {
  return <Page pc={<PC />} mobile={<Mobile />} />;
}