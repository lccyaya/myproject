import ScrollView from 'react-custom-scrollbars';
import styles from './pc.module.less';
import classnames from 'classnames';
import { Menu, message, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
const { SubMenu } = Menu;
import Feature from './feature/pc';
import { competitionList } from '@/services/expert';
import Empty from '@/components/Empty';

export default function Recommend() {
  const [selectedKeys, setSelectedKeys] = useState(['']);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const menu = (
    <Menu
      className={styles.menu}
      mode="inline"
      theme="light"
      selectedKeys={selectedKeys}
      onSelect={(e) => {
        setSelectedKeys(e.key);
        setSelectedCompetitionId(e.key);
      }}
    >
      {data.map((item) => {
        return (
          <Menu.Item
            key={item.competition_id}
            onClick={() => {
              if (Number(selectedCompetitionId) === item.competition_id) return;
            }}
          >
            {item.competition_name}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const init = async () => {
    setLoading(true);
    const result = await competitionList();
    setLoading(false);
    if (result.success) {
      const categories = result.data;
      if (categories && categories.length > 0) {
        setData([{ competition_id: '', competition_name: '全部' }, ...categories]);
      }
    } else {
      message.error(result.message);
    }
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <Spin className={styles.spin} spinning={loading}>
      <div className={styles.main}>
        {!loading ? (
          data.length > 0 ? (
            <>
              <div className={classnames(styles.left)}>
                <ScrollView autoHide>{menu}</ScrollView>
              </div>
              <div className={styles.right}>
                <ScrollView autoHide>
                  <Feature competitionId={selectedCompetitionId} />
                </ScrollView>
              </div>
            </>
          ) : (
            <Empty />
          )
        ) : null}
      </div>
    </Spin>
  );
}
