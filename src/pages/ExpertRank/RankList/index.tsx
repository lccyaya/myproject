import React, { useState } from 'react';
import Glz from '../components/glz/mobile';
import Gmz from '../components/gmz/mobile';
import styles from './index.less';
import activeFlag from '@/assets/expert/active_flag.png';
import ScrollView from 'react-custom-scrollbars';

type Props = {};

const RankList: React.FC<Props> = (props) => {
  const [curKey, setCurKey] = useState('0');

  return (
    <div className={styles.container}>
      <div style={{ height: '90px' }}></div>
      <div className={styles.experts_box}>
        <div className={styles.tabs_box}>
          <div className={styles.tabs_item} onClick={() => setCurKey('0')}>
            <div className={styles.tabs_title}>高连红</div>
            {curKey == '0' ? (
              <div className={styles.tabs_active_line}>
                <img src={activeFlag} />
              </div>
            ) : null}
          </div>
          <div className={styles.tabs_item} onClick={() => setCurKey('1')}>
            <div className={styles.tabs_title}>近期命中</div>
            {curKey == '1' ? (
              <div className={styles.tabs_active_line}>
                <img src={activeFlag} />
              </div>
            ) : null}
          </div>
        </div>
        <div className={styles.scroll_container}>
          <ScrollView>
            {curKey === '0' ? <Glz /> : null}
            {curKey === '1' ? <Gmz /> : null}
          </ScrollView>
        </div>
      </div>
    </div>
  );
};

export default RankList;
