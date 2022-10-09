import React, { useEffect, useState } from 'react';
import { getRecommendExperts } from '@/services/expert';
import styles from './mobile.module.less';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { history } from 'umi';
import { handleReport } from '@/utils/report';
import Avatar from '@/components/avatar';

const RecommendExpert = ({ matchId }) => {
  const [list, setList] = useState([]);
  useEffect(() => {
    getRecommendExperts({ size: 2, match_id: matchId }).then((e) => {
      if (e.success) {
        setList(e.data);
      }
    });
  }, []);
  if (list.length === 0) {
    return null;
  }
  return (
    <div className={styles.recommend}>
      <div className={styles.title_box}>
        <img
          className={styles.title_logo}
          src={require('@/assets/recommend_expert_logo.png')}
          alt=""
        />
        <div className={styles.title_text}>联赛推荐专家</div>
      </div>
      <div className={styles.expert_box}>
        {list.map((expert) => {
          return (
            <div
              className={styles.expert_item}
              key={expert.id}
              onClick={() => {
                const lang = toShortLangCode(locale.getLocale());
                handleReport({ action: 'expert_enter', tag: 'recommend' });
                history.push(`/${lang}/expert-detail?id=${expert.id}`);
              }}
            >
              <Avatar src={expert.avatar} className={styles.expert_item_avatar} />
              <div className={styles.expert_item_right}>
                <div className={styles.expert_item_right_top}>
                  <div className={styles.expert_name}>{expert.nickname}</div>
                </div>
                <div className={styles.expert_score}>
                  <span>
                    胜负 <span className={styles.win_num}>{expert.win_num}</span>/{expert.lose_num}
                  </span>
                  {expert.sale_num ? (
                    <span className={styles.expert_schemes}>在售{expert.sale_num}</span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendExpert;
