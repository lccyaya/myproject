import TopRecommend from './top-recommend';
import MajorMatch from './major-match';
import DownloadTip from '@/pages/Home/mobile/components/download-tip';
import Highlight from './highlight';
import Ad from '../components/ad';
import HotNews from '@/pages/Home/mobile/version-a/hot-news';
import LeagueNews from '@/pages/Home/mobile/version-a/league-news';
import HotSchemes from './hot-schemes/index';
import HotExpert from './HotExpert';
import styles from "./index.less";

export default function MobileHomeA() {
  return (
    <div className={styles.container}>
      <Ad />
      {/* <TopRecommend /> */}
      <MajorMatch />
      {/* <DownloadTip /> */}
      {/* <Highlight /> */}
      <HotExpert />
      {/* <HotNews /> */}
      {/* <LeagueNews /> */}
      <HotSchemes />
    </div>
  );
}
