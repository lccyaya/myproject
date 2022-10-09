import React from 'react';
import classnames from 'classnames';
import styles from './index.less';
import { Steps } from 'antd-mobile';
import IconFont from '@/components/IconFont';
import { useSelector } from 'umi';
import { ConnectState } from '@/models/connect';
import { UserInfoType } from '@/services/user';
import { ExpertStatus } from '@/utils/scheme';

type Props = {
  status?: string;
  className?: string;
};

const ApplicationSteps: React.FC<Props> = (props) => {
  const { status } = props;
  return (
    <div className={classnames(props.className, styles.container)}>
      <div className={styles.steps_box}>
        <div className={styles.item_box}>
          <IconFont type="icon-wancheng" color="#FFFFFF" size={26} />
          <div className={styles.title}>身份认证</div>
        </div>
        <div className={styles.line}></div>
        <div className={styles.item_box}>
          <IconFont
            type={
              status == ExpertStatus.Invalid || status == ExpertStatus.Accept
                ? 'icon-wancheng'
                : 'icon-weiwancheng'
            }
            color="#FFFFFF"
            size={26}
          />
          <div className={styles.title}>内容审核</div>
        </div>
        <div className={styles.line}></div>
        <div className={styles.item_box}>
          <IconFont
            type={status == ExpertStatus.Accept ? 'icon-wancheng' : 'icon-weiwancheng'}
            color="#FFFFFF"
            size={26}
          />
          <div className={styles.title}>申请结果</div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSteps;
