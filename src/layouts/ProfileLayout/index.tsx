import Page from '@/components/page';
import React from 'react';
import PC from './pc';
import Mobile from './mobile';

type Props = {};

const ProfileLayout: React.FC<Props> = (props) => {
  return <Page pc={<PC {...props} />} mobile={<Mobile {...props} />} />;
};

export default ProfileLayout;
