import styles from './mobile.module.less';
import Iconfont from '@/components/IconFont';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { history } from 'umi';
import { handleReport } from '@/utils/report';

export default function SkilledCompetitions({ label, list = [], expertId }) {
  return list.length ? (
    <div
      className={styles.skilled_competitions}
      onClick={() => {
        handleReport({
          action: 'league_more',
        });
        const lang = toShortLangCode(locale.getLocale());
        history.push(`/${lang}/skilled-competition?id=${expertId}`);
      }}
    >
      <div className={styles.competition_title}>{label}</div>
      <div className={styles.tags}>
        {list.slice(0, 3).map((item) => {
          return (
            <span className={styles.tag} key={item}>
              {item}
            </span>
          );
        })}
        <span>
          <Iconfont className={styles.icon} type="icon-jiantouyou" />
        </span>
      </div>
    </div>
  ) : null;
}
