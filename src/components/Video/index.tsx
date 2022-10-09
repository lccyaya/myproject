import React from 'react';
import { dynamic } from 'umi';

const renderLoading = () => <div></div>;

export default dynamic({
  loader: async () => {
    // 动态加载第三方组件
    const { default: DynamicComponent } = await import('./video');
    return DynamicComponent;
  },
  loading: () => renderLoading(),
});
