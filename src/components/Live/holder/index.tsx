import React, { useEffect, useState } from 'react';

import { Checkbox } from 'antd';

import PlayIcon from '@/assets/icon/play.svg';
import styles from './index.less';
import MModal from '@/components/Modal';
import { FOOTBALL_DISMISS_LIVE_RISK, REPORT_ACTION, REPORT_CATE } from '@/constants'
import { FormattedMessage } from 'react-intl';
import { useIntl } from 'umi';
import CallAppModal from '@/components/OpenApp/CallAppModal';
import type * as matchService from '@/services/match';
import { report } from '@/services/ad';

type IProps = {
  onPlay: () => void;
  immediately: boolean;
  match: matchService.MatchDetails;
};
const Channel: React.FC<IProps> = (props) => {
  const { match } = props;
  const [policyTipsVisible, setPolicyTipsVisible] = useState<boolean>(false);
  const [noMoreTip, setNoMoreTip] = useState<boolean>(true);

  const isHideRisk = localStorage.getItem(FOOTBALL_DISMISS_LIVE_RISK) === 'yes'

  useEffect(() => {
    if (props.immediately) {
      if (isHideRisk) {
        props.onPlay();
      } else {
        setPolicyTipsVisible(true);
      }
    }
  }, []);

  const onClickHandler = () => {
    if (isHideRisk) {
      props.onPlay();
    } else {
      setPolicyTipsVisible(true);
    }
    report({
      cate: /home/.test(window.location.pathname) ? REPORT_CATE.home : REPORT_CATE.match_detail,
      action: REPORT_ACTION.match_detail_watch_live,
    });
  }
  const onHintsChange = (e: any) => {
    setNoMoreTip(e.target.checked);
  }
  const onConfirmHandler = () => {
    if (noMoreTip) {
      localStorage.setItem(FOOTBALL_DISMISS_LIVE_RISK, 'yes');
    } else {
      localStorage.removeItem(FOOTBALL_DISMISS_LIVE_RISK);
    }
    setPolicyTipsVisible(false);
    props.onPlay();
  }
  return (
    <div className={styles.container}>
      <div className={styles.content} />
      <div className={styles.mask}>
        <CallAppModal title={useIntl().formatMessage({ id: 'key_download_free' })}>
          <div className={styles.play} onClick={onClickHandler}>
            <img className={styles.icon} src={PlayIcon} />
            <div className={styles.tip}>
              <FormattedMessage id={(match.has_live || match.has_live_animation) ? 'key_click_watch_live' : (match.playback_link ? 'key_click_playback' : 'key_click_watch_live')} />
            </div>
          </div>
        </CallAppModal>
      </div>
      <MModal
        title={useIntl().formatMessage({ id: 'key_disclaimer' })}
        visible={policyTipsVisible}
        onCancel={() => { setPolicyTipsVisible(false) }}
        onConfirm={onConfirmHandler}
      >
        <div className={styles.modalContent}>
          <div className={styles.tips}>
            <FormattedMessage id="key_video_risk_warning" />
          </div>
          <Checkbox className={styles.checkbox} checked={noMoreTip} onChange={onHintsChange}><FormattedMessage id="key_no_more_hints" /></Checkbox>
        </div>
      </MModal>
    </div>
  );
};

export default Channel;
