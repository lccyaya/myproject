import { Tabs } from 'antd';
import IconFont from '@/components/IconFont';
import styles from './pc.module.less';
const TabPane = Tabs.TabPane;
export default function BaseTabs({
  list,
  activeKey,
  onChange,
  destroyInactiveTabPane = false,
  extra,
  showExtra = true,
  onClick = () => {},
}) {
  return (
    <div className={styles.tab_container}>
      <Tabs
        activeKey={activeKey}
        onChange={onChange}
        destroyInactiveTabPane={destroyInactiveTabPane}
        tabBarExtraContent={
          showExtra ? (
            extra ? (
              extra
            ) : (
              <div className={styles.more} onClick={onClick}>
                查看更多
                <IconFont type="icon-jiantouyou" />
              </div>
            )
          ) : null
        }
      >
        {list.map((item) => {
          return (
            <TabPane tab={item.title} key={item.key} className={styles.tab_pane}>
              <div className={styles.content}>{item.node}</div>
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
}
