import React, { useState, useRef, useEffect } from 'react';
import styles from './index.less';
import cls from 'classnames';

const CodeBox = ({ onChange = () => {}, error = false }) => {
  const [verifyCode, setVerifyCode] = useState('');
  const [focus, setFocus] = useState(false);
  const ref = useRef();
  useEffect(() => {
    onChange(verifyCode.split(''));
  }, [verifyCode]);
  useEffect(() => {
    const timer = setTimeout(() => {
      ref?.current?.focus();
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  const verifyCodeArr = verifyCode.split('')
  const len = verifyCodeArr.length
  return (
    <div>
      <div className={styles.input_box}>
        <div
          className={styles.input_content}
          onClick={() => {
            ref.current.focus();
          }}
        >
          <input
            maxLength={4}
            type="number"
            ref={ref}
            value={verifyCode}
            onChange={(e) => {
              setVerifyCode(e.target.value);
            }}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
          <div className={cls(styles.number, error ? styles.error : {}, verifyCodeArr[0] ? styles.active : null )}>
            <div>{verifyCodeArr[0] || ''}</div>
            {len === 0 && focus ? (
              <div className={styles.cursor_focus} />
            ) : null}
          </div>
          <div className={cls(styles.number, error ? styles.error : {}, verifyCodeArr[1] ? styles.active : null)}>
            <div>{verifyCodeArr[1] || ''}</div>
            {len === 1 && focus ? (
              <div className={styles.cursor_focus} />
            ) : null}
          </div>
          <div className={cls(styles.number, error ? styles.error : {}, verifyCodeArr[2] ? styles.active : null)}>
            <div>{verifyCodeArr[2] || ''}</div>
            {len === 2 && focus ? (
              <div className={styles.cursor_focus} />
            ) : null}
          </div>
          <div className={cls(styles.number, error ? styles.error : {}, verifyCodeArr[3] ? styles.active : null)}>
            <div>{verifyCodeArr[3] || ''}</div>
            {len === 3 && focus ? (
              <div className={styles.cursor_focus} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CodeBox;
