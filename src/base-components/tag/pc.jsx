import React from 'react';
import Iconfont from '@/base-components/iconfont';
import styles from './pc.module.less';
import Bounce from '@/base-components/bounce';

const PC = ({ icon, leftRender, color, text = 'Playback' }) => {
  return (
    <div className={styles.tag}>
      {icon || leftRender ? (
        <div className={styles.tag_left}>
          {icon ? (
            icon === 'icon-zhibo' ? (
              <Bounce />
            ) : (
              <Iconfont type={icon} color={color} size={12}></Iconfont>
            )
          ) : null}
          {leftRender ? leftRender : null}
        </div>
      ) : null}

      <div className={styles.tag_right} style={!icon ? { color } : {}}>
        {text}
      </div>
    </div>
  );
};

export default PC;
