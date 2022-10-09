import React from 'react';
import Iconfont from '@/base-components/iconfont';
import styles from './mobile.module.less';
import Bounce from '@/base-components/bounce';

const Mobile = ({ icon, leftRender, color, text = 'Playback', type = 'score' }) => {
  return (
    <div className={styles.tag}>
      {icon || leftRender ? (
        <div className={styles.tag_left}>
          {icon ? (
            icon === 'icon-zhibo' ? (
              <Bounce />
            ) : (
              <Iconfont type={icon} color={color} size={10}></Iconfont>
            )
          ) : null}
          {leftRender ? leftRender : null}
        </div>
      ) : null}
      <div className={styles.tag_right} style={!icon ? { color } : {}}>
        <div
          className={styles.tag_right_txt}
          style={
            type === 'score'
              ? {
                  textAlign: 'left',
                  transformOrigin: 'left center',
                }
              : {}
          }
        >
          {text}
        </div>
      </div>
    </div>
  );
};

export default Mobile;
