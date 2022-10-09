import React, { useState, useEffect, useLayoutEffect } from 'react';
export const useCheckScroll = (height) => {
  const [isScroll, setIsScroll] = useState(false);
  const checkIsScroll = () => {
    setIsScroll(height > document.documentElement.clientHeight);
  };
  useEffect(() => {
    window.addEventListener('resize', checkIsScroll, false);
    return () => {
      window.removeEventListener('resize', checkIsScroll, false);
    };
  }, []);
  useLayoutEffect(() => {
    checkIsScroll();
  }, [height]);
  return { isScroll };
};
