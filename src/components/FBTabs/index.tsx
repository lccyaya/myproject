import React from 'react';
import classnames from 'classnames';
import styles from './index.less';
import lodash from 'lodash';
import { Space } from 'antd-mobile';

interface Item {
  key: any;
  title: string;
}

type Props = {
  items: Item[];
  activeKey?: any;
  onChange?: Function;
  className?: string;
  selectStyle?: React.CSSProperties;
  normalStyle?: React.CSSProperties;
};

const FBTabs: React.FC<Props> = (props: Props) => {
  const { items, activeKey, onChange = () => {}, className = '', selectStyle, normalStyle } = props;
  const curKey = activeKey || lodash.head(items)?.key;
  return (
    <div className={classnames(styles.container, className)}>
      <Space justify='center' style={{width: '100%', '--gap': '22px'}}>
        {items?.map((item) => {
          return (
            <div
              className={classnames(styles.item, item.key === curKey ? styles.active : null)}
              key={item.key}
              onClick={() => {
                onChange(item.key);
              }}
              style={item.key === curKey ? selectStyle : normalStyle}
            >
              {item.title}
            </div>
          );
        })}
      </Space>
    </div>
  );
};

export default FBTabs;
