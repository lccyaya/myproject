import styles from './pc.module.less';
import GoldIcon from '@/assets/gold_icon.png';
import { Button, message } from 'antd';
import cls from 'classnames';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { history } from 'umi';
import BaseModal from '@/components/BaseModal/pc';
import React, { useState, useEffect, useRef } from 'react';
import { getCoinScheme, coinCharger, getDocPayStatus } from '@/services/expert';
import QRCode from 'qrcode.react';
import { queryCurrent } from '@/services/user';
import { useDispatch } from 'react-redux';
import { handleReport } from '@/utils/report';

const Recharge = ({ coin }) => {
  const [payChannels, setPayChannels] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [channel, setChannel] = useState('');
  const [schemeId, setSchemeId] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef();
  const dispatch = useDispatch();
  const fetchData = async () => {
    const resp = await getCoinScheme();
    if (resp.success) {
      const pay_channels = resp.data.pay_channels || [];
      const schemes = resp.data.schemes || [];
      if (pay_channels.length) {
        setChannel(pay_channels[0].channel);
      }
      if (schemes.length) {
        setSchemeId(schemes[0].ID);
      }
      setPayChannels(pay_channels);
      setSchemes(schemes);
    }
  };
  const getUserInfo = async () => {
    const userInfo = await queryCurrent();
    if (userInfo.success) {
      if (dispatch) {
        dispatch({
          type: 'user/saveCurrentUser',
          payload: {
            data: userInfo.data,
          },
        });
      }
    }
  };
  const getPayStatus = async (docId, lastTime) => {
    const resp = await getDocPayStatus({
      doc_id: docId,
    });
    if (resp.success) {
      if (resp.data.status === 2) {
        message.success('支付成功');
        setChannel(payChannels[0].channel);
        setSchemeId(schemes[0].ID);
        setVisible(false);
        getUserInfo();
        clearTimeout(timeoutRef.current);
      } else if (resp.data.status === 1) {
        if (lastTime - new Date().getTime() > 0) {
          timeoutRef.current = setTimeout(() => {
            getPayStatus(docId, lastTime);
          }, 2000);
        } else {
          clearTimeout(timeoutRef.current);
        }
      }
    }
  };
  const submit = async () => {
    setLoading(true);
    const resp = await coinCharger({
      coin_scheme_id: schemeId,
      channel: channel,
    });
    setLoading(false);
    if (resp.success) {
      if (resp.data.param) {
        if (channel === 1) {
          window.open(resp.data.param, '_blank');
        } else {
          setVisible(true);
          setQrCodeUrl(resp.data.param);

          setTimeout(() => {
            getPayStatus(resp.data.doc_id, new Date().getTime() + 5 * 60 * 1000);
          }, 2000);
        }
      }
    } else {
      message.error(resp.message);
    }
  };

  useEffect(() => {
    fetchData();
    handleReport({
      action: 'recharge_coin_display',
    });
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);
  const [visible, setVisible] = useState(false);
  return (
    <div className={styles.recharge}>
      <div className={cls(styles.section, styles.overview)}>
        <div className={styles.label}>我的金币</div>
        <div className={styles.content}>
          <div className={styles.total}>
            <div>
              <span className={styles.value}>{coin}</span>
              <span className={styles.tip}>（不可提现或退款）</span>
            </div>
            <div
              className={styles.record}
              onClick={() => {
                const lang = toShortLangCode(locale.getLocale());
                history.push(`/${lang}/account/recharge-record`);
                handleReport({
                  action: 'recharge_record',
                });
              }}
            >
              交易记录
            </div>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.label}>金币充值：</div>
        <div className={styles.content}>
          <div className={styles.select_box}>
            {schemes.map((item) => {
              return (
                <div
                  className={cls(styles.item, schemeId === item.ID ? styles.active : null)}
                  key={item.ID}
                  onClick={() => {
                    setSchemeId(item.ID);
                    handleReport({
                      action: item.coin,
                    });
                  }}
                >
                  <div className={styles.gold_icon}>
                    <img src={GoldIcon} alt="" />
                    <span className={styles.gold_coin_val}>{item.coin}</span>
                    {item.giving_coin ? (
                      <span className={styles.give_away}>+{item.giving_coin}</span>
                    ) : null}
                  </div>
                  <div className={styles.price}>{item.price}元</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.label}>支付方式：</div>
        <div className={styles.content}>
          <div className={styles.select_box}>
            {payChannels.map((item) => {
              return (
                <div
                  className={cls(
                    styles.item,
                    styles.item_row,
                    channel === item.channel ? styles.active : null,
                  )}
                  key={item.channel}
                  onClick={() => {
                    setChannel(item.channel);
                    handleReport({
                      action: item.channel === 1 ? 'alipay' : 'wechat',
                    });
                  }}
                >
                  {item.logo ? <img src={item.logo} alt="" className={styles.icon} /> : null}
                  {item.name}
                </div>
              );
            })}
          </div>
          <Button
            type="primary"
            loading={loading}
            className={styles.btn}
            onClick={() => {
              submit();
              handleReport({
                action: 'pay',
              });
            }}
          >
            去支付
          </Button>
          <div className={styles.agreement}>
            支付即代表您同意了
            <a href="/recharge-document.html" target="_blank">
              《34 体育用户充值协议》
            </a>
          </div>
        </div>
      </div>
      {/* <Privilege /> */}
      <BaseModal
        title="微信支付"
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        width={345}
      >
        <div className={styles.modal_content}>
          <div className={styles.sub_title}>请使用微信扫描下方二维码进行支付。</div>
          {/* <img src={qrCode} alt="" /> */}
          <div className={styles.qrcode_wrap}>
            <QRCode value={qrCodeUrl} size={180} />
          </div>
        </div>
      </BaseModal>
    </div>
  );
};
export default Recharge;
