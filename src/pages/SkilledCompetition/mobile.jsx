import Competition from '@/components/expert/competition/mobile';
import { history } from 'umi';
export default function Mobile() {
  const { query } = history.location;
  return <Competition expertId={query.id} />;
}
