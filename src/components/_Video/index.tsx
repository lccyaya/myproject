/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Slider } from 'antd';
import styles from './index.less';
// 调用hls
import HVideo from './HlsVideo';


import play from './images/play.svg'; // play 播放
import pause from './images/pause.svg'; // pause 暂停


import IVolumeFull from './images/volume_full.svg'; // 声音
import IVolumeMute from './images/volume_mute.svg'; // 静音
import IFullScreen from './images/full_screen.svg'; // 全屏
import IReduceScreen from './images/reduce_screen.svg'; // 取消全屏
import IFullWindow from './images/full_window.svg'; // 网页全屏


// 格式化播放时间
// @ts-ignore
const getSecondTimeFormat = (e: any) => {
  const time = Math.ceil(e);
  let h: any = (parseInt(`${time / 3600}`, 10));
  if (h.toString().length === 1) {
    h = `0${h}`;
  }
  let m: any = (parseInt(`${(time % 3600) / 60}`, 10));
  if (m.toString().length === 1) {
    m = `0${m}`;
  }
  let s: any = (time - 3600 * h - 60 * m);
  if (s.toString().length === 1) {
    s = `0${s}`;
  }
  return time < 3600 ? `${m}:${s}` : `${h}:${m}:${s}`;
};


interface IState {
  isCanPlay: boolean;
  isPlay: boolean;
  currentTime: number | null;
  duration: number | null;
  percent: number;
  load: number;
  volume: number;
  isMuted: boolean;
  isVideoExpand: boolean;
  isVideoWindowExpand: boolean;
  isShowSettingPanel: boolean;
  errorText: null | string;
  durationTime: any;
}

interface IProps {
  url: string;
  autoplay?: boolean;
  style?: any;
  className?: string;
  thumbImageUrl?: string;
  simple?: boolean;
  needExpand?: boolean;
  needWindowExpand?: boolean;
  volume?: number;
  needVolume?: boolean;
  needPause?: boolean;
  needShowError?: boolean;
  muted?: boolean;
  isLive?: boolean;
  onFullScreenChange?: (isFullScreen: boolean) => void;
}
class MVideo extends Component<IProps, IState> {
  videoWrapRef: any;
  framesPer: number;
  detectPauseTimer: number | undefined;
  isIOS = ['iPhone', 'iPad', 'iPod', 'iPad Simulator', 'iPhone Simulator', 'iPod Simulator',].includes(navigator.platform);
  constructor(props: IProps) {
    super(props);
    this.state = {
      isCanPlay: false,
      isPlay: !!this.props.autoplay,
      currentTime: null,
      duration: null,
      percent: 0,
      load: 0,
      volume: this.props.volume || 50,
      isMuted: this.props.volume === 0 || !!this.props.muted,
      isVideoExpand: false, // 是否全屏
      isVideoWindowExpand: false, // 是否网页全屏
      isShowSettingPanel: false,
      errorText: null,
      durationTime: 0, // 总时长
    };
    this.framesPer = 0.04;
    // 自动播放时，暂停页面内其他视频
    if (this.props.autoplay) {
      this.pauseAllVideo();
    }
  }

  componentDidMount() {
    this.init();
    window.addEventListener('fullscreenchange', this.fullscreenchange);
    window.addEventListener('webkitfullscreenchange', this.fullscreenchange);
    window.addEventListener('mozfullscreenchange', this.fullscreenchange);
    window.addEventListener('MSFullscreenChange', this.fullscreenchange);
  }

  componentWillUnmount() {
    clearTimeout(this.detectPauseTimer);

    window.removeEventListener('fullscreenchange', this.fullscreenchange);
    window.removeEventListener('webkitfullscreenchange', this.fullscreenchange);
    window.removeEventListener('mozfullscreenchange', this.fullscreenchange);
    window.removeEventListener('MSFullscreenChange', this.fullscreenchange);
    // 快捷键
    // window.removeEventListener('keydown', this.shortcutKeyChange);
  }

  fullscreenchange = () => {
    this.props.onFullScreenChange?.(!this.state.isVideoExpand);
    this.setState({
      isVideoExpand: !this.state.isVideoExpand,
    });
  }

  pauseAllVideo() {
    [].forEach.call(document.querySelectorAll('video'), (v: HTMLVideoElement) => {
      v.pause();
    });
  }

