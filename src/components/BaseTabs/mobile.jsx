import styles from './mobile.module.less';
import IconFont from '@/components/IconFont';
import cls from 'classnames';
import React, { useState } from 'react';
export default function BaseTabs({
  list,
  activeKey,
  onChange = () => {},
  extra,
  type,
  onClick = () => {},
  sticky = false,
  top = 92,
  className = '',
  theme = 'light',
}) {
  const curKey = activeKey || list[0]?.key;
  return (
    <div className={cls(styles.tabs, className, styles[theme])}>
      <div
        className={cls(styles.tabs_header, type === 'card' ? styles.tabs_header_card : null)}
        style={sticky ? { position: 'sticky', top: top + 'px', background: '#fff' } : {}}
      >
        <div className={styles.tab_list}>
          {list.map((item) => {
            return (
              <div
                className={cls(
                  styles.item,
                  item.key === curKey ? styles.active : null,
                  type === 'card' ? styles.card : null,
                )}
                key={item.key}
                onClick={() => {
                  onChange(item.key);
                }}
              >
                {item.title}
              </div>
            );
          })}
        </div>
        {extra ? (
          extra
        ) : (
          <div className={styles.more} onClick={onClick}>
            查看更多
            <IconFont type="icon-jiantouyou" />
          </div>
        )}
      </div>
      <div className={styles.tabs_body}>
        {list.map((item) => {
          return (
            <div
              className={styles.panel}
              key={item.key}
              style={{ display: item.key === curKey ? 'block' : 'none' }}
            >
              {item.node}
            </div>
          );
        })}
      </div>
    </div>
  );
}
