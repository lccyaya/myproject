import { checkIsPhone } from '@/utils/utils';
import React, { useEffect, useState } from 'react';

const PageError = () => {
  return <></>;
};

const Page = ({ pc, mobile }) => {
  const [deviceType, setDeviceType] = useState('');
  useEffect(() => {
    if (checkIsPhone()) {
      setDeviceType('mobile');
    } else {
      setDeviceType('pc');
    }
  }, []);
  if (deviceType === 'pc') {
    return <>{pc}</>;
  } else if (deviceType === 'mobile') {
    return <>{mobile}</>;
  } else {
    return <PageError />;
  }
};

Page.defaultProps = {
  pc: <>pc页面</>,
  moile: <>手机页面</>,
};

export default Page;
