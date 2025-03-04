import React from 'react';

const Paddle = ({ x }) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '0px',
        left: `${x}px`,
        width: '100px',
        height: '20px',
        backgroundColor: 'blue',
      }}
    />
  );
};

export default Paddle;
