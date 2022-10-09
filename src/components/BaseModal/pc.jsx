import { Modal } from 'antd';
import Iconfont from '@/components/IconFont';
import styles from './pc.module.less';
import cls from 'classnames';
export default function BaseModal({
  title = '',
  visible,
  onCancel = () => {},
  destroyOnClose = false,
  closable = true,
  children = null,
  width = 520,
  hideBg = false,
}) {
  return (
    <Modal
      title={title}
      visible={visible}
      footer={null}
      destroyOnClose={destroyOnClose}
      closable={closable}
      onCancel={onCancel}
      wrapClassName={cls(styles.modal, hideBg ? styles.hide_bg : null)}
      centered
      width={width}
      closeIcon={<Iconfont type="icon-guanbi" size={32} />}
    >
      {children}
    </Modal>
  );
}
