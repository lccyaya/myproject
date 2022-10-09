import styles from './index.less';
import IconFont from '@/components/IconFont';
import Watch from '@/components/Watch/pc';
import Empty from '@/components/Empty';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { history } from 'umi';
import Avatar from '@/components/avatar';
import { handleReport } from '@/utils/report';

export default function ExpertList({ type, list, onSuccess = () => {} }) {
  return (
    <div className={styles.expert_list}>
      {type === 'watch' && list.length === 0 ? (
        <div className={styles.empty_wrap}>
          <Empty message="暂无关注的专家" />
        </div>
      ) : (
        list.map((item) => {
          const { hit_rate, max_hit } = item;
          const num = type === 'gmz' ? hit_rate : max_hit;
          return (
            <div
              className={styles.item}
              key={item.expert_id}
              onClick={() => {
                handleReport({
                  action: 'expert_enter',
                  tag: type === 'gmz' ? 'hit' : type === 'glz' ? 'continuous' : 'follow',
                });
                const lang = toShortLangCode(locale.getLocale());
                history.push(`/${lang}/expert-detail?id=${item.expert_id}`);
              }}
            >
              <div className={styles.avatar}>
                <Avatar src={item.avatar} size={56} />
                {item.sale_num ? <span className={styles.sale}>在售{item.sale_num}</span> : null}
              </div>
              <div className={styles.nickname}>{item.nickname}</div>
              <div className={styles.desc}>{item.introduce}</div>
              <div className={styles.scheme_wrap}>
                {type === 'watch' ? (
                  <div className={styles.label_value}>
                    <span className={styles.label}>粉丝</span>
                    <span className={styles.value}>{item.fans_num}</span>
                  </div>
                ) : (
                  <div className={styles.win_rate}>
                    胜负
                    <span className={styles.win_num}>{item.win_num}</span>/
                    <span className={styles.lose_num}>{item.lose_num}</span>
                  </div>
                )}

                <div className={styles.scheme_num}>
                  {type === 'watch' ? item.scheme_num : item.win_num + item.lose_num} 个方案
                  <IconFont type="icon-jiantouyou" />
                </div>
              </div>
              {type === 'watch' ? (
                <div className={styles.watch_wrap}>
                  <Watch onSuccuss={onSuccess} followed id={item.expert_id} onSuccess={onSuccess} />
                </div>
              ) : (
                <div className={styles.footer}>
                  <div className={styles.label_value}>
                    <span className={styles.label}>{type === 'gmz' ? '命中率' : '连中'}</span>
                    <span className={styles.value}>
                      {num}
                      {type === 'gmz' ? <span className={styles.symbol}>%</span> : null}
                    </span>
                  </div>
                  <Watch
                    followed={item.followed}
                    id={item.expert_id}
                    onSuccess={onSuccess}
                    type={type}
                  />
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
