
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Trophy, Users } from 'lucide-react';

type Player = 'X' | 'O' | null;
type Board = Player[];

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  const checkWinner = (board: Board): Player => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const isBoardFull = (board: Board): boolean => {
    return board.every(cell => cell !== null);
  };

  useEffect(() => {
    const gameWinner = checkWinner(board);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameOver(true);
      setScores(prev => ({
        ...prev,
        [gameWinner]: prev[gameWinner] + 1
      }));
    } else if (isBoardFull(board)) {
      setGameOver(true);
      setScores(prev => ({
        ...prev,
        draws: prev.draws + 1
      }));
    }
  }, [board]);

  const handleCellClick = (index: number) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setGameOver(false);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
    resetGame();
  };

  const getStatusMessage = () => {
    if (winner) {
      return `🎉 Player ${winner} wins!`;
    } else if (gameOver) {
      return "🤝 It's a draw!";
    } else {
      return `Player ${currentPlayer}'s turn`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto shadow-2xl bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <Users className="h-8 w-8 text-purple-600" />
            Tic Tac Toe
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Score Board */}
          <div className="flex justify-center space-x-4">
            <Badge variant="outline" className="text-lg px-3 py-1 bg-blue-50">
              X: {scores.X}
            </Badge>
            <Badge variant="outline" className="text-lg px-3 py-1 bg-red-50">
              O: {scores.O}
            </Badge>
            <Badge variant="outline" className="text-lg px-3 py-1 bg-gray-50">
              Draws: {scores.draws}
            </Badge>
          </div>

          {/* Status */}
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-800 mb-2">
              {getStatusMessage()}
            </div>
            {winner && (
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto animate-bounce" />
            )}
          </div>

          {/* Game Board */}
          <div className="grid grid-cols-3 gap-2 aspect-square max-w-sm mx-auto">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={gameOver || cell !== null}
                className={`
                  aspect-square rounded-lg border-2 border-gray-300 
                  text-4xl font-bold transition-all duration-200 
                  hover:scale-105 hover:shadow-lg active:scale-95
                  ${cell === 'X' 
                    ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg' 
                    : cell === 'O' 
                    ? 'bg-gradient-to-br from-red-400 to-red-600 text-white shadow-lg'
                    : 'bg-white hover:bg-gray-50'
                  }
                  ${gameOver || cell ? 'cursor-default' : 'cursor-pointer'}
                  disabled:opacity-75
                `}
              >
                {cell}
              </button>
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={resetGame}
              variant="outline"
              size="lg"
              className="flex items-center gap-2 bg-white hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" />
              New Game
            </Button>
            <Button 
              onClick={resetScores}
              variant="outline"
              size="lg"
              className="bg-white hover:bg-gray-50"
            >
              Reset Scores
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicTacToe;