  init() {
    const video: any = ReactDOM.findDOMNode(this.refs.video); // eslint-disable-line react/no-string-refs,react/no-find-dom-node
    // 加载
    video!.addEventListener('loadedmetadata', () => {
      const durationTime: any = video!.duration!;
      const currentTime: any = durationTime < 3600 ? '00:00' : '00:00:00';

      const duration: any = getSecondTimeFormat(Math.ceil(durationTime));
      this.setState({
        currentTime,
        duration,
        durationTime,
      });
    });
    // 加载进度条
    const loadbar = () => {
      let load = 0;
      if (video.readyState === 4) {
        const bufferIndex = video.buffered.length;
        if (bufferIndex > 0 && video.buffered !== undefined) {
          load = video.buffered.end(bufferIndex - 1) / video.duration * 100;
          if (Math.abs(video.duration - video.buffered.end(bufferIndex - 1)) < 1) {
            load = 100;
          }
          return load;
        }
      }
    };
    // 播放
    video!.addEventListener('timeupdate', () => {
      const load: any = loadbar();
      const current: any = video.currentTime;
      const percent: any = video.currentTime / video.duration * 100;

      const currentTime: any = getSecondTimeFormat(Math.ceil(current)); // 转化的展示播放时间

      this.setState({
        currentTime,
        percent: Number.isNaN(percent) ? 0 : percent,
        load,
      }, () => {
        if (this.state.percent >= 100) {
          this.setState({
            isPlay: false,
          });
          video.pause();
        }
      });
    });
    // 准备好开始播放
    video!.addEventListener('canplay', () => {
      this.setState({
        isCanPlay: true,
      });
      video!.play();
      this.detectPauseTimer = window.setTimeout(() => {
        this.setState({
          isPlay: !video.paused,
        });
      }, 2000);
    });
    // 播放结束
    video!.addEventListener('ended', () => {
      this.setState({
        isPlay: false,
        percent: 100,
      });
    });
    // 播放中
    video!.addEventListener('play', () => {
      this.setState({
        isPlay: true,
        isShowSettingPanel: false,
      });
    });
    video!.addEventListener('pause', () => {
      this.setState({
        isPlay: false,
        isShowSettingPanel: false,
      });
    });
    // 音量改变
    video!.addEventListener('volumechange', () => { });

    // 报错
    let num = 0;
    let timer: any = null;
    video!.addEventListener('error', () => {
      timer = setTimeout(() => {
        if (num >= 30) {
          clearTimeout(timer);
          num = 0;
          this.setState({ errorText: '加载失败!' });
        } else {
          num++;
          (video as any).load();
        }
      }, 1000);
    });
  }

