import styles from './index.less';
import timeIcon from '@/assets/icon/news_info_time.png';
import viewerIcon from '@/assets/icon/news_info_eye.png';
import supporterIcon from '@/assets/icon/news_info_support.png';
import type { CSSProperties } from 'react';
import { FormattedMessage } from '@@/plugin-locale/localeExports';
import { toHumanReadableLocaleStr, toShortLangCode } from '@/utils/utils';
import { history } from 'umi';
import { locale } from '@/app';
import { isServer } from '@/utils/env';

export default function News(props: {
  id: string;
  title: string;
  thumb: string;
  publishedAt: number | Date;
  viewer: number;
  supporter: number;
  borderTop?: boolean;
  borderBottom?: boolean;
  hideInfo?: boolean;
  noPaddingTop?: boolean;
  noPaddingBottom?: boolean;
  openNewWindow?: boolean;
  hideTime?: boolean;
  hideViewer?: boolean;
  hideSupporter?: boolean;
  replaceCurrent?: boolean;
  onClick?: (id: string) => void;
  coverRight?: boolean;
  style?: CSSProperties;
  titleHoverEffect?: boolean;
  seq?: number;
}) {
  const handleClick = () => {
    const lang = toShortLangCode(locale.getLocale());
    const path = `/${lang}/newsdetail/${props.id}`;
    props.onClick?.(props.id);
    if (props.openNewWindow) {
      window.open(path);
    } else if (props.replaceCurrent) {
      window.location.href = path;
    } else {
      history.push(path);
    }
  };
  const style: CSSProperties = props.style || {};
  if (props.borderTop) {
    style.borderTop = '1px solid #fafafa';
  }
  if (props.borderBottom) {
    style.borderBottom = '1px solid #fafafa';
  }
  if (props.noPaddingTop) {
    style.paddingTop = '0';
  }
  if (props.noPaddingBottom) {
    style.paddingBottom = '0';
  }
  let seqCls = '';
  if (props.seq === 1) {
    seqCls = styles.urgent;
  } else if (props.seq === 2) {
    seqCls = styles.important;
  } else if (props.seq === 3) {
    seqCls = styles.normal;
  }
  const time = toHumanReadableLocaleStr(props.publishedAt);
  return <div className={`${styles.wrapper} ${props.coverRight ? styles.reverse : ''} ${props.titleHoverEffect ? styles.hoverEffect : ''}`} style={style} onClick={handleClick}>
    <div className={styles.thumb} style={{backgroundImage: `url(${props.thumb})`}}>
      {typeof props.seq === 'number' && <div className={`${styles.seq} ${seqCls}`}>{props.seq}</div>}
    </div>
    <div
      className={`${styles.content} ${props.hideInfo ? styles.noInfo : ''}`}>
      <div className={styles.title}>{props.title}</div>
      {!props.hideInfo ? <div className={styles.info}>
        {!props.hideTime ? <div className={styles.item}>
          <img src={timeIcon} alt='' className={styles.iconImg} />
          <div className={`${styles.text} ${styles.timeText}`}>
            {!isServer ? <>
              &nbsp;{time.num > 0 ? time.num : ''}&nbsp;
              <FormattedMessage id={time.localeStr} />
            </> : null}
          </div>
        </div> : null}
        {!props.hideViewer ?
          <div className={`${styles.item} ${styles.viewer}`} style={props.hideTime ? { marginLeft: '0' } : undefined}>
            <img src={viewerIcon} alt='' className={styles.iconImg} />
            <div className={styles.text}>{!isServer ? props.viewer : ''}</div>
          </div> : null}
        {!props.hideSupporter ? <div className={`${styles.item} ${styles.support}`}>
          <img src={supporterIcon} alt='' className={styles.iconImg} />
          <div className={styles.text}>{!isServer ? props.supporter : ''}</div>
        </div> : null}
      </div> : null}
    </div>
  </div>;
}
