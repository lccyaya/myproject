import styles from './index.less';
import type { CSSProperties } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import ReactPageScroller from 'react-page-scroller';
import ios_download from '../../assets/ios_download.png';
import android_download from '../../assets/android_download.png';
import firstSlideWaveImg from '@/assets/page_download/first_slide_wave.png';
import mobileFirstSlideArcImg from '@/assets/page_download/m_first_slide_arc_shape.png';
// import firstSlideLogoImg from '@/assets/page_download/first_slide_logo.png';
// import mobileFirstSlideLogoImg from '@/assets/page_download/m_first_slide_logo.png';
import matchSlideBgImg from '@/assets/page_download/match_slide_bg.png';
import mobileLiveSlideVideoImg from '@/assets/page_download/m_live_slide_video.gif';
import footerSlideIOSIcon from '@/assets/page_download/footer_slide_ios.png';
import footerSlideAndroidIcon from '@/assets/page_download/footer_slide_android.png';
import { isServer } from '@/utils/env';
import { APP_STORE_LINK, GOOGLE_PLAY_LINK, REPORT_ACTION, REPORT_CATE } from '@/constants';
import { FormattedMessage, useLocation } from 'umi';
import QRCode from 'qrcode.react';
import pageConfig from '@/utils/pageConfig';
import {
  firstSlideAppImg,
  infoSlideAppImg,
  liveSlideAppImg,
  matchSlideAppImg,
  matchSlideWebImg,
  mobileFirstSlideAppImg,
} from './locale-image';
import { getDownloadLinkByChannel } from '@/services/app';
import { report } from '@/services/ad';

let m = null;

// const isiphone = /iphone/i.test(navigator.userAgent);

// function setHeaderVisible(visible: boolean) {
//   const headers = document.querySelectorAll<HTMLDivElement>(
//     '.ant-layout-header,#global-open-app-header',
//   );
//   [].forEach.call(headers, (el: HTMLDivElement) => {
//     if (!visible) {
//       // eslint-disable-next-line no-param-reassign
//       el.className += ' hide';
//     } else {
//       // eslint-disable-next-line no-param-reassignnavigator
//       el.className = el.className.replace(/ hide/g, '');
//     }
//   });
// }

const AndroidDownloadQrCode = React.memo(
  (props: { link: string; style?: CSSProperties; onClick?: (e: React.MouseEvent) => void }) => {
    return (
      <div
        className={styles.androidQrWrapper}
        style={props.style}
        onClick={(e) => props.onClick?.(e)}
      >
        <QRCode value={props.link} size={391} />
      </div>
    );
  },
);

const GooglePlayBtn = ({ onClick }) => {
  return (
    <div className={styles.mobile_btn_google} onClick={onClick}>
      <div className={styles.mobile_btn_logo}>
        <img
          src={require('@/assets/image/download-page/google_download_btn.png')}
          alt=""
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div>Google play</div>
    </div>
  );
};
const DownloadNowBtn = ({ onClick }) => {
  return (
    <div className={styles.mobile_btn_download_now} onClick={onClick}>
      <div className={styles.mobile_btn_logo}>
        <img
          src={require('@/assets/image/download-page/download_now_btn.png')}
          alt=""
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div>
        <FormattedMessage id="key_download_now" />
      </div>
    </div>
  );
};
const AppleBtn = ({ onClick }) => {
  return (
    <div className={styles.mobile_btn_apple} onClick={onClick}>
      <div className={styles.mobile_btn_logo}>
        <img
          src={require('@/assets/image/download-page/apple_download_btn.png')}
          alt=""
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div>Apple Store</div>
    </div>
  );
};

