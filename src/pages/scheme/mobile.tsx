import React, { useEffect, useState, useMemo } from 'react';
import ExpertDesc from '@/components/expert/expert-desc/mobile';
import SchemeBlock from './components/scheme-block/mobile';
import Analysis from './components/analysis/mobile';
import Tip from './components/tip/mobile';
import styles from './mobile.module.less';
import { schemeDetail, getMatchScore } from '@/services/expert';
import { message } from 'antd';
import { MATCH_STATUS, SCHEME_STATE, STOP_MATCH_STATUS } from '@/constants/index';
import { handleReport } from '@/utils/report';
import Pay from './components/pay/mobile';
import { NavBar } from 'antd-mobile';
import { useHistory } from 'umi';
const SchemePage = ({ id, matchId }) => {
  const [detail, setDetail] = useState(null);
  const [matchInfo, setMatchInfo] = useState(null);
  const [reportEventTag, setReportEventTag] = useState('');
  const history = useHistory();

  const getMatchScoreFetch = () => {
    getMatchScore({
      match_id: matchId,
    }).then((e) => {
      if (e.success) {
        setMatchInfo(e.data);
        if (e.data.status >= MATCH_STATUS.WC) {
          // 完结之后的比赛不在查询
        } else if (e.data.status === MATCH_STATUS.WKS && e.data.diff && e.data.diff > 0) {
          // 未开赛，等开赛的时候在查询一次
          setTimeout(() => {
            getMatchScoreFetch();
          }, e.data.diff * 1000);
        } else {
          setTimeout(() => {
            getMatchScoreFetch();
          }, 10000);
        }
      }
    });
  };
  const init = () => {
    schemeDetail({ id }).then((e) => {
      if (e.code === 0) {
        setDetail(e.data);
      }
    });
    if (matchId) {
      getMatchScoreFetch();
    }
  };
  useEffect(() => {
    init();
    return () => {};
  }, []);
  useEffect(() => {
    let fn = (type, play, gold_coin, status) => {
      let x = ['', 'jc', 'bd'][type];
      let y = ['', 'rq', 'spf', 'sfgg', 'sxds'][play];
      const action = [x, y].join('_');
      let tag = '';
      if (SCHEME_STATE.HIT === status || SCHEME_STATE.MISS === status) {
        tag = 'end';
      } else if (SCHEME_STATE.STOP_SALE === status) {
        tag = 'stop';
      } else {
        if (gold_coin === 0) {
          tag = 'free';
        } else {
          tag = gold_coin + '';
        }
      }
      setReportEventTag(action);
      handleReport({ action: action, tag: tag });
    };
    if (detail) {
      fn(detail.type, detail.play, detail.gold_coin, detail.status);
      fn = () => {};
    }
  }, [detail]);
  const isStop = useMemo(() => {
    return detail?.state === SCHEME_STATE.STOP_SALE || !!STOP_MATCH_STATUS[matchInfo?.status];
  }, [matchInfo, detail]);
  if (!detail) {
    return null;
  }

  const back = () => {
    history.goBack();
  };

  return (
    <div>
      <NavBar onBack={back}>攻略详情</NavBar>
      <div className={styles.scheme_page}>
        {/* 专家区块 */}
        <ExpertDesc
          describe={detail.describe}
          expert={detail.expert}
          published_at={detail.published_at}
          id={id}
          collected={detail.collected}
        />
        {/* 方案 */}
        <SchemeBlock detail={detail} matchInfo={matchInfo} />
        {/* 分析 */}
        {!detail.detail && !detail.gold_coin ? null : (
          <Analysis detail={detail} matchInfo={matchInfo || {}} isStop={isStop} />
        )}
        {/* 免责申明 */}
        <Tip />
        {!detail.detail && detail.state === SCHEME_STATE.SALE && detail.gold_coin > 0 && !isStop ? (
          <Pay
            detail={detail}
            id={id}
            onSuccess={() => {
              init();
            }}
            eventTag={reportEventTag}
          />
        ) : null}
      </div>
    </div>
  );
};

export default SchemePage;
