import styles from './mobile.module.less';
import ShortExpertList from '@/components/ShortExpertList/mobile';
import BaseTabs from '@/components/BaseTabs/mobile';
import Title from '@/components/Title/mobile';
import { Menu, Dropdown } from 'antd';
import Iconfont from '@/components/IconFont';
import MatchListScheme from '@/components/MatchListScheme/mobile';
import { recommendMatches, getExpertRanking } from '@/services/expert';
import React, { useState, useEffect } from 'react';
import { RANKING_TYPE, SCHEME_TYPE } from '@/constants/index';
import { Spin, Affix } from 'antd';
import { history, connect } from 'umi';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import Hot from './components/hot/mobile';
import Match from './components/match/mobile';
import Watch from './components/watch/mobile';
import EventEmitter from '@/utils/event';
import { handleReport } from '@/utils/report';
import FootballImg from '@/assets/football_m_bg.png';
import cls from 'classnames';

const Expert = function ({ currentUser }) {
  const list = [
    {
      id: '0',
      name: '全部',
    },
    {
      id: '1',
      name: '让球',
    },
    {
      id: '2',
      name: '胜平负',
    },
    {
      id: '3',
      name: '胜负过关',
    },
    {
      id: '4',
      name: '上下单双',
    },
  ];
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [play, setPlay] = useState(list[0].id);
  const [rankType, setRankType] = useState(RANKING_TYPE.GLZ);
  const [playName, setPlayName] = useState(list[0].name);
  const [recommendMatchesList, setRecommendMatchesList] = useState([]);
  const [rankList, setRankList] = useState([]);
  const [curKey, setCurKey] = useState(SCHEME_TYPE.HOT);

  const fetchRecommendMatches = async () => {
    const resp = await recommendMatches({
      page: 1,
      size: 2,
    });
    if (resp.success) {
      const list = resp.data.list || [];
      setRecommendMatchesList(list);
    }
  };
  const fetchRankList = async ({ rankType }) => {
    setLoading(true);
    const resp = await getExpertRanking({
      page: 1,
      size: 3,
      tab: rankType,
    });
    setLoading(false);
    if (resp.success) {
      const list = resp.data.list || [];
      setRankList(resp.data.list);
    }
  };
  useEffect(() => {
    fetchRecommendMatches();
  }, []);
  useEffect(() => {
    fetchRankList({ rankType });
  }, [rankType]);
  const menu = (
    <Menu selectedKeys={[play]}>
      {list.map((item) => {
        return (
          <Menu.Item
            onClick={(e) => {
              setPlay(e.key);
              setPlayName(item.name);
              setVisible(false);
              handleReport({
                action: ['all', 'rq', 'spf', 'sfgg', 'sxds'][e.key],
              });
            }}
            key={+item.id}
          >
            {item.name}
          </Menu.Item>
        );
      })}
    </Menu>
  );
  const handleTabClick = (key) => {
    if (key === '2' && !currentUser) {
      EventEmitter.emit('login-modal', true);
    } else {
      setCurKey(key);
      handleReport({
        action: ['today', 'time', 'follow'][key],
      });
    }
  };
  return (
    <div className={styles.main}>
      <div className={cls(styles.export_wrap, styles.section)}>
        <img src={FootballImg} alt="" className={styles.football} />
        <BaseTabs
          activeKey={rankType}
          theme="dark"
          className={styles.base_tab}
          onClick={() => {
            handleReport({
              action: 'expert_ranking',
              tag: ['continuous', 'hit'][rankType],
            });
            const lang = toShortLangCode(locale.getLocale());
            history.push(`/${lang}/expert/rank?tab=${rankType}`);
          }}
          list={[
            {
              key: RANKING_TYPE.GLZ,
              title: '高连中',
              node: (
                <Spin spinning={loading}>
                  <div className={styles.content}>
                    {!loading ? <ShortExpertList list={rankList} /> : null}
                  </div>
                </Spin>
              ),
            },
            {
              key: RANKING_TYPE.GMZ,
              title: '高命中',
              node: (
                <Spin spinning={loading}>
                  <div className={styles.content}>
                    {!loading ? <ShortExpertList list={rankList} type="gmz" /> : null}
                  </div>
                </Spin>
              ),
            },
          ]}
          onChange={setRankType}
        />
      </div>
      {recommendMatchesList.length > 0 ? (
        <section className={cls(styles.match_wrap, styles.section)}>
          <Title
            title="赛事优选"
            className={styles.title}
            theme="dark"
            onClick={() => {
              handleReport({
                action: 'match_list',
              });
              const lang = toShortLangCode(locale.getLocale());
              history.push(`/${lang}/expert/recommend`);
            }}
          />
          <MatchListScheme list={recommendMatchesList} query={{ tab: 'scheme' }} />
        </section>
      ) : null}

      <section className={cls(styles.section, styles.scheme_wrap)}>
        <BaseTabs
          activeKey={curKey}
          onChange={handleTabClick}
          className={styles.title}
          list={[
            {
              key: SCHEME_TYPE.HOT,
              title: '今日热卖',
              node: (
                <div className={styles.content}>
                  <Hot play={play} />
                </div>
              ),
            },
            {
              key: SCHEME_TYPE.MATCH_TIME,
              title: '开赛时间',
              node: (
                <div className={styles.content}>
                  <Match play={play} />
                </div>
              ),
            },
            {
              key: SCHEME_TYPE.WATCH,
              title: '关注',
              node: (
                <div className={styles.content}>
                  <Watch play={play} />
                </div>
              ),
            },
          ]}
          extra={
            <Dropdown
              overlay={menu}
              placement="bottomRight"
              overlayClassName={styles.overlayClassName}
              visible={visible}
              onVisibleChange={setVisible}
            >
              <span
                className={styles.trigger_name}
                onClick={() => {
                  setVisible(!visible);
                }}
              >
                {playName}
                <Iconfont type="icon-jiantouyou" className={styles.icon} />
              </span>
            </Dropdown>
          }
        />
      </section>
    </div>
  );
};
export default connect(({ user }) => ({ currentUser: user.currentUser }))(Expert);
