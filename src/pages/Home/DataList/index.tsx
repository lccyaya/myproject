import React, { useState, useEffect } from 'react';
import { message, Spin, Tabs } from 'antd';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import * as competitionService from '@/services/competition';
import Ranking from './ranking';
import styles from './index.less';
import type * as matchService from '@/services/match';

const { TabPane } = Tabs;

type IProps = {
  isPhone?: boolean;
};

const Info: React.FC<IProps> = (props: IProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<competitionService.CompetitionItemType[]>([]);
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<string>('');

  const init = async () => {
    // setLoading(true);
    const result = await competitionService.category();
    setLoading(false);
    if (result.success) {
      const { categories } = result.data;
      // 需要过滤出来
      // const categoriesAfterFilter = categories.filter(i => i.name.toLowerCase() === 'hot');
      const categoriesAfterFilter = categories;
      if (categoriesAfterFilter.length > 0) {
        const competitionsAfterFilter = (categoriesAfterFilter?.[0].competitions || [])?.filter(
          (i) => !i.name.toLowerCase().includes('cup'),
        );
        setData(competitionsAfterFilter);
        if (competitionsAfterFilter.length > 0) {
          setDefaultSelectedKeys(`${competitionsAfterFilter[0].id}`);
        }
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
        {!loading && data.length > 0 && (
          <>
            <Tabs defaultActiveKey={defaultSelectedKeys}>
              {data.map((i, j) => (
                <TabPane tab={i.name} key={i.id}>
                  <div className={styles.content}>
                    <Ranking competitionId={i.id} loading={j !== 0} />
                  </div>
                </TabPane>
              ))}
            </Tabs>
          </>
        )}
      </div>
    </Spin>
  );
};
// export default Info;
export default connect(({ divice }: ConnectState) => ({
  isPhone: divice.isPhone,
}))(Info);
