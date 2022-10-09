import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
// import api, { APIFilter } from '@/api';
import { useCountDown } from 'ahooks';
import styles from './index.less';
import cls from 'classnames';
import * as certificationService from '@/services/certification';
import { message } from 'antd';
import { checkPhone, toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';

// let time = 60;
const SendMsg = ({ phone, onSuccess = () => {}, scene }) => {
  const intl = useIntl();
  const [targetDate, setTargetDate] = useState();
  const [hasSend, setHasSend] = useState(false);
  const [countdown] = useCountDown({
    targetDate,
    onEnd: () => {},
  });
  const disabled = countdown !== 0 || !checkPhone(phone);
  const sendCode = async (params) => {
    const result = await certificationService.getCaptchaCode(params);
    if (result.success) {
      onSuccess();
    } else {
      setTargetDate(undefined);
      message.error(result.message || 'Verification code send failed!');
    }
  };
  const seconds = Math.round(countdown / 1000);
  return (
    <div
      className={cls(styles.send_msg, disabled ? styles.disabled : {})}
      onClick={() => {
        if (disabled) {
          return;
        }
        setHasSend(true);
        setTargetDate(Date.now() + 60000);
        sendCode({
          account: phone,
          channel: 'phone',
          scene,
        });
      }}
    >
      {countdown === 0
        ? hasSend
          ? intl.formatMessage({
              id: 'key_resend_code',
            })
          : intl.formatMessage({ id: 'key_send_code' })
        : intl.formatMessage({ id: 'key_resend_code_in' }, { p: seconds })}
    </div>
  );
};

export default SendMsg;
