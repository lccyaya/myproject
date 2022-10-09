import { useIntl, FormattedMessage } from 'umi';
import styles from './index.less';
import MModal from '@/components/Modal';
import React, { useEffect, useState } from 'react';
import { uploadMessageToken } from '@/services/notification';
import { isServer } from '@/utils/env';
import { NOTIFICATION_DIALOG_LAST_APPEARED_AT } from '@/constants';
import moment from 'moment';
import { getMsgToken, importFirebaseMessaging } from '@/services/firebase';

async function requestNotificationPermission() {
  if (window.Notification?.permission !== 'granted') {
    try {
      const permission = await window.Notification?.requestPermission();
      if (permission !== 'granted') return false;
    } catch (e) {
      return false;
    }
  }
  return true;
}

function Notification(props: { visible: boolean; onCancel?: () => void; onOk?: () => void }) {
  const { visible } = props;
  const intl = useIntl();
  const [okLoading, setOkLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [today] = useState(moment().format('YYYY-MM-DD'));
  const [todayAppeared, setTodayAppeared] = useState(true);
  const denied = window?.Notification?.permission === 'denied';

  const handleOk = async () => {
    if (denied) {
      setTodayAppeared(true);
      return props.onCancel?.();
    }
    if (!(await requestNotificationPermission())) {
      setTodayAppeared(true);
      return props.onCancel?.();
    }
    setOkLoading(true);
    const token = await getMsgToken();
    if (!token) {
      setOkLoading(false);
      setTodayAppeared(true);
      return props.onCancel?.();
    }
    await uploadMessageToken(token);
    setOkLoading(false);
    setTodayAppeared(true);
    props.onOk?.();
    return undefined;
  };

  useEffect(() => {
    if (show && !todayAppeared) {
      localStorage.setItem(NOTIFICATION_DIALOG_LAST_APPEARED_AT, today);
    }
  }, [show]);

  useEffect(() => {
    if (!visible) {
      setShow(false);
      return;
    }

    setTodayAppeared(localStorage.getItem(NOTIFICATION_DIALOG_LAST_APPEARED_AT) === today);

    if (window.Notification && window.Notification.permission !== 'granted') {
      setShow(true);
      return;
    }
    importFirebaseMessaging().then((messaging) => {
      messaging
        ?.isSupported()
        .then((ok) => {
          if (ok) {
            // 已经授予通知权限并且支持当前浏览器，直接获取推送 token
            handleOk();
          }
        })
        .catch((err) => console.error(err));
    });
  }, [visible]);
  if (isServer || todayAppeared) return null;
  return (
    <MModal
      title={intl.formatMessage({ id: !denied ? 'key_turn_on_push' : 'key_remind' })}
      // 取消也弹出授权弹窗
      onCancel={handleOk}
      onConfirm={handleOk}
      visible={show}
      hideCancel={denied}
      okLoading={okLoading}
    >
      <div className={styles.tip}>
        <FormattedMessage id={!denied ? 'key_subscribe_notice' : 'key_open_push_browser'} />
      </div>
    </MModal>
  );
}

export default React.memo(Notification);
