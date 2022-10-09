import styles from './index.less';
import Empty from '@/components/Empty';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { history } from 'umi';
import Avatar from '@/components/avatar';
import { handleReport } from '@/utils/report';

export default function WatchExpert({ list = [] }) {
  return (
    <div className={styles.panel}>
      {list.length > 0 ? (
        list.map((item) => {
          return (
            <div
              className={styles.item}
              key={item.expert_id}
              onClick={() => {
                handleReport({
                  action: 'expert_enter',
                  tag: 'follow_list',
                });
                const lang = toShortLangCode(locale.getLocale());
                history.push(`/${lang}/expert-detail?id=${item.expert_id}`);
              }}
            >
              <Avatar src={item.avatar} className={styles.avatar} />
              <div className={styles.content}>
                <div className={styles.nickname}>{item.nickname}</div>
                <div className={styles.desc}>{item.introduce}</div>
              </div>
            </div>
          );
        })
      ) : (
        <Empty />
      )}
    </div>
  );
}
