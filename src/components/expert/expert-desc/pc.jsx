import React from 'react';
import Achievements from '@/components/achievements/pc';
import Watch from '@/components/Watch/pc';
import Tags from '@/components/Tags/pc';
import SkilledCompetitions from '@/components/expert/skilled-competitions/pc';
import styles from './pc.module.less';
import Avatar from '@/components/avatar';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import { history } from 'umi';
import { handleReport } from '@/utils/report';
import { Affix } from 'antd';

const ExpertBlock = ({
  hideFans = false,
  hideTags = false,
  expert = {},
  refresh = () => {},
  type = '',
}) => {
  return (
    <Affix offsetTop={78}>
      <div className={styles.expert_block}>
        <Avatar
          src={expert.avatar}
          size={65}
          onClick={
            type === 'expert'
              ? ''
              : (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleReport({
                    action: 'expert_enter',
                  });
                  const lang = toShortLangCode(locale.getLocale());
                  history.push(`/${lang}/expert-detail?id=${expert.id}`);
                }
          }
        />
        <div
          className={styles.nick_name}
          style={type === 'expert' ? { cursor: 'default' } : {}}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleReport({
              action: 'expert_enter',
              tag: undefined,
            });
            const lang = toShortLangCode(locale.getLocale());
            history.push(`/${lang}/expert-detail?id=${expert.id}`);
          }}
        >
          {expert.nickname}
        </div>
        {!hideTags ? (
          <Tags list={[expert.continuous_tag, expert.hit_tag]} className={styles.tags} />
        ) : null}
        {!hideFans ? (
          <div className={styles.fans_scheme}>
            <div className={styles.fans_item}>
              <span className={styles.fans_number}>{expert.fans_num}</span>
              <span className={styles.fans_value}>粉丝</span>
            </div>
            <div className={styles.scheme_item}>
              <span className={styles.scheme_number}>{expert.scheme_num}</span>
              <span className={styles.scheme_value}>方案</span>
            </div>
          </div>
        ) : null}
        {expert.introduce ? <div className={styles.desc}>{expert.introduce}</div> : null}
        <SkilledCompetitions
          label="擅长联赛："
          list={expert.skilled_competitions || []}
          expertId={expert.id}
        />

        {expert?.recent_record?.length ? (
          <Achievements label="近期战绩：" records={expert.recent_record} />
        ) : null}
        <Watch id={expert.id} followed={expert.followed} onSuccess={refresh} />
      </div>
    </Affix>
  );
};

export default ExpertBlock;
