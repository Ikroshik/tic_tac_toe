import { useState } from "react";

// функция, отвечающая за клетку, котарая принимает в себя крестик или нолик, и функцию клика по клетке
function Square({ value, onSquareClick, className }) {
  return (
    <button
      className={className}
      onClick={onSquareClick}
    >
      { value }
    </button>
  )
}

// функция доски для игры в "крестики нолики", в ней: 
// создается поле, записывается в клетку крестик или нолик(в зависимости от хода), считывается победитель или ничья
function Board({ xIsNext, squares, onPlay }) {

  // функция рендеринга крестика или нолика, и определения победителя
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "X"
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = "Winner: " + (!xIsNext ? "X" : "O");
  } else if (squares.every(square => square)) {
    status = "It's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O")
  }
  const winnerLine = calculateWinner(squares);

  const boardRows = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      const isWinnerSquare = winnerLine && winnerLine.includes(index); // Check if the square is part of the winning line
      row.push(
        <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)}  className={isWinnerSquare ? 'square winner' : 'square'} />
      )
    }
    boardRows.push(<div key={i} className="board-row">{row}</div>)
    
  }

  return (
    <>
      <div className="status">{ status }</div>
      {boardRows}
    </>
  );
}

// мейн функция для реакта(помечается как 'default'), котоая говорит реакту использовать её как "top-level component",
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(false); 
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // функция, которая вызывается Boardом для ре-рендеринга игры
  function handleplay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    
    if (move > 0) {
      const prevSquares = history[move - 1];
      const diffIndex = squares.findIndex((square, index) => square !== prevSquares[index]);
      const row = Math.floor(diffIndex / 3)+1;
      const col = (diffIndex % 3)+1;
      var curMoveText = `You are at move ${move} (${row}, ${col})`;
      description = `Go to move #${move} (${row}, ${col})`;
    } else {
      description = "Go to game start";
    }
    
    
    if (move === currentMove) {
      return (
        <li key={move}>
          <div>{curMoveText}</div>
        </li>
      );
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const sortedMoves = isAscending ? moves.slice().reverse() : moves.slice();
  function sort() {
    setIsAscending(!isAscending);
    return sortedMoves
  }
  
  return (
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handleplay} />
        </div>
        <div className="game-info">
          <button onClick={sort}>Sort</button>
          <div>{ sortedMoves }</div>
        </div>
      </div>
  )
}

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
      
      return lines[i]
    }
    
    
  }
  return null
}
