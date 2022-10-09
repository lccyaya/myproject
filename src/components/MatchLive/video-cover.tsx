import playIcon from '@/assets/icon/play.svg';
import styles from './index.less';
import { FormattedMessage } from 'react-intl';
import React, { useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import { Checkbox } from 'antd';
import MModal from '@/components/Modal';
import { FOOTBALL_DISMISS_LIVE_RISK } from '@/constants';
import { formatDuration } from '@/utils/utils';
import { covers } from './video-cover-img';


// function getCover() {
//   const index = Math.floor(Math.random() * covers.length);
//   return covers[index];
// }

function Cover(props: {
  matchId: number;
  onPlayClick: () => void;
  onPlay: () => void;
  src?: string;
  duration?: number;
  showHighlightTag?: boolean;
  dontNeedDismissLiveRisk?: boolean;
  hideTipText?: boolean;
  height?: string;
}) {
  const bg = props.src || covers[props.matchId % covers.length];
  const [tipVisible, setTipVisible] = useState(false);
  const [noMoreTip, setNoMoreTip] = useState(true);
  const onHintsChange = () => {
    setNoMoreTip(p => !p);
  }
  const onConfirmHandler = () => {
    if (noMoreTip) {
      localStorage.setItem(FOOTBALL_DISMISS_LIVE_RISK, 'yes');
    } else {
      localStorage.removeItem(FOOTBALL_DISMISS_LIVE_RISK);
    }
    setTipVisible(false);
    props.onPlay();
  };
  return <div className={styles.coverWrapper} style={{backgroundImage: `url(${bg})`, height: props.height || 'auto'}}>
    <div className={styles.contentWrapper}>
      <div className={styles.icon} onClick={() => {
        props.onPlayClick();
        if (props.dontNeedDismissLiveRisk || localStorage.getItem(FOOTBALL_DISMISS_LIVE_RISK) === 'yes') {
          props.onPlay();
        } else {
          setTipVisible(true);
        }
      }}>
        <img src={playIcon} alt='play' />
      </div>
      {!props.hideTipText && <div className={styles.text}>
        <FormattedMessage id='key_click_watch_live' />
      </div>}
    </div>
    {props.showHighlightTag
      ? <div className={styles.highlightTag}>
        <div className={styles.lines}>
          <div className={styles.line} />
          <div className={styles.line} />
          <div className={styles.line} />
        </div>
        <div className={styles.text}>
          <FormattedMessage id='key_highlight' />
        </div>
      </div>
      : null
    }
    {props.duration
      ? <div className={styles.duration}>{formatDuration(props.duration)}</div>
      : null
    }
    <MModal
      title={useIntl().formatMessage({ id: 'key_disclaimer' })}
      visible={tipVisible}
      onCancel={() => { setTipVisible(false) }}
      onConfirm={onConfirmHandler}
    >
      <div className={styles.modalContentWrapper}>
        <div className={styles.tips}>
          <FormattedMessage id="key_video_risk_warning" />
        </div>
        <div onClick={onHintsChange}>
          <Checkbox
            className={styles.checkbox}
            checked={noMoreTip}>
            <FormattedMessage id="key_no_more_hints" />
          </Checkbox>
        </div>
      </div>
    </MModal>
  </div>
}

export default React.memo(Cover);
