import styles from './mobile.module.less';
import cls from 'classnames';
import Iconfont from '@/components/IconFont';
import { Dropdown, Menu } from 'antd';
import react, { useState } from 'react';
import { useEffect } from 'react';
export default function BaseSelect({ data = [], activeKey, onChange = () => {} }) {
  const [visible, setVisible] = useState(false);

  const menu = (
    <Menu selectedKeys={[activeKey]}>
      {data.map((item) => {
        return (
          <Menu.Item
            onClick={(e) => {
              onChange(e.key);
              setVisible(false);
            }}
            key={item.competition_id}
          >
            {item.competition_name}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  return (
    <div className={styles.select_wrap} style={{ position: 'sticky', top: '0px' }}>
      <div className={styles.select_box}>
        {data.map((item) => {
          return (
            <div
              className={cls(
                styles.item,
                item.competition_id + '' === activeKey ? styles.active : null,
              )}
              key={item.competition_id}
              onClick={() => {
                onChange(item.competition_id + '');
              }}
            >
              {item.competition_name}
            </div>
          );
        })}
      </div>
      <Dropdown
        overlay={menu}
        placement="bottomRight"
        visible={visible}
        onVisibleChange={setVisible}
        overlayClassName={styles.overlayClassName}
        getPopupContainer={(trigger) => trigger.parentNode}
      >
        <div
          className={styles.expend}
          onClick={() => {
            setVisible(!visible);
          }}
        >
          <Iconfont type="icon-jiantouyou" className={styles.icon} size={14} />
        </div>
      </Dropdown>
    </div>
  );
}
