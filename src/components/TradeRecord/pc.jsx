import moment from 'moment';
import styles from './pc.module.less';
import Empty from '@/components/Empty';
import { ORDER_TYPE } from '@/constants/index';
import cls from 'classnames';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { history } from 'umi';
const Order = ({ list = [] }) => {
  // const list = [
  //   { type: 2, coin: -63, time: 1658114131, scheme_id: 664, title: '购买方案' },
  //   { type: 2, coin: -36, time: 1658113306, scheme_id: 663, title: '购买方案' },
  // ];
  return (
    <div className={styles.order}>
      {list.length > 0 ? (
        list.map((item) => {
          return (
            <div
              className={styles.item}
              key={item.id}
              style={item.scheme_id ? { cursor: 'pointer' } : {}}
              onClick={() => {
                if (item.scheme_id) {
                  const lang = toShortLangCode(locale.getLocale());
                  history.push(`/${lang}/scheme?id=${item.scheme_id}&match_id=${item.match_id}`);
                }
              }}
            >
              <div className={cls(styles.type, styles[`type_${item.type}`])}>
                {ORDER_TYPE[item.type]}
              </div>
              <div className={styles.info}>
                <div className={styles.info_content}>
                  <div className={styles.title}>{item.title}</div>
                  <div className={styles.updated_at}>
                    {item.time && moment(item.time * 1000).format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                </div>
                {item.coin ? (
                  <div className={styles.gold_coin}>
                    {item.coin > 0 ? `+${item.coin}` : item.coin}金币
                  </div>
                ) : null}
              </div>
            </div>
          );
        })
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default Order;
