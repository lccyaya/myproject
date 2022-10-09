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
        WebkitLineClamp: numberOfLines,
        wordBreak: 'break-all',
        fontSize: fontSize / 3.75 + 'vw',
        color,
      }}
    >
      {text}
    </div>
  );
};

export default Text;
