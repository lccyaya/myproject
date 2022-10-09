import React from 'react';
import Page from '@/components/page';
import PC from './pc';
import Mobile from './mobile';

const Scheme = ({ matchId }) => {
  return <Page pc={<PC matchId={matchId} />} mobile={<Mobile matchId={matchId} />} />;
};

export default Scheme;
