import styles from './mobile.module.less';
import Iconfont from '@/components/IconFont';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { history } from 'umi';
import Avatar from '@/components/avatar';

export default function WatchExpert({ list = [] }) {
  // const list = [
  //   'https://image.blocktwits.com/cmc/coin_1.png',
  //   'https://image.blocktwits.com/cmc/coin_1.png',
  //   'https://image.blocktwits.com/cmc/coin_1.png',
  // ];
  return (
    <div className={styles.panel}>
      <div className={styles.label}>关注的专家</div>
      <div
        className={styles.avatar_list}
        onClick={() => {
          const lang = toShortLangCode(locale.getLocale());
          history.push(`/${lang}/expert/rank?tab=2`);
        }}
      >
        {list.map((item) => {
          return <Avatar size={24} src={item} className={styles.item} key={item} />;
        })}
        <Iconfont type="icon-jiantouyou" className={styles.icon} />
      </div>
    </div>
  );
}
