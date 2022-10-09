import styles from './pc.module.less';
import Iconfont from '@/components/IconFont';
import Modal from '@/components/Modal';
import Competition from '@/components/expert/competition/pc';
import React, { useState } from 'react';
import { handleReport } from '@/utils/report';

export default function SkilledCompetitions({ label, list, expertId }) {
  const [visible, setVisible] = useState(false);

  return list.length > 0 ? (
    <>
      <div
        className={styles.skilled_competitions}
        onClick={() => {
          handleReport({
            action: 'league_more',
          });
          setVisible(true);
        }}
      >
        <div className={styles.competition_title}>{label}</div>
        <div className={styles.tags}>
          {list.slice(0, 3).map((item) => {
            return (
              <span className={styles.tag} key={item}>
                {item}
              </span>
            );
          })}
          <span className={styles.icon}>
            <Iconfont type="icon-jiantouyou" />
          </span>
        </div>
      </div>
      <Modal
        visible={visible}
        hideFooter={true}
        closable
        destroyOnClose={false}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <div className={styles.modal_title}>擅长联赛</div>
        <Competition expertId={expertId} />
      </Modal>
    </>
  ) : null;
}
