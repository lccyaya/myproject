import styles from './mobile.module.less';
import Watch from '@/components/Watch/mobile';
import Empty from '@/components/Empty';
import cls from 'classnames';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { history } from 'umi';
import Avatar from '@/components/avatar';
import { handleReport } from '@/utils/report';

export default function ExpertList({ type, list = [], onSuccess = () => {} }) {
  return (
    <div className={styles.expert_list}>
      {type === 'watch' && list.length === 0 ? (
        <div className={styles.empty_wrap}>
          <Empty message="暂无关注的专家" />
        </div>
      ) : (
        list.map((item, index) => {
          const { ten_hit, max_hit } = item;
          const num = type === 'gmz' ? ten_hit : max_hit;
          return type === 'watch' ? (
            <div
              className={cls(styles.item, styles.watch_item)}
              key={item.expert_id}
              onClick={() => {
                handleReport({
                  action: 'expert_enter',
                  tag: 'follow',
                });
                const lang = toShortLangCode(locale.getLocale());
                history.push(`/${lang}/expert-detail?id=${item.expert_id}`);
              }}
            >
              <Avatar src={item.avatar} size={38} className={styles.avatar} />
              <div className={cls(styles.name_wrap, styles.watch_name_wrap)}>
                <div className={styles.nickname}>{item.nickname}</div>
                <div className={styles.info}>
                  <span>{item.fans_num}粉丝</span>
                  <span>{item.scheme_num}方案</span>
                </div>
              </div>
            </div>
          ) : (
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
              <div className={styles.rank_num}>{index + 1}</div>
              <Avatar src={item.avatar} size={38} className={styles.avatar} />
              <div className={styles.name_wrap}>
                <div className={styles.nickname_wrap}>
                  <span className={styles.nickname}>{item.nickname}</span>
                  {item.sale_num ? <span className={styles.sale}>在售{item.sale_num}</span> : null}
                </div>
                {type === 'glz' ? null : (
                  <div className={styles.info}>
                    擅长{' '}
                    {item.skilled_competitions?.length > 0 ? (
                      item.skilled_competitions.map((competition, i) => (
                        <span className={styles.competition}>{competition}</span>
                      ))
                    ) : (
                      <span className={styles.competition}>无</span>
                    )}
                  </div>
                  // <div className={styles.info}>
                  //   场次 {item.win_num + item.lose_num} 胜负{' '}
                  //   <span className={styles.win_num}>{item.win_num}</span>/{item.lose_num}
                  // </div>
                )}
              </div>
              <div className={styles.win_rate}>
                <span className={styles.win_rate_num}>{num}</span>
                {type === 'gmz' ? <span className={styles.symbol}>%</span> : null}
              </div>
              <Watch
                followed={item.followed}
                id={item.expert_id}
                onSuccess={onSuccess}
                type={type}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
