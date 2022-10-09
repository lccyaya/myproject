import BaseTabs from '@/components/BaseTabs';
import styles from './mobile.module.less';
import { Tabs } from 'antd';
import Item from 'antd/lib/list/Item';
import React, { useState } from 'react';
const TabPane = Tabs.TabPane;
import { RANKING_TYPE } from '@/constants/index';
import Glz from './components/glz/mobile';
import Gmz from './components/gmz/mobile';
import Watch from './components/watch/mobile';
import { history, connect } from 'umi';
import EventEmitter from '@/utils/event';
import { handleReport } from '@/utils/report';
import FBTabs from '@/components/FBTabs';
import RankList from './RankList';
import rankBg from '@/assets/expert/rank_header_bg.png';
import classnames from 'classnames';

const ExpertRank = ({ currentUser = {} }) => {
  const { query } = history.location;
  const [curKey, setCurKey] = useState(() => {
    return query.tab || '0';
  });
  const items = [
    {
      key: '0',
      title: '排行榜',
    },
    {
      key: '1',
      title: '关注',
    },
  ];
  const navs = [
    {
      key: RANKING_TYPE.GLZ,
      title: '高连红',
    },
    {
      key: RANKING_TYPE.GMZ,
      title: '近期命中',
    },
    {
      key: RANKING_TYPE.WATCH,
      title: '关注',
    },
  ];
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
      {/* <Tabs
        activeKey={curKey}
        className={styles.navTab}
        onTabClick={handleTabClick}
        style={{ position: 'sticky', top: '0px' }}
      >
        {navs.map((n) => (
          <TabPane tab={n.title} key={n.key} />
        ))}
      </Tabs> */}
      <div className={classnames(styles.rank_bg, curKey === '1' ? styles.hidden : '')}>
        <img src={rankBg} alt="" />
      </div>
      <div className={styles.list_box}>
        <FBTabs
          items={items}
          activeKey={curKey}
          onChange={setCurKey}
          selectStyle={{ fontSize: '20px', color: curKey === '0' ? '#FFFFFF' : '#FA5900' }}
          normalStyle={{color: curKey === '0' ? '#EEEEFF' : '#848494'}}
        />
        <div style={{flex: 1}}>
          {curKey === '0' ? <RankList /> : null}
          {curKey === '1' ? <Watch /> : null}
        </div>
      </div>
    </div>
  );
};

export default connect(({ user }) => ({ currentUser: user.currentUser }))(ExpertRank);
