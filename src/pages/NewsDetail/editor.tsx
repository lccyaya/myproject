import { connect, FormattedMessage } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { UserInfoType } from '@/services/user';
import type { MouseEventHandler} from 'react';
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import LoginModal from '@/components/MatchCard/Login';
import { Button } from 'antd';

function Editor(props: {
  currentUser?: UserInfoType | null;
  placeholder?: string;
  onSend?: (content: string) => void;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const [loginVisible, setLoginVisible] = useState(false);
  const [value, setValue] = useState('');
  const handleFocus = () => {
    if (!props.currentUser) {
      ref.current?.blur();
      setLoginVisible(true);
    }
    props.onFocus?.();
  };

  const handleSend: MouseEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!value) return;
    props.onSend?.(value);
  };

  const handleChange = (v: string) => {
    setValue(v);
    props.onChange(v);
  };

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return <div className={styles.commentEditor}>
    <LoginModal
      visible={loginVisible}
      onLogin={() => {
        setLoginVisible(false);
      }}
      onCancel={() => {
        setLoginVisible(false);
      }}
    />
    <div className={styles.textareaWrapper} onClick={() => ref.current?.focus()}>
      <textarea
        value={value}
        placeholder={props.placeholder}
        rows={2}
        className={styles.textarea}
        onFocus={handleFocus}
        ref={ref}
        onChange={e => handleChange(e.target.value)}
      />
      <Button
        disabled={!value}
        className={styles.submit}
        htmlType="submit"
        type="primary"
        onClick={handleSend}
      >
        <FormattedMessage id='key_send' />
      </Button>
    </div>
  </div>;
}

export default connect(({ user }: ConnectState) => ({ currentUser: user.currentUser }))(Editor);
