import React from 'react';

const Text = ({
  numberOfLines = 1,
  fontSize = 12,
  text = '',
  width = '100%',
  color = '#171717',
}) => {
  return (
    <div
      style={{
        width,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        wordBreak: 'break-all',
        WebkitLineClamp: numberOfLines,
        fontSize,
        color,
      }}
    >
      {text}
    </div>
  );
};

export default Text;
