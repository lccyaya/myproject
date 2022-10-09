import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { checkIsPhone } from '@/utils/utils';

const IconFont = createFromIconfontCN({
  scriptUrl: '/iconfont.js',
});

type IconFontProps = {
  type: string;
  className?: string;
  color?: string;
  size?: number;
  onClick?: any;
};

const IconFontComponent: React.FC<IconFontProps> = (props) => {
  const { className, type, color, size, onClick = () => {} } = props;
  return (
    <IconFont
      className={className}
      type={type}
      onClick={onClick}
      style={{
        color,
        // fontSize: checkIsPhone() ? size / 3.75 + 'vw' : size + 'px',
        fontSize: size + 'px',
      }}
    />
  );
};
export default IconFontComponent;
