import React from 'react';

import { createFromIconfontCN } from '@ant-design/icons';
import { checkIsPhone } from '@/utils/utils';

const Icon = createFromIconfontCN({
  // scriptUrl: '//at.alicdn.com/t/font_3253601_1csquzs61fl.js',
  scriptUrl: '/iconfont.js',
});

const Iconfont = ({ type, size = 12, color = '#000', spin = false, className, onClick }) => {
  return (
    <Icon
      type={type}
      style={{ fontSize: checkIsPhone() ? size / 3.75 + 'vw' : size, color, display: 'block' }}
      spin={spin}
      className={className}
      onClick={onClick}
    />
  );
};

export default Iconfont;
