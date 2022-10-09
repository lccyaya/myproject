import { Avatar } from 'antd';
import React from 'react';
import { useHistory } from 'umi';
import styles from './index.less';
import lodash from 'lodash';
import FBExpertTag, { FBTagType } from '@/components/FBExpertTag';

type Props = {
  expert: any;
};

const HotExpertItem: React.FC<Props> = (props) => {
  const { expert } = props;
  const history = useHistory();
  const toExpert = () => {
    history.push(`/zh/expert-detail?id=${expert.expert_id}`);
  };
  return (
    <div className={styles.container} onClick={toExpert}>
      <Avatar src={expert.avatar} size={45} />
      <span className={styles.nickname}>{expert.nickname}</span>
      {lodash.isEmpty(expert.continuous_tag) ? (
        <FBExpertTag type={FBTagType.HitRate} tag={expert.hit_tag} />
      ) : (
        <FBExpertTag type={FBTagType.Continue} tag={expert.continuous_tag} />
      )}
    </div>
  );
};

export default HotExpertItem;
