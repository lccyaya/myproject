import styles from './pc.module.less';
import React, { useState, useEffect, useRef } from 'react';
import BaseTabs from '@/components/BaseTabs';
import Title from '@/components/Title';
import { Menu, Dropdown, Spin } from 'antd';
import Iconfont from '@/components/IconFont';
import { RANKING_TYPE, SCHEME_TYPE } from '@/constants/index';
import { getExpertRanking, followedList, recommendMatches } from '@/services/expert';
import ShortExpertList from '@/components/ShortExpertList';
import Hot from './components/hot/pc';
import Match from './components/match/pc';
import Watch from './components/watch/pc';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { history, connect } from 'umi';
import WatchExpertList from '@/components/WatchExpert';
import MatchListScheme from '@/components/MatchListScheme';
import EventEmitter from '@/utils/event';
import { handleReport } from '@/utils/report';
import { useCheckScroll } from '@/hooks/check-scroll';

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
  const [play, setPlay] = useState(list[0].id);
  const [playName, setPlayName] = useState(list[0].name);
  const [rankType, setRankType] = useState(RANKING_TYPE.GLZ);
  const [rankList, setRankList] = useState([]);
  const [matchList, setMatchList] = useState([]);
  const [expertList, setExpertList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [curKey, setCurKey] = useState(SCHEME_TYPE.HOT);
  const [domHeight, setDomHeight] = useState(0);

  const { isScroll } = useCheckScroll(domHeight + 48);
  const ref = useRef();

  const fetchRankList = async ({ rankType }) => {
    setLoading(true);
    const resp = await getExpertRanking({
      page: 1,
      size: 5,
      tab: rankType,
    });
    setLoading(false);
    if (resp.success) {
      const list = resp.data.list || [];
      setRankList(resp.data.list);
    }
  };
  const fetchFollowData = async () => {
    const resp = await followedList({
      page: 1,
      size: 5,
    });
    if (resp.success) {
      const list = resp.data.list || [];
      setExpertList(list);
    }
  };
  const fetchMatchData = async () => {
    const resp = await recommendMatches({
      page: 1,
      size: 5,
    });
    if (resp.success) {
      const list = resp.data.list || [];
      setMatchList(list);
    }
  };
  useEffect(() => {
    fetchRankList({ rankType });
  }, [rankType]);

  useEffect(() => {
    Promise.all([fetchMatchData(), fetchFollowData()]).then(() => {
      setTimeout(() => {
        setDomHeight(ref?.current?.clientHeight);
      }, 300);
    });
  }, []);
  const menu = (
    <Menu selectedKeys={[play]}>
      {list.map((item) => {
        return (
          <Menu.Item
            onClick={(e) => {
              setPlay(e.key);
              setPlayName(item.name);
              handleReport({
                action: ['all', 'rq', 'spf', 'sfgg', 'sxds'][e.key],
              });
            }}
            key={item.id}
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
      <div className={styles.left}>
        <section>
          <BaseTabs
            onChange={setRankType}
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
                      {!loading ? <ShortExpertList type="gmz" list={rankList} /> : null}
                    </div>
                  </Spin>
                ),
              },
            ]}
          />
        </section>
        <section>
          <BaseTabs
            activeKey={curKey}
            onChange={handleTabClick}
            list={[
              {
                key: SCHEME_TYPE.HOT,
                title: '今日热卖',
                node: <Hot play={play} />,
              },
              {
                key: SCHEME_TYPE.MATCH_TIME,
                title: '开赛时间',
                node: <Match play={play} />,
              },
              {
                key: SCHEME_TYPE.WATCH,
                title: '关注',
                node: <Watch play={play} />,
              },
            ]}
            extra={
              <Dropdown
                overlay={menu}
                placement="bottomRight"
                overlayClassName={styles.overlayClassName}
              >
                <div className={styles.trigger_name}>
                  {playName}
                  <Iconfont type="icon-jiantouyou" size={14} className={styles.icon} />
                </div>
              </Dropdown>
            }
          />
        </section>
      </div>
      {matchList.length > 0 || expertList.length > 0 ? (
        <div
          className={styles.right}
          ref={ref}
          style={{
            position: 'sticky',
            top: isScroll ? `calc(100vh - ${domHeight + 80}px)` : '82px',
          }}
        >
          {matchList.length > 0 ? (
            <section>
              <Title
                title="赛事优选"
                className={styles.title}
                onClick={() => {
                  handleReport({
                    action: 'match_list',
                  });
                  const lang = toShortLangCode(locale.getLocale());
                  history.push(`/${lang}/expert/recommend`);
                }}
              />
              <div className={styles.match_list}>
                <MatchListScheme list={matchList} query={{ tab: 'scheme' }} />
              </div>
            </section>
          ) : null}
          {expertList.length > 0 ? (
            <section>
              <Title
                title="关注的专家"
                className={styles.title}
                onClick={() => {
                  const lang = toShortLangCode(locale.getLocale());
                  history.push(`/${lang}/expert/rank?tab=2`);
                }}
              />
              <WatchExpertList list={expertList} />
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default connect(({ user }) => ({ currentUser: user.currentUser }))(Expert);
