import { Button, message } from 'antd';
import Iconfont from '@/components/IconFont';
import styles from './pc.module.less';
import BaseModal from '@/components/BaseModal/pc';
import React, { useState, useEffect } from 'react';
import { Checkbox } from 'antd-mobile';
import Coupon from '@/components/Coupon/pc';
import { getRecommendCoupon, buyScheme } from '@/services/expert';
import { connect, history, useDispatch } from 'umi';
import EventEmitter from '@/utils/event';
import Decimal from 'decimal.js-light';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { handleReport } from '@/utils/report';

const Pay = function ({ detail = {}, id, currentUser, onSuccess = () => {}, eventTag = '' }) {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [useCoupon, setUseCoupon] = useState(true);
  const [autoWatch, setAutoWatch] = useState(true);
  const [couponList, setCouponList] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState({});
  const [tepSelectedCoupon, setTepSelectedCoupon] = useState({});
  const [usableCoupons, setUsableCoupons] = useState([]);
  const fetchData = async () => {
    const resp = await getRecommendCoupon({
      scheme_id: id,
    });
    if (resp.success) {
      // const list = [
      //   {
      //     ID: 41,
      //     CreatedAt: '2022-07-15T08:45:46.998108Z',
      //     UpdatedAt: '2022-07-15T08:45:46.998108Z',
      //     value: 10,
      //     threshold: 38,
      //     user_id: 2313,
      //     start_time: 1657874705,
      //     end_time: 1658419200,
      //     status: 1,
      //     used: 1,
      //     used_time: 0,
      //     title: '新人大礼包',
      //     remark: '',
      //     threshold_title: '满 38 可用',
      //     usable: false,
      //   },
      //   {
      //     ID: 38,
      //     CreatedAt: '2022-07-15T08:45:46.998108Z',
      //     UpdatedAt: '2022-07-15T08:45:46.998108Z',
      //     value: 18,
      //     threshold: 0,
      //     user_id: 2313,
      //     start_time: 1657874705,
      //     end_time: 1658419200,
      //     status: 1,
      //     used: 1,
      //     used_time: 0,
      //     title: '新人大礼包',
      //     remark: '',
      //     threshold_title: '支付直减',
      //     usable: false,
      //   },
      //   {
      //     ID: 40,
      //     CreatedAt: '2022-07-15T08:45:46.998108Z',
      //     UpdatedAt: '2022-07-15T08:45:46.998108Z',
      //     value: 25,
      //     threshold: 88,
      //     user_id: 2313,
      //     start_time: 1657874705,
      //     end_time: 1658419200,
      //     status: 1,
      //     used: 1,
      //     used_time: 0,
      //     title: '新人大礼包',
      //     remark: '',
      //     threshold_title: '满 88 可用',
      //     usable: false,
      //   },
      //   {
      //     ID: 39,
      //     CreatedAt: '2022-07-15T08:45:46.998108Z',
      //     UpdatedAt: '2022-07-15T08:45:46.998108Z',
      //     value: 52,
      //     threshold: 58,
      //     user_id: 2313,
      //     start_time: 1657874705,
      //     end_time: 1658419200,
      //     status: 1,
      //     used: 1,
      //     used_time: 0,
      //     title: '新人大礼包',
      //     remark: '',
      //     threshold_title: '满 58 可用',
      //     usable: false,
      //   },
      // ];
      const list = resp.data.list || [];
      setCouponList(list);
      if (list.length) {
        const useCouponList = list.filter((item) => {
          return item.usable;
        });
        if (useCouponList.length) {
          setSelectedCoupon(useCouponList[0]);
          setTepSelectedCoupon(useCouponList[0]);
        }

        setUsableCoupons(useCouponList);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const payAmount = new Decimal(detail.gold_coin || 0).minus(selectedCoupon.value || 0).toNumber();

  const onSubmit = async () => {
    if (currentUser.coin < payAmount) {
      message.error('金币余额不足');
      setTimeout(() => {
        const lang = toShortLangCode(locale.getLocale());
        history.push(`/${lang}/account/recharge`);
      }, 2000);
      return;
    }
    setLoading(true);
    const resp = await buyScheme({
      scheme_id: +id,
      coupon_id: selectedCoupon.ID,
      match_subscribe: autoWatch,
    });
    setLoading(false);

    if (resp.success) {
      message.success('购买成功');
      setPopupVisible(false);
      onSuccess();
      dispatch({
        type: 'user/fetchCurrent',
      });
    } else {
      message.error(resp.message);
    }
  };

  return (
    <div className={styles.pay_wrap}>
      <div className={styles.pay_content}>
        <div className={styles.pay_info}>
          <div className={styles.left_box}>
            <div className={styles.pay_coin}>
              {useCoupon && selectedCoupon.ID ? (
                <>
                  需支付：<span>{payAmount} 金币</span>
                  <span className={styles.del}>{detail.gold_coin} 金币</span>
                </>
              ) : (
                <>
                  需支付：<span>{detail.gold_coin} 金币</span>
                </>
              )}
            </div>
            {couponList.length > 0 ? (
              <div
                className={styles.coupon_info}
                onClick={() => {
                  setPopupVisible(true);
                  handleReport({
                    action: 'coupon',
                  });
                }}
              >
                {usableCoupons.length === 0 ? (
                  <span className={styles.used_status}>暂无可用优惠券</span>
                ) : useCoupon ? (
                  <span className={styles.used_status}>
                    使用卡券已优惠{selectedCoupon.value}金币
                  </span>
                ) : (
                  <span className={styles.used_status}>不使用优惠券</span>
                )}
                <Iconfont type="icon-jiantouyou" className={styles.icon} />
              </div>
            ) : null}
          </div>
          <Button
            type="primary"
            onClick={() => {
              handleReport({
                action: 'pay',
                tag: eventTag,
              });
              if (!currentUser) {
                EventEmitter.emit('login-modal', true);
                return;
              }
              setVisible(true);
            }}
          >
            去支付
          </Button>
        </div>
      </div>
      <BaseModal
        visible={visible}
        closable={false}
        width={310}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <div className={styles.modal_content}>
          <div className={styles.title}>
            确认支付
            <span>
              {useCoupon && selectedCoupon.ID ? payAmount : detail.gold_coin}
              金币
            </span>
            购买该方案？
          </div>
          <div className={styles.desc}>
            金币余额：<span>{currentUser?.coin || 0}</span>
          </div>
          <div className={styles.checkbox_wrap}>
            <Checkbox
              checked={autoWatch}
              onChange={(val) => {
                if (!val) {
                  handleReport({
                    action: 'cancel_follow',
                  });
                }
                setAutoWatch(val);
              }}
              style={{
                '--icon-size': '18px',
                '--font-size': '14px',
              }}
            >
              自动关注本场比赛
            </Checkbox>
          </div>
          <div className={styles.btns}>
            <Button
              onClick={() => {
                setVisible(false);
                handleReport({
                  action: 'cancel_pay',
                });
              }}
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={() => {
                onSubmit();
                handleReport({
                  action: 'confirm_pay',
                  tag: eventTag,
                });
              }}
              loading={loading}
            >
              确认支付
            </Button>
          </div>
        </div>
      </BaseModal>
      <BaseModal
        title="选择卡券"
        visible={popupVisible}
        width={450}
        destroyOnClose={true}
        onCancel={() => {
          setPopupVisible(false);
          setSelectedCoupon(selectedCoupon);
          setTepSelectedCoupon(selectedCoupon);
          setChecked(!useCoupon);
        }}
      >
        <div className={styles.popup_content}>
          <Coupon
            list={couponList}
            selectedCoupon={tepSelectedCoupon}
            canCheck
            onChange={(item) => {
              setTepSelectedCoupon(item);
              setChecked(false);
            }}
          />
          {usableCoupons.length ? (
            <>
              <div className={styles.checkbox_wrap}>
                <Checkbox
                  checked={checked}
                  style={{
                    '--icon-size': '18px',
                    '--font-size': '14px',
                  }}
                  onChange={(val) => {
                    setChecked(val);
                    if (val) {
                      setTepSelectedCoupon({});
                    }
                  }}
                >
                  不使用优惠券
                </Checkbox>
              </div>
              <Button
                type="primary"
                onClick={() => {
                  if (checked) {
                    setSelectedCoupon({});
                  } else {
                    setSelectedCoupon(tepSelectedCoupon);
                  }
                  setUseCoupon(!checked);
                  setPopupVisible(false);
                }}
              >
                完成
              </Button>
            </>
          ) : null}
        </div>
      </BaseModal>
    </div>
  );
};
export default connect(({ user }) => ({ currentUser: user.currentUser }))(Pay);
