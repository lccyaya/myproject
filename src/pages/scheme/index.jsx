import React, { useEffect } from 'react';
import Page from '@/components/page';
import PC from './pc';
import Mobile from './mobile.tsx';
import { useLocation } from 'umi';

// import Mobile from './pc';

const SchemePage = () => {
  const location = useLocation();
  const { id, match_id } = location.query;

  return (
    <Page
      pc={<PC id={id} matchId={match_id} />}
      mobile={<Mobile id={id} matchId={match_id} />}
    ></Page>
  );
};

export default SchemePage;
