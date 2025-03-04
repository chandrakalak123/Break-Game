import React from 'react';

const Brick = ({ x, y }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: '50px',
        height: '20px',
        backgroundColor: 'green',
      }}
    />
  );
};

export default Brick;
