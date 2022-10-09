import FBExpertTag, { FBTagType } from '@/components/FBExpertTag';
import IconFont from '@/components/IconFont';
import { SCHEME_STATE } from '@/constants/index';
import { formatTime } from '@/utils/utils';
import { Avatar } from 'antd';
import { Divider, Space } from 'antd-mobile';
import dayjs from 'dayjs';
import React from 'react';
import styles from './index.less';

import HitImage from '@/assets/hit.png';
import MissImage from '@/assets/miss.png';
import { useHistory } from 'umi';

type Props = {
  scheme: any;
};

const SchemeItem: React.FC<Props> = (props) => {
  const { scheme } = props;
  const history = useHistory();

  const toExpert = (id: string) => {
    history.push(`/zh/expert-detail?id=${id}`);
  };
  const toScheme = (id: string, match_id: string) => {
    history.push(`/zh/scheme?id=${id}&match_id=${match_id}`);
  };
  return (
    <div
      className={styles.container}
      onClick={() => {
        toScheme(scheme.scheme_id, scheme.match_id);
      }}
    >
      <div className={styles.header}>
        <div className={styles.expert_box} onClick={() => toExpert(scheme.expert_id)}>
          <Avatar src={scheme.avatar} size={42} />
          <div className={styles.nickname_box}>
            <div className={styles.nickname}>{scheme.nickname}</div>
            <Space>
              {scheme.hit_tag ? (
                <FBExpertTag type={FBTagType.HitRate} tag={scheme.hit_tag} />
              ) : null}
              {scheme.continuous_tag ? (
                <FBExpertTag type={FBTagType.Continue} tag={scheme.continuous_tag} />
              ) : null}
            </Space>
          </div>
        </div>
        {scheme.hit_rate >= 60 ? (
          <div className={styles.hit_info_box}>
            <div className={styles.hit_rate}>
              <span className={styles.rate}>{scheme.hit_rate}</span>
              <span className={styles.rate_flag}>%</span>
            </div>
            <div className={styles.rate_des}>近期命中率</div>
          </div>
        ) : null}
      </div>
      <div className={styles.title_box}>{scheme.describe}</div>
      <div className={styles.match_box}>
        <div className={styles.match_info}>
          <span>{scheme.competition_name}</span>
          <Divider direction="vertical" style={{ margin: '0px 8px', color: '#CFD0D8' }} />
          <span>{scheme.home_name}</span>
          <span style={{ margin: '0px 4px' }}>vs</span>
          <span>{scheme.away_name}</span>
        </div>
        <div>
          <span>{dayjs(scheme.match_time * 1000).format('MM-DD HH:mm')}</span>
          <IconFont
            className={styles.arrow_icon}
            type="icon-jiantouyou"
            color="#848494"
            size={10}
          ></IconFont>
        </div>
      </div>
      <div className={styles.scheme_box}>
        <div className={styles.scheme_left_box}>
          <span>单关</span>
          <Divider direction="vertical" style={{ margin: '0px 8px', color: '#CFD0D8' }} />
          <span>{scheme.published_at ? `${formatTime(scheme.published_at)}发布` : ''}</span>
        </div>
        <div className={styles.scheme_right_box}>
          {scheme.state === SCHEME_STATE.HIT ? <img src={HitImage} /> : null}
          {scheme.state === SCHEME_STATE.MISS ? <img src={MissImage} /> : null}
          {/* <span style={{ color: '#FF2020' }}>售卖中</span> */}
          {/* <span style={{ color: '#B64B11' }}>免费</span> */}
          {scheme.state === SCHEME_STATE.STOP_SALE ? (
            <span className={styles.stop_sale} style={{ color: '#B64B11' }}>
              停售
            </span>
          ) : (
            <span className={styles.gold} style={{ color: '#B64B11' }}>
              {scheme.gold_coin === 0 ? '免费' : `${scheme.gold_coin}金币`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemeItem;
