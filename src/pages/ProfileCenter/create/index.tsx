import React from 'react';
import PC from './createPc';
import Mobile from '@/pages/SchemeCenter/Create';
import Page from '@/components/page';
export default function () {
  return <Page pc={<PC />} mobile={<Mobile />} />;
}