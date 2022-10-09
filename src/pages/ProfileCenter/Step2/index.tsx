import React from 'react';
import PC from '../create/step2';
import Mobile from '@/pages/SchemeCenter/Step02';
import Page from '@/components/page';
export default function () {
  return <Page pc={<PC />} mobile={<Mobile />} />;
}
