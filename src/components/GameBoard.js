import React, { useState, useEffect, useRef } from 'react';
import Paddle from './Paddle';
import Ball from './Ball';
import Brick from './Brick';
 
function GameBoard() {
  const [ballX, setBallX] = useState(250);  // Ball's position
  const [ballY, setBallY] = useState(290);  // Ball's position Start closer to the paddle
  const [ballDX, setBallDX] = useState(2);  // Ball's movement deltas
  const [ballDY, setBallDY] = useState(-2); // Ball's movement deltas
  const [paddleX, setPaddleX] = useState(200);  // Paddle's horizontal position
  const [level, setLevel] = useState(0);  // Current game level
  const [score, setScore] = useState(0);  // Initialize player score
  const [bricks, setBricks] = useState([]);  // Array of bricks
  const [lives, setLives] = useState(5);  // Initialize lives to 5
  const [gameStarted, setGameStarted] = useState(false);  // Track if game has started
  const [gamePaused, setGamePaused] = useState(false);  // Track if game is paused
  const [gameWon, setGameWon] = useState(false);  // Track if game is won
  const paddleWidth = 100;
  const paddleHeight = 20; // Added paddle height 
 
  useEffect(() => {
    if (gameStarted) {
      initializeBricks();
    }
  }, [level, gameStarted]);
 
  const initializeBricks = () => {
    const rows = level; // Number of rows equals current level
    const newBricks = Array.from({ length: rows }, (_, row) =>
      Array.from({ length: 8 }, (_, col) => ({
        x: col * 60 + 10,
        y: row * 30 + 10,
        status: 1,
      }))
    );
    setBricks(newBricks);
  };
 
  const handleKeyDown = (e) => {
    if (!gamePaused) { // Allow paddle movement only if game is not paused
      if (e.key === 'ArrowRight') {
        setPaddleX((prevX) => Math.min(prevX + 20, 500 - paddleWidth));
      } else if (e.key === 'ArrowLeft') {
        setPaddleX((prevX) => Math.max(prevX - 20, 0));
      }
    }
    if (e.key === ' ') { // Use spacebar key for pausing and resuming
      setGamePaused(!gamePaused);
    }
  };
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [gamePaused]);
  const updateBall = () => {
    if (!gameStarted || gamePaused) return;
    let newBallX = ballX + ballDX;
    let newBallY = ballY + ballDY;
 
    // Check for collision with walls
    if (newBallX > 490 || newBallX < 0) {
      setBallDX(-ballDX);
    }
    if (newBallY < 0) {
      setBallDY(-ballDY);
    }
 
    // Check for collision with paddle
    if (
      newBallY + ballDY > 400 - paddleHeight && // Updated to use paddleHeight
      newBallX > paddleX &&
      newBallX < paddleX + paddleWidth
    ) {
      setBallDY(-ballDY);
      newBallY = 400 - paddleHeight - 1; // Adjust position to avoid getting stuck
    }
 
    // Check if ball missed the paddle
    if (newBallY > 400) {
      setLives(lives - 1); // Decrease lives when the ball misses the paddle
      // Reset ball position
      setBallX(250);
      setBallY(290);
      setBallDX(2);
      setBallDY(-2);
 
      if (lives - 1 === 0) {
        // Game over logic when lives reach zero
        alert('Game Over');
        resetGame();
      }
    }
 
    // Check for collision with bricks
    bricks.forEach(row => {
      row.forEach(brick => {
        if (brick.status === 1) {
          if (newBallX > brick.x && newBallX < brick.x + 50 && newBallY > brick.y && newBallY < brick.y + 20) {
            setBallDY(-ballDY);
            brick.status = 0;
            setScore(score + 20); // Increase score when a brick is hit
          }
        }
      });
    });
 
    // Check for level completion
    if (bricks.flat().every(brick => brick.status === 0)) {
      if (level < 10) {
        setLevel(level + 1);
      } else {
        // Set gameWon to true when all levels are completed
        setGameWon(true);
      }
    }
 
    setBallX(newBallX);
    setBallY(newBallY);
  };
 
  const intervalRef = useRef(null);
 
  useEffect(() => {
    if (gameStarted) {
      intervalRef.current = setInterval(updateBall, 10);
    }
    return () => clearInterval(intervalRef.current);
  }, [gameStarted, ballX, ballY, bricks, gamePaused]);
 
  const startGame = () => {
    setGameStarted(true);
    setLevel(1);
    setScore(0);
    setLives(5);
    initializeBricks();
    setGameWon(false); // Reset gameWon state
  };
 
  const resetGame = () => {
    setGameStarted(false);
    setLevel(1);
    setScore(0);
    setLives(5); // Reset lives to 5
    initializeBricks();
    setBallX(250);
    setBallY(290);
    setBallDX(2);
    setBallDY(-2);
    setGameWon(false); // Reset gameWon state
  };
 
  return (
    <div className="game-container">
      <h1><u>Break out Game</u></h1>
      <div className="game-info">
        <span>Level: {level}</span>
        <span>Score: {score}</span>
        <span>Lives: {'❤️'.repeat(lives)}</span>
      </div>
      <div className="game-board">
        <Paddle x={paddleX} />
        <Ball x={ballX} y={ballY} />
        {bricks.map((row, rowIndex) =>
          row.map((brick, colIndex) =>
            brick.status === 1 ? <Brick key={`${rowIndex}-${colIndex}`} x={brick.x} y={brick.y} /> : null
          )
        )}
      </div>
      {!gameStarted && !gameWon && (
        <div className="start-button-container">
          <button id="startButton" onClick={startGame}>Start Game</button>
        </div>
      )}
      {gameWon && (
        <div className="game-won-message">
          <h2>Congratulations, You Won!</h2>
        </div>
      )}
      {gameStarted && !gameWon && (
        <div className="pause-button-container">
          <button id="pauseButton" onClick={() => setGamePaused(!gamePaused)}>
            {gamePaused ? 'Resume' : 'Pause'}
          </button>
        </div>
      )}
    </div>
  );
}
 
export default GameBoard;
 
