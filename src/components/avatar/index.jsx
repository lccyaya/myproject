import React, { useEffect, useState } from 'react';
import { checkIsPhone } from '@/utils/utils';
import defaultAvatar from '@/assets/icon/avatar.svg';

const Avatar = ({ size = 40, src = '', className = '', onClick = undefined }) => {
  return (
    <div
      onClick={onClick}
      style={Object.assign(
        {
          width: checkIsPhone() ? (size / 375) * 100 + 'vw' : size + 'px',
          height: checkIsPhone() ? (size / 375) * 100 + 'vw' : size + 'px',
          borderRadius: '50%',
          overflow: 'hidden',
        },
        onClick ? { cursor: 'pointer' } : {},
      )}
      className={className}
    >
      <img
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        src={src || defaultAvatar}
        alt=""
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src = defaultAvatar;
        }}
      />
    </div>
  );
};

export default Avatar;
