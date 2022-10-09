import styles from './index.less';
import IconFont from '@/components/IconFont';
import cls from 'classnames';
import React, { MouseEventHandler, useState } from 'react';
import lodash from "lodash";

interface Item {
  key: any;
  title: string;
  node: React.ReactNode;
}

interface IProps {
  list?: Array<Item>,
  activeKey: any,
  onChange?: Function,
  type?: string,
  sticky?: boolean,
  top?: number,
  className?: string,
  theme?: 'light' | 'dark',
}


const SimpleTabs: React.FC<IProps> = ({
  list,
  activeKey,
  onChange = () => {},
  type,
  sticky = false,
  top = 0,
  className = '',
  theme = 'light',
}) => {
  const curKey = activeKey || lodash.head(list)?.key;
  return (
    <div className={cls(styles.tabs, className, styles[theme])}>
      <div
        className={cls(styles.tabs_header, type === 'card' ? styles.tabs_header_card : null)}
        style={sticky ? { position: 'sticky', top: top + 'px', background: '#fff' } : {}}
      >
        <div className={styles.tab_list}>
          {list?.map((item) => {
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
      </div>
      <div className={styles.tabs_body}>
        {list?.map((item) => {
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

export default SimpleTabs