  /* 系统全屏 */
  videoExpand = () => {
    const video = this.videoWrapRef;
    // 系统全屏
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    } else if (video.webkitRequestFullScreen) {
      video.webkitRequestFullScreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    } else if (video.oRequestFullscreen) {
      video.oRequestFullScreen();
    }
  };

  /* 取消系统全屏 */
  videoReduce = () => {
    const { document }: any = window;
    // 取消系统全屏
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.oExitFullscreen) {
      document.oExitFullscreen();
    }
  };

  /* 网页全屏 */
  videoWindowExpand = () => {
    this.setState({
      isVideoWindowExpand: true,
    });
  };
  // 打开声音
  disableMute = () => {
    const video: any = ReactDOM.findDOMNode(this.refs.video); // eslint-disable-line react/no-string-refs,react/no-find-dom-node
    video!.muted = false;
    if (this.state.volume === 0) {
      video.volume = 0.5;
    }
    this.setState({
      isMuted: false,
      volume: this.state.volume !== 0 ? this.state.volume : 50,
      isShowSettingPanel: false,
    });
  };

  // 关闭声音
  enableMute = () => {
    const video: any = ReactDOM.findDOMNode(this.refs.video); // eslint-disable-line react/no-string-refs,react/no-find-dom-node
    video.muted = true;
    this.setState({
      isMuted: true,
      isShowSettingPanel: false,
    });
  };

  // 修改音量
  setVolume = (v: number) => {
    const video: any = ReactDOM.findDOMNode(this.refs.video); // eslint-disable-line react/no-string-refs,react/no-find-dom-node
    video.volume = v / 100;
    video.muted = false;
    if (v === 0) {
      video.muted = true;
    }
    this.setState({
      volume: v,
      isMuted: video.muted,
      isShowSettingPanel: false,
    });
  };

  mouseDownVideo = (percent: number) => {
    if (!this.state.isCanPlay) {
      return false;
    }
    const video: any = ReactDOM.findDOMNode(this.refs.video);// eslint-disable-line react/no-string-refs,react/no-find-dom-node
    const durationTime = video.duration;
    let currentTime = video.currentTime || 0;
    currentTime = percent / 100 * durationTime;

    video.currentTime = currentTime;
      this.setState({
        percent,
        isPlay: false,
      });
      video.pause();
  }

  pause = () => {
    if (!this.state.isCanPlay) {
      return false;
    }
    const video: any = ReactDOM.findDOMNode(this.refs.video);// eslint-disable-line react/no-string-refs,react/no-find-dom-node
    const isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2;
    if (isPlaying) {
      this.setState({
        isPlay: false,
        isShowSettingPanel: false,
      });
      video.pause();
    }
  }


  play = () => {
    if (!this.state.isCanPlay) {
      return false;
    }
    this.pauseAllVideo();
    const video: any = ReactDOM.findDOMNode(this.refs.video);// eslint-disable-line react/no-string-refs,react/no-find-dom-node
    const isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2;

    if (isPlaying) {
      this.setState({
        isPlay: false,
        isShowSettingPanel: false,
      });
      video.pause();
    } else {
      this.setState({
        isPlay: true,
        isShowSettingPanel: false,
      });
      video.play();
    }
  }


  render() {
    const {
      style,
      className,
      autoplay = false,
      thumbImageUrl = null,
      simple = false,
      needExpand = false,
      needWindowExpand = false,
      needVolume = false,
      needShowError = false,
      needPause,
      url,
    } = this.props;
    const {
      isCanPlay,
      isPlay,
      isMuted,
      volume,
      isVideoExpand,
      isVideoWindowExpand,
      errorText,
    } = this.state;

    return (
      <div
        className={`${styles.videoContainer} ${isVideoWindowExpand ? styles.videoFullWindow : ''}`}
      >
        <div
          className={`${styles.video} ${isVideoExpand ? styles.isVideoExpand : ''} ${isPlay ? styles.isPlay : ''
            } ${className || ''}`}
          ref={(ref) => {
            this.videoWrapRef = ref;
          }} // eslint-disable-line react/no-string-refs
          style={style}
        >
          {!(needShowError && errorText) && !isCanPlay && (
            <div className={styles.isCanPlay}>
              <div className={styles.loading}>
                <div className={styles.rotateLoader} />
              </div>
            </div>
          )}
          {needShowError && errorText && (
            <div className={styles.errorText}>
              <span>{errorText}</span>
            </div>
          )}
          <HVideo
            ref="video" // eslint-disable-line react/no-string-refs
            // @ts-ignore
            src={url}
            poster={thumbImageUrl || ''}
            autoPlay={autoplay}
            muted={this.state.isMuted}
          />
          {!this.isIOS && <div className={styles.videoControls}>
            {
              !this.props.isLive && (
                <>
                  <div className={styles.videoProgress}>
                    <Slider tipFormatter={null} onChange={this.mouseDownVideo} value={this.state.percent}
                            step={this.framesPer} />
                    <div
                      className={styles.videoProgressLoad}
                      style={{
                        width: `${this.state.load}%`,
                      }}
                    />
                  </div>
                  <div className={styles.videoPlayBtn}>
                    {!this.state.isPlay && (
                      <img src={play} alt="播放" onClick={this.play} />
                    )}
                    {this.state.isPlay && (
                      <img src={pause} alt="暂停" onClick={this.pause} />
                    )}
                  </div>
                  {this.state.duration && (
                    <div className={styles.videoTimes}>
                      <span className={styles.videoNowTime}>{this.state.currentTime}</span>
                      <span className={styles.videoAllTimes}>
                        ／
                        {this.state.duration}
                      </span>
                    </div>
                  )}
                </>
              )
            }
            {this.props.isLive && !simple && needPause && (
              <div className={styles.videoPlayBtn}>
                {!this.state.isPlay && (
                  <img src={play} alt="播放" onClick={this.play} />
                )}
                {this.state.isPlay && (
                  <img src={pause} alt="暂停" onClick={this.pause} />
                )}
              </div>
            )}
            {!simple && needExpand && !isVideoExpand && (
              <div className={styles.videoBarBtn} onClick={this.videoExpand}>
                <img
                  src={IFullScreen}
                  alt="全屏"
                  style={{ width: 16, height: 16, marginTop: -8 }}
                />
              </div>
            )}
            {!simple && needExpand && isVideoExpand && (
              <div className={styles.videoBarBtn} onClick={this.videoReduce}>
                <img
                  src={IReduceScreen}
                  alt="取消全屏"
                  style={{ width: 16, height: 16, marginTop: -8 }}
                />
              </div>
            )}

            {!simple && needWindowExpand && !isVideoWindowExpand && (
              <div className={styles.videoBarBtn} onClick={this.videoWindowExpand}>
                <img
                  src={IFullWindow}
                  alt="网页全屏"
                  style={{ width: 16, height: 16, marginTop: -8 }}
                />
              </div>
            )}
            {/* {!simple && needWindowExpand && isVideoWindowExpand && (
              <div className={styles.videoBarBtn} onClick={this.videoWindowReduce}>
                <img src={IReduceWindow} alt="取消网页全屏" style={{ width: 16, height: 16, marginTop: -8 }} />
              </div>
            )} */}

            {!simple && needVolume && (
              <div className={styles.volumeBarBtn}>
                <div className={styles.volumeBar}>
                  <Slider
                    tipFormatter={null}
                    onChange={this.setVolume}
                    value={isMuted ? 0 : volume}
                  />
                </div>
              </div>
            )}
            {!simple && needVolume && !isMuted && (
              <div className={styles.videoBarBtn} onClick={this.enableMute}>
                <img
                  src={IVolumeFull}
                  alt="声音"
                  style={{ width: 20, height: 20, marginTop: -10 }}
                />
              </div>
            )}
            {!simple && needVolume && isMuted && (
              <div className={styles.videoBarBtn} onClick={this.disableMute}>
                <img
                  src={IVolumeMute}
                  alt="静音"
                  style={{ width: 20, height: 20, marginTop: -10 }}
                />
              </div>
            )}
          </div>}
        </div>
      </div>
    );
  }
}

export default MVideo;
