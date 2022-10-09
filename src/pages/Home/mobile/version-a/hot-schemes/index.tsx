import styles from './index.less';
import { useHistory, FormattedMessage } from 'umi';
import Hot from '@/pages/Expert/components/hot/mobile';
import IconFont from '@/components/IconFont';
import { Space, Tabs } from 'antd-mobile';
import { useState } from 'react';
import { Dropdown, Menu, Select } from 'antd';

const { Option } = Select;

export default function HotSchemes() {
  const history = useHistory();
  const [info, setInfo] = useState({ play: '0', tab: 0 });

  const items = [
    { label: '全部', key: 0 }, // 菜单项务必填写 key
    { label: '让球', key: 1 },
    { label: '胜平负', key: 2 },
    { label: '胜平过关', key: 3 },
  ];

  const onSelectTab = (key: string) => {
    const tab = +key;
    setInfo({ play: info.play, tab });
  };
  const onSelectPlay = (key: string) => {
    setInfo({ play: key, tab: info.tab });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.left}>精选攻略</div>
        {/* <div className={styles.right} onClick={toRank}>
          更多
          <IconFont
            className={styles.arrow_icon}
            type="icon-jiantouyou"
            color="#848494"
            size={10}
          ></IconFont>
        </div> */}
      </div>
      <div className={styles.button_box}>
        <div className={styles.tabs}>
          {/* <SchemeTabs /> */}
          <Tabs
            activeLineMode="fixed"
            style={{
              '--fixed-active-line-width': '12px',
              '--active-line-height': '3px',
              '--active-line-border-radius': '2px',
              '--active-title-color': '#000028',
              '--content-padding': '4px',
              '--title-font-size': '14px',
              '--adm-color-text': '#848494',
            }}
            onChange={onSelectTab}
          >
            <Tabs.Tab title="连红" key={0}></Tabs.Tab>
            <Tabs.Tab title="命中" key={1}></Tabs.Tab>
            <Tabs.Tab title="免费" key={2}></Tabs.Tab>
          </Tabs>
        </div>
        <Select
          defaultValue={info.play}
          style={{ width: 100 }}
          bordered={false}
          onChange={onSelectPlay}
        >
          <Option value="0">全部</Option>
          <Option value="1">让球</Option>
          <Option value="2">胜平负</Option>
          <Option value="3">胜平过关</Option>
        </Select>
      </div>
      <div className={styles.body}>
        <Hot info={info} />
      </div>
    </div>
  );
}
