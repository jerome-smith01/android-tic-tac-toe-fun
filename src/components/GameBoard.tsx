
import React from 'react';

type Player = 'X' | 'O' | null;
type Board = Player[];

interface GameBoardProps {
  board: Board;
  winner: Player;
  isActive: boolean;
  boardIndex: number;
  onCellClick: (boardIndex: number, cellIndex: number) => void;
  disabled: boolean;
  darkMode: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  winner,
  isActive,
  boardIndex,
  onCellClick,
  disabled,
  darkMode
}) => {
  const getBoardStyle = () => {
    if (winner) {
      return winner === 'X' 
        ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white' 
        : 'bg-gradient-to-br from-red-400 to-red-600 text-white';
    }
    if (isActive && !disabled) {
      return darkMode 
        ? 'border-4 border-yellow-400 bg-gray-800 shadow-lg shadow-yellow-400/20' 
        : 'border-4 border-yellow-400 bg-white shadow-lg';
    }
    if (disabled) {
      return darkMode 
        ? 'bg-gray-700 opacity-50' 
        : 'bg-gray-100 opacity-50';
    }
    return darkMode 
      ? 'bg-gray-800 border-2 border-gray-600' 
      : 'bg-white border-2 border-gray-300';
  };

  const getGridStyle = () => {
    return darkMode 
      ? 'gap-2' // Brighter gap in dark mode
      : 'gap-2'; // Brighter gap in light mode
  };

  return (
    <div className={`
      grid grid-cols-3 ${getGridStyle()} p-3 rounded-lg transition-all duration-300
      ${getBoardStyle()}
    `}>
      {winner ? (
        <div className="col-span-3 row-span-3 flex items-center justify-center text-6xl font-bold">
          {winner}
        </div>
      ) : (
        board.map((cell, cellIndex) => (
          <button
            key={cellIndex}
            onClick={() => onCellClick(boardIndex, cellIndex)}
            disabled={disabled || cell !== null}
            className={`
              aspect-square text-lg font-bold rounded-md transition-all duration-200
              hover:scale-105 active:scale-95
              ${cell === 'X' 
                ? 'bg-gradient-to-br from-blue-300 to-blue-500 text-white shadow-md' 
                : cell === 'O' 
                ? 'bg-gradient-to-br from-red-300 to-red-500 text-white shadow-md'
                : darkMode
                ? 'bg-gray-700 hover:bg-gray-600 border border-gray-500'
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-300'
              }
              ${disabled || cell ? 'cursor-default' : 'cursor-pointer'}
              disabled:opacity-75
            `}
          >
            {cell}
          </button>
        ))
      )}
    </div>
  );
};

export default GameBoard;