export default function Download() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const channel = query.get('channel');
  const [headerVisible, setHeaderVisible] = useState(false);
  const [androidDownloadLink, setAndroidDownloadLink] = useState('');
  const [showIOS, setShowIOS] = useState(false);
  const [showAndroid, setShowAndroid] = useState(false);
  const [curPage, setCurPage] = useState(0);
  const [liveSlideMobileVideoLeft, setLiveSlideMobileVideoLeft] = useState(0);
  const [liveSlideMobileVideoTop, setLiveSlideMobileVideoTop] = useState(0);
  const [liveSlideMobileVideoWidth, setLiveSlideMobileVideoWidth] = useState(0);
  const [liveSlideMobileVideoHeight, setLiveSlideMobileVideoHeight] = useState(0);
  const liveSlideMobileAppImgRef = useRef<HTMLImageElement | null>(null);
  const [isMobile, setIsMobile] = useState(
    !isServer && document.documentElement.clientWidth <= 480,
  );
  const [isiphone, setIsiphone] = useState(false);
  const [block, setBlock] = useState(false);

  const toggleQrVisible = (type: 'iOS' | 'Android') => {
    if (type === 'iOS') {
      setShowIOS((p) => !p);
    } else {
      setShowAndroid((p) => !p);
    }
  };

  const handlePageChange = (page: number) => {
    setCurPage(page);
  };
  const handleBeforeChange = (toPage: number) => {
    setBlock(true);
    if (toPage === 0) {
      setHeaderVisible(false);
    } else {
      setHeaderVisible(true);
    }
    setTimeout(() => setBlock(false), 1200);
  };

  const handleLiveSlideMobileAppImgLoad = () => {
    const el = liveSlideMobileAppImgRef.current;
    if (!el) return;
    const widthRatio = 298 / 680;
    const heightRatio = 146.73 / 298;
    const leftRatio = 82 / 680;
    const topRatio = 28.27 / 680;
    const { width } = el.getBoundingClientRect();
    const w = width * widthRatio;
    setIsiphone(/iphone/i.test(navigator.userAgent));
    setLiveSlideMobileVideoLeft(Math.floor(width * leftRatio));
    setLiveSlideMobileVideoTop(Math.floor(width * topRatio));
    setLiveSlideMobileVideoWidth(w);
    setLiveSlideMobileVideoHeight(w * heightRatio);
  };

  const handlePanelClick = () => {
    if (isMobile) return;
    const maxPageIndex = 4;
    if (curPage < maxPageIndex) {
      const nextPage = curPage + 1;
      handleBeforeChange(nextPage);
      setCurPage(nextPage);
    }
  };

  const handleQrClick = (e: React.MouseEvent, type: 'Android' | 'iOS') => {
    e.preventDefault();
    e.stopPropagation();
    toggleQrVisible(type);
  };

  const getDownloadLink = async () => {
    // if (!channel) return;
    const res = await getDownloadLinkByChannel(channel || '');
    if (res.success) {
      setAndroidDownloadLink(res.data.download_url);
    }
  };

  const reportDownload = (action: REPORT_ACTION) => {
    report({
      cate: REPORT_CATE.download,
      action,
      tag: `channel=${channel || ''}`,
    });
  };

  const goStore = (str?: any) => {
    if (str === 'google') {
      window.open(GOOGLE_PLAY_LINK);
      return;
    }
    var data = window?.OpenInstall?.parseUrlParams();
    if (data?.channelCode) {
      m?.wakeupOrInstall({ data: data, channelCode: data.channelCode });
      return;
    }
    const isIOS = /iphone/i.test(navigator.userAgent);
    if (isIOS) {
      window.open(APP_STORE_LINK);
    } else {
      if (androidDownloadLink) {
        window.open(androidDownloadLink);
      } else {
        window.open(GOOGLE_PLAY_LINK);
      }
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.addEventListener('resize', handleLiveSlideMobileAppImgLoad);
    const matchMedia = window.matchMedia('(max-width: 480px)');
    matchMedia.addEventListener('change', (e) => {
      setIsMobile(e.matches);
    });
    setIsiphone(/iphone/i.test(navigator.userAgent));
    setIsMobile(document.documentElement.clientWidth <= 480);
    getDownloadLink();
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('resize', handleLiveSlideMobileAppImgLoad);
    };
  }, []);

  useEffect(() => {
    if (window.location.href.indexOf('channelCode') > 0) {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = '//web.cdn.openinstall.io/openinstall.js';
      s.addEventListener(
        'load',
        () => {
          var data = window.OpenInstall.parseUrlParams();
          new window.OpenInstall(
            {
              appKey: 'lo4wd3', //appkey参数配置,需要自行替换对应的appkey
              onready: function () {
                m = this;
                m.schemeWakeup({ data: data, channelCode: data?.channelCode });
              },
            },
            data,
          );
        },
        false,
      );
      document.head.appendChild(s);
    }
  }, []);
  // @ts-ignore
  const publicPath = isServer ? '/' : window.publicPath;

  return (
    <div
      className={styles.download_wrap}
      style={headerVisible ? { top: 0, height: '100%', zIndex: 1000 } : {}}
    >
      <ReactPageScroller
        customPageNumber={curPage}
        onBeforePageScroll={handleBeforeChange}
        pageOnChange={handlePageChange}
        animationTimer={600}
        blockScrollUp={block}
        blockScrollDown={block}
      >
        <div className={styles.panel} onClick={handlePanelClick}>
          <div className={styles.first}>
            {!isMobile ? (
              <video
                className={`${styles.bgVideo} ${styles.video}`}
                src={`${publicPath}download_first_slide_bg.mp4`}
                muted
                autoPlay
                loop
                controls={false}
              />
            ) : (
              <img
                className={`${styles.bgVideo} ${styles.gif}`}
                src={require('@/assets/download_bg.png')}
                // src={require('@/assets/download_bg.png')}
                alt=""
              />
            )}
            <div className={styles.contentWrapper}>
              <div className={styles.left}>
                <img src={firstSlideWaveImg} alt="" className={styles.waveImg} />
                <img src={firstSlideAppImg} alt="" className={styles.appImg} />
                <img src={mobileFirstSlideAppImg} alt="" className={styles.mobileAppImg} />
                <img src={mobileFirstSlideArcImg} alt="" className={styles.mobileArcImg} />
                <div className={styles.shape} />
              </div>
              <div className={styles.right}>
                <img src={pageConfig.logo_dark} alt="" className={styles.logoImg} />
                <img src={pageConfig.min_logo} alt="" className={styles.mobileLogoImg} />
                <div className={styles.desc}>
                  <FormattedMessage id="key_watch_slogon" />
                </div>
                {isMobile ? (
                  <div className={styles.mobile_btns}>
                    {isiphone ? (
                      <AppleBtn
                        onClick={(e: any) => {
                          e.preventDefault();
                          e.stopPropagation();
                          reportDownload(REPORT_ACTION.download_first_screen_download);
                          goStore();
                        }}
                      />
                    ) : (
                      <>
                        <GooglePlayBtn
                          onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            reportDownload(REPORT_ACTION.download_first_screen_download);
                            goStore('google');
                          }}
                        />
                        <DownloadNowBtn
                          onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            reportDownload(REPORT_ACTION.download_first_screen_download);
                            goStore();
                          }}
                        />
                      </>
                    )}
                  </div>
                ) : null}
                <div className={styles.qrWrapper}>
                  <div className={styles.item}>
                    {!showIOS ? (
                      <img
                        onClick={(e) => handleQrClick(e, 'iOS')}
                        src={android_download}
                        alt=""
                        className={styles.img}
                      />
                    ) : (
                      <AndroidDownloadQrCode
                        link={APP_STORE_LINK}
                        onClick={(e) => handleQrClick(e, 'iOS')}
                        style={{ width: '25.35vh', padding: '.5vh' }}
                      />
                    )}
                    <div className={styles.text}>
                      {pageConfig.download_text} <FormattedMessage id="key_ios_client2" />
                    </div>
                  </div>
                  <div className={styles.item}>
                    {!showAndroid ? (
                      <img
                        onClick={(e) => handleQrClick(e, 'Android')}
                        src={ios_download}
                        alt=""
                        className={styles.img}
                      />
                    ) : (
                      <AndroidDownloadQrCode
                        link={androidDownloadLink || GOOGLE_PLAY_LINK}
                        onClick={(e) => handleQrClick(e, 'Android')}
                        style={{ width: '25.35vh', padding: '.5vh' }}
                      />
                    )}
                    <div className={styles.text}>
                      {pageConfig.download_text} <FormattedMessage id="key_android_client2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.panel} onClick={handlePanelClick}>
          <div className={styles.match}>
            <div className={styles.bg}>
              <div className={styles.topTriangle} />
              <div className={styles.bottomTriangle} />
              <div className={styles.picWrapper}>
                <img src={matchSlideBgImg} alt="" className={styles.pic} />
                <div className={styles.mask} />
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.title}>
                <FormattedMessage id="key_realtime_match" />
              </div>
              <div className={styles.desc}>
                <FormattedMessage id="key_download_multi_leagues" />
              </div>
            </div>
            <div className={styles.showcase}>
              <img src={matchSlideAppImg} alt="" className={styles.appImg} />
              <img src={matchSlideWebImg} alt="" className={styles.webImg} />
            </div>
          </div>
        </div>
        <div className={styles.panel} onClick={handlePanelClick}>
          <div className={styles.live}>
            <div className={styles.info}>
              <div className={styles.title}>
                <span className={styles.colorful}>
                  <FormattedMessage id="key_live_animation" /> /
                </span>
                &nbsp;
                <FormattedMessage id="key_live_video" />
              </div>
              <div className={styles.desc}>
                <FormattedMessage id="key_download_match_progress" />
              </div>
            </div>
            <div className={styles.showcase}>
              <div className={styles.left}>
                <div className={styles.bottomBox} />
                <div className={styles.topBox}>
                  {!isMobile ? (
                    <video
                      controls={false}
                      autoPlay
                      muted
                      loop
                      className={styles.video}
                      src={`${publicPath}download_live_slide_video.mp4`}
                    />
                  ) : null}
                  {!isMobile ? (
                    <video
                      controls={false}
                      autoPlay
                      muted
                      loop
                      className={styles.video}
                      src={`${publicPath}download_live_slide_animation.mp4`}
                    />
                  ) : null}
                </div>
              </div>
              <div className={styles.right}>
                <img
                  className={styles.img}
                  alt=""
                  ref={liveSlideMobileAppImgRef}
                  onLoad={handleLiveSlideMobileAppImgLoad}
                  src={liveSlideAppImg}
                />
                <img
                  className={styles.video}
                  src={mobileLiveSlideVideoImg}
                  alt=""
                  style={{
                    width: `${liveSlideMobileVideoWidth}px`,
                    height: `${liveSlideMobileVideoHeight}px`,
                    left: `${liveSlideMobileVideoLeft}px`,
                    top: `${liveSlideMobileVideoTop}px`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.panel}>
          <div className={styles.information}>
            <div className={styles.info}>
              <div className={styles.title}>
                <FormattedMessage id="key_comprehensive_database" />
              </div>
              <div className={styles.desc}>
                <FormattedMessage id="key_download_multi_data" />
              </div>
            </div>
            <div className={styles.bg} />
            <img src={infoSlideAppImg} alt="" className={styles.img} />
            <div className={styles.footer}>
              <div className={styles.pc}>
                <div className={styles.item}>
                  <div className={styles.imgWrapper}>
                    <AndroidDownloadQrCode link={APP_STORE_LINK} style={{ padding: '.3vh' }} />
                  </div>
                  <a className={styles.btn} href={APP_STORE_LINK} target="_blank" rel="noreferrer">
                    <img className={styles.icon} alt="" src={footerSlideIOSIcon} />
                    <FormattedMessage id="key_ios_client2" />
                  </a>
                </div>
                <div className={styles.item}>
                  <div className={styles.imgWrapper}>
                    <AndroidDownloadQrCode
                      link={androidDownloadLink || GOOGLE_PLAY_LINK}
                      style={{ padding: '.3vh' }}
                    />
                  </div>
                  <a
                    className={styles.btn}
                    href={androidDownloadLink || GOOGLE_PLAY_LINK}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img className={styles.icon} alt="" src={footerSlideAndroidIcon} />
                    <FormattedMessage id="key_android_client2" />
                  </a>
                </div>
              </div>
              <div className={styles.mobile}>
                <div className={styles.mobile_btns} style={{ margin: '0 auto' }}>
                  {isiphone ? (
                    <AppleBtn
                      onClick={(e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                        reportDownload(REPORT_ACTION.download_last_screen_download);
                        goStore();
                      }}
                    />
                  ) : (
                    <>
                      <GooglePlayBtn
                        onClick={(e: any) => {
                          e.preventDefault();
                          e.stopPropagation();
                          reportDownload(REPORT_ACTION.download_last_screen_download);
                          goStore('google');
                        }}
                      />
                      <DownloadNowBtn
                        onClick={(e: any) => {
                          e.preventDefault();
                          e.stopPropagation();
                          reportDownload(REPORT_ACTION.download_last_screen_download);
                          goStore();
                        }}
                      />
                    </>
                  )}
                </div>
                {/* <img src={mobileFirstSlideLogoImg} alt="" className={styles.logo} />
                <div
                  className={styles.btn}
                  onClick={() => {
                    reportDownload(REPORT_ACTION.download_last_screen_download);
                    goStore();
                  }}
                >
                  <FormattedMessage id="key_download_now" />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </ReactPageScroller>
    </div>
  );
}
