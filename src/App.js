/**
 * Tic Tac Toe Game (React)
 *
 * This file defines a simple Tic Tac Toe game with time travel functionality.
 * It includes three main components: Game, Board, and Square.
 */

// React Hook
import { useState } from "react";

/**
 * Square Component
 * Renders a single square with a value ("X", "O", or null).
 * Props:
 * - value: the symbol to display
 * - onSquareClick: function to call when the square is clicked
 */
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

/**
 * Board Component
 * Manages and displays the game board.
 * Props:
 * - xIsNext: boolean indicating whether it's X's turn
 * - squares: array of 9 values representing the board
 * - onPlay: callback function to handle a move
 */
function Board({ xIsNext, squares, onPlay }) {
  /**
   * Handles clicking a square.
   * - Ignores clicks on already filled or winning squares.
   * - Sets the square to X or O based on the current turn.
   * - Calls onPlay with the updated board.
   */
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice(); // shallow copy
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  // Display winner or next player
  const winner = calculateWinner(squares);
  const status = winner
    ? "Winner: " + winner
    : "Next player: " + (xIsNext ? "X" : "O");

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
      <div className="status">{status}</div>
    </>
  );
}

/**
 * Game Component (Main)
 * Manages game state, move history, and renders the board + move list.
 */
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]); // list of board states
  const [currentMove, setCurrentMove] = useState(0); // current index in history

  const xIsNext = currentMove % 2 === 0; // true if even move index
  const currentSquares = history[currentMove];

  /**
   * Called after a move is made.
   * - Truncates history if we're jumping back.
   * - Adds new board state.
   * - Updates move counter.
   */
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  /**
   * Sets currentMove to a specific index to "jump" to that point in history.
   */
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Map over history to render move list buttons
  const moves = history.map((squares, move) => {
    const description = move > 0 ? `Go to move #${move}` : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

/**
 * calculateWinner
 * Determines if a player has won.
 * @param squares array of 9 board values
 * @returns "X", "O", or null
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
