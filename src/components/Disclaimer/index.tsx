import React, { useState, useEffect } from 'react';
import { Row, Modal, Button, Col } from 'antd';
import styles from './index.less';
import classnames from 'classnames';
import { useIntl } from 'umi';

export type DisclaimerProps = {
  open: boolean;
  close: () => void;
};

const Disclaimer: React.FC<DisclaimerProps> = (props) => {
  const intl = useIntl();
  const { open } = props;
  const [nomoreState, setNomoreState] = useState<boolean>(false);
  const onChangeNoMore = () => {
    const disclaimerParams = {
      hiddenDisclaimer: !nomoreState,
    };
    setNomoreState(disclaimerParams.hiddenDisclaimer);
    window.localStorage.setItem('NO__MORE___HINTS_NEXT___TIME', JSON.stringify(disclaimerParams));
  };

  useEffect(() => {
    const storedData = window.localStorage.getItem('NO__MORE___HINTS_NEXT___TIME');
    if (storedData) {
      const boolData = JSON.parse(storedData);
      setNomoreState(boolData.hiddenDisclaimer);
    } else {
      setNomoreState(false);
    }
  }, []);

  return (
    <Modal
      className={styles.disclaimerContainer}
      visible={open}
      width={546}
      footer={null}
      closable={false}
      bodyStyle={{ borderRadius: '16px' }}
      maskStyle={{ background: 'rgba(0,0,0,0.2)' }}
      centered={true}
    >
      <Row className={styles.modalTitle}>{intl.formatMessage({ id: 'key_disclaimer' })}</Row>
      <Row className={styles.modalSubtitle}>
        {intl.formatMessage({ id: 'key_video_risk_warning' })}
      </Row>
      <Row>
        <Col span={1}>
          <div className={styles.buttonBg} onClick={onChangeNoMore}>
            <div className={classnames(styles.button, nomoreState ? styles.buttonHighlight : '')} />
          </div>
        </Col>
        <Col span={23} className={styles.nomore}>
          {intl.formatMessage({ id: 'key_no_more_hints' })}
        </Col>
      </Row>
      <Row className={styles.modalFooter}>
        <Button className={styles.okButton} onClick={props.close} type="primary">
          {intl.formatMessage({ id: 'key_confirm' })}
        </Button>
      </Row>
    </Modal>
  );
};
export default Disclaimer;
