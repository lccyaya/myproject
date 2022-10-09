import Page from '@/components/page';
import PC from './pc';
import Mobile from './mobile';
const MatchPage = () => {
  return <Page pc={<PC />} mobile={<Mobile />} />;
};

export default MatchPage;
