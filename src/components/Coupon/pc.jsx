import styles from './pc.module.less';
import { Checkbox } from 'antd-mobile';
import cls from 'classnames';
import moment from 'moment';
import { useCallback } from 'react';
const Mobile = ({
  canCheck = false,
  list = [],
  type = '',
  selectedCoupon = {},
  onChange = () => {},
}) => {
  // const list = [
  //   {
  //     gold_coin: 18,
  //     valid_time: '1244444',
  //     name: '新人大礼包',
  //     id: 1,
  //     condition: '支付直减',
  //     checked: true,
  //   },
  // ];
  return (
    <div className={styles.coupon}>
      {list.map((item) => {
        return (
          <div
            className={cls(
              styles.item,
              type === 'expired' || type === 'used' || (canCheck && !item.usable)
                ? styles.disabled
                : null,
            )}
            key={item.id}
            onClick={() => {
              if (canCheck && !item.usable) return;
              onChange(item);
            }}
          >
            <div className={styles.coupon_bg}>
              <div className={styles.gold_coin}>
                <span className={styles.gold_coin_val}>{item.value}</span> 金币
              </div>
              <div className={styles.condition}>{item.threshold_title}</div>
            </div>
            <div className={styles.info}>
              <div className={styles.info_content}>
                <div className={styles.name}>{item.title}</div>
                {type === 'used' ? (
                  <div className={styles.valid_time}>
                    {item.used_time && moment(item.used_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
                    使用
                  </div>
                ) : (
                  <div className={styles.valid_time}>
                    {item.end_time && moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
                    到期
                  </div>
                )}
              </div>
              {canCheck ? item.ID === selectedCoupon.ID ? <Checkbox checked={true} /> : null : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Mobile;
