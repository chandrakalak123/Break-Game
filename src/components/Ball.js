import React from 'react';

const Ball = ({ x, y }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`, // Adjust position to center the ball
        top: `${y}px`, // Adjust position to center the ball
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: 'red',
      }}
    />
  );
};

export default Ball;
