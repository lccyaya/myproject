import React from 'react';
import Player from '../Player';
import * as matchService from '@/services/match';

import styles from './index.less';
import { checkIsPhone } from '@/utils/utils';

type _PlayerItem = matchService.PlayerItem & { isHome: boolean };
interface ICourt {
  data: _PlayerItem[];
  isPhone?: boolean;
  status: number;
}
const Court: React.FC<ICourt> = (props) => {
  const { data, status } = props;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {data.map((i) => (
          <Player isPhone={checkIsPhone()} {...i} />
        ))}
      </div>
      {status === 1 && <div className={styles.prediction}>Prediction</div>}
    </div>
  );
};

export default Court;
