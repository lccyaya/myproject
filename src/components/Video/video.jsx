import DPlayer from 'dplayer';
import Hls from 'hls.js';
import { locale } from '@/app';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';

const MVideo = ({ url, autoplay, isLive, style }) => {
  const [loading, setLoading] = useState(true);
  const videoRef = useRef();
  const type = /\.m3u8(\?.*)?/.test(url) ? 'customHls' : '';
  useEffect(() => {
    let hls = null;
    const video = new DPlayer({
      container: videoRef.current, // 注意：这里一定要写 div 的 dom
      live: isLive,
      autoplay,
      theme: '#009267',
      preload: 'auto',
      volume: 0.3,
      // 视频组件支持的语言有限，所以都用英语
      lang: 'en',
      video: {
        url, // 这里填写.m3u8 视频连接
        type,
        customType: {
          customHls: (video) => {
            hls = new Hls();
            hls.loadSource(video.src);
            hls.attachMedia(video);
          },
        },
      },
    });
    video.play(); // 播放
    video.on('canplay', () => {
      // 监听函数
      setLoading(false);
    });
    video.on('error', () => {
      console.log('error');
    });
    return () => {
      hls?.destroy();
      video.destroy();
    };
  }, []);
  return (
    <div className={styles.player_wrap} style={style}>
      <div ref={videoRef} className={styles.player} />
      {loading ? <div className={styles.mask} /> : null}
    </div>
  );
};
export default MVideo;
