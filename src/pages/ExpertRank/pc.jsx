import BaseTabs from '@/components/BaseTabs';
import styles from './pc.module.less';
import { RANKING_TYPE } from '@/constants/index';
import Glz from './components/glz/pc';
import Gmz from './components/gmz/pc';
import Watch from './components/watch/pc';
import React, { useState } from 'react';
import { history, connect } from 'umi';
import EventEmitter from '@/utils/event';
import { handleReport } from '@/utils/report';

const ExpertRank = ({ currentUser = {} }) => {
  const { query } = history.location;

  const [curKey, setCurKey] = useState(() => {
    return query.tab || RANKING_TYPE.GLZ;
  });

  const handleTabClick = (key) => {
    if (key === '2' && !currentUser) {
      EventEmitter.emit('login-modal', true);
    } else {
      setCurKey(key);
      handleReport({
        action: ['continuous', 'hit', 'follow_list'][key],
      });
    }
  };
  return (
    <div className={styles.main}>
      <BaseTabs
        activeKey={curKey}
        showExtra={false}
        onChange={handleTabClick}
        destroyInactiveTabPane
        list={[
          {
            key: RANKING_TYPE.GLZ,
            title: '高连中',
            node: <Glz />,
          },
          {
            key: RANKING_TYPE.GMZ,
            title: '高命中',
            node: <Gmz />,
          },
          {
            key: RANKING_TYPE.WATCH,
            title: '关注',
            node: <Watch />,
          },
        ]}
      />
    </div>
  );
};

export default connect(({ user }) => ({ currentUser: user.currentUser }))(ExpertRank);
