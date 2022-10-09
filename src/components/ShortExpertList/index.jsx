import styles from './index.less';
import IconFont from '@/components/IconFont';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { history } from 'umi';
import Avatar from '@/components/avatar';
import { handleReport } from '@/utils/report';
import cls from 'classnames';
export default function ExpertList({ list, type }) {
  return (
    <div className={styles.expert_list}>
      <div className={styles.football} />

      {list.map((item, index) => {
        const num = type === 'gmz' ? item.hit_rate : item.max_hit;
        return (
          <div
            className={styles.item}
            key={item.expert_id}
            onClick={() => {
              handleReport({
                action: 'expert_enter',
                tag: type === 'gmz' ? 'hit' : 'continuous',
              });
              const lang = toShortLangCode(locale.getLocale());
              history.push(`/${lang}/expert-detail?id=${item.expert_id}`);
            }}
          >
            <div className={styles.avatar}>
              <Avatar src={item.avatar} size={56} />
              <div className={cls(styles.tip, styles[`tip_${index}`])} />
              <div className={cls(styles.circle, styles[`circle_${index}`])} />
              {item.sale_num ? <span className={styles.sale}>在售{item.sale_num}</span> : null}
            </div>
            <div className={styles.nickname}>{item.nickname}</div>

            <div
              className={cls(
                styles.hit_rate,
                styles[`hit_rate_${index}`],
                type === 'gmz' ? styles.hit_rate_gmz : null,
              )}
            >
              <div className={styles.hit}>
                <span className={styles.hit_num}>{num}</span>
                {type === 'gmz' ? (
                  <span className={styles.symbol}>%</span>
                ) : (
                  <span className={styles.symbol}>连中</span>
                )}
              </div>
              <div className={styles.label}>{type === 'gmz' ? '命中率' : ''}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
