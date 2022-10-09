import React from 'react';
import styles from './index.less';
import classnames from 'classnames';

type Props = {
  title?: string;
  subTitle?: string;
  required?: boolean;
  type?: 'horizontal' | 'vertical';
};

const FormField: React.FC<Props> = (props) => {
  const { title, subTitle, required, type } = props;

  return (
    <div
      className={classnames(
        styles.field_box,
        type == 'vertical' ? styles.field_box_vertical : null,
      )}
    >
      <div className={styles.field_title_box}>
        <div>
          {required ? <span className={styles.required_icon}>*</span> : null}
          <span className={styles.field_title}>{title}</span>
        </div>
        <div className={styles.field_subtitle}>{subTitle}</div>
      </div>
      <div>{props.children}</div>
    </div>
  );
};

export default FormField;
