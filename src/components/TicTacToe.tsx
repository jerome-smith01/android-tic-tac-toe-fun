
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { RotateCcw, Trophy, Users, Info, Moon, Sun, User, Bot } from 'lucide-react';
import GameBoard from './GameBoard';

type Player = 'X' | 'O' | null;
type Board = Player[];
type MainBoard = (Player | 'DRAW')[];
type GameMode = 'pvp' | 'pvc';

const TicTacToe = () => {
  const [boards, setBoards] = useState<Board[]>(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [mainBoard, setMainBoard] = useState<MainBoard>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [activeBoardIndex, setActiveBoardIndex] = useState<number | null>(null);
  const [winner, setWinner] = useState<Player>(null);
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [showRules, setShowRules] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [isComputerTurn, setIsComputerTurn] = useState(false);

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

  const makeComputerMove = () => {
    if (gameOver || currentPlayer !== 'O' || gameMode !== 'pvc') return;

    // Find available moves
    const availableMoves: { boardIndex: number; cellIndex: number }[] = [];
    
    if (activeBoardIndex !== null) {
      // Must play in specific board
      if (mainBoard[activeBoardIndex] === null) {
        boards[activeBoardIndex].forEach((cell, cellIndex) => {
          if (cell === null) {
            availableMoves.push({ boardIndex: activeBoardIndex, cellIndex });
          }
        });
      }
    } else {
      // Can play in any available board
      boards.forEach((board, boardIndex) => {
        if (mainBoard[boardIndex] === null) {
          board.forEach((cell, cellIndex) => {
            if (cell === null) {
              availableMoves.push({ boardIndex, cellIndex });
            }
          });
        }
      });
    }

    if (availableMoves.length > 0) {
      const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      setTimeout(() => {
        handleCellClick(randomMove.boardIndex, randomMove.cellIndex);
      }, 500);
    }
  };

  const handleCellClick = (boardIndex: number, cellIndex: number) => {
    if (gameOver || mainBoard[boardIndex] !== null) return;
    if (activeBoardIndex !== null && activeBoardIndex !== boardIndex) return;
    if (boards[boardIndex][cellIndex] !== null) return;
    if (gameMode === 'pvc' && currentPlayer === 'O') return; // Prevent manual O moves in computer mode

    const newBoards = [...boards];
    newBoards[boardIndex] = [...boards[boardIndex]];
    newBoards[boardIndex][cellIndex] = currentPlayer;
    setBoards(newBoards);

    // Check if this board is won
    const boardWinner = checkWinner(newBoards[boardIndex]);
    if (boardWinner) {
      const newMainBoard = [...mainBoard];
      newMainBoard[boardIndex] = boardWinner;
      setMainBoard(newMainBoard);
    } else if (isBoardFull(newBoards[boardIndex])) {
      const newMainBoard = [...mainBoard];
      newMainBoard[boardIndex] = 'DRAW';
      setMainBoard(newMainBoard);
    }

    // Determine next active board
    const nextBoardIndex = cellIndex;
    if (mainBoard[nextBoardIndex] === null && !isBoardFull(newBoards[nextBoardIndex])) {
      setActiveBoardIndex(nextBoardIndex);
    } else {
      setActiveBoardIndex(null); // Player can choose any available board
    }

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  useEffect(() => {
    const gameWinner = checkWinner(mainBoard.map(cell => cell === 'DRAW' ? null : cell) as Board);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameOver(true);
      setScores(prev => ({
        ...prev,
        [gameWinner]: prev[gameWinner] + 1
      }));
    } else if (mainBoard.every(cell => cell !== null)) {
      setGameOver(true);
      setScores(prev => ({
        ...prev,
        draws: prev.draws + 1
      }));
    }
  }, [mainBoard]);

  useEffect(() => {
    if (gameMode === 'pvc' && currentPlayer === 'O' && !gameOver) {
      setIsComputerTurn(true);
      makeComputerMove();
    } else {
      setIsComputerTurn(false);
    }
  }, [currentPlayer, gameMode, gameOver, activeBoardIndex]);

  const resetGame = () => {
    setBoards(Array(9).fill(null).map(() => Array(9).fill(null)));
    setMainBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setActiveBoardIndex(null);
    setWinner(null);
    setGameOver(false);
    setIsComputerTurn(false);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
    resetGame();
  };

  const getStatusMessage = () => {
    if (winner) {
      return `🎉 Player ${winner} wins the ultimate game!`;
    } else if (gameOver) {
      return "🤝 Ultimate draw!";
    } else if (gameMode === 'pvc' && currentPlayer === 'O') {
      return "🤖 Computer is thinking...";
    } else if (activeBoardIndex !== null) {
      return `Player ${currentPlayer}'s turn - Must play in highlighted board`;
    } else {
      return `Player ${currentPlayer}'s turn - Choose any available board`;
    }
  };

  const isAvailableBoard = (boardIndex: number) => {
    if (mainBoard[boardIndex] !== null) return false;
    if (activeBoardIndex !== null) return boardIndex === activeBoardIndex;
    return true;
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen p-2 flex items-center justify-center transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800' 
        : 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500'
    }`}>
      <Card className={`w-full max-w-4xl mx-auto shadow-2xl backdrop-blur transition-colors duration-300 ${
        darkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95'
      }`}>
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDarkMode}
                className={darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : ''}
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className={`h-4 w-4 ${gameMode === 'pvp' ? 'text-blue-500' : 'text-gray-400'}`} />
                <Switch 
                  checked={gameMode === 'pvc'} 
                  onCheckedChange={(checked) => {
                    setGameMode(checked ? 'pvc' : 'pvp');
                    resetGame();
                  }}
                />
                <Bot className={`h-4 w-4 ${gameMode === 'pvc' ? 'text-green-500' : 'text-gray-400'}`} />
              </div>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {gameMode === 'pvp' ? 'vs Human' : 'vs Computer'}
              </span>
            </div>
          </div>

          <CardTitle className={`text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-2 flex-wrap`}>
            <Users className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
            Ultimate Tic Tac Toe
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRules(!showRules)}
              className={`ml-2 ${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : ''}`}
            >
              <Info className="h-4 w-4" />
            </Button>
          </CardTitle>
          
          {showRules && (
            <div className={`mt-4 p-4 rounded-lg text-sm text-left transition-colors duration-300 ${
              darkMode ? 'bg-gray-700/50' : 'bg-blue-50'
            }`}>
              <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>How to Play Ultimate Tic Tac Toe:</h3>
              <ul className={`space-y-1 text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• Win small boards to claim squares in the main board</li>
                <li>• Your move determines which board your opponent must play in next</li>
                <li>• If sent to a completed board, you can choose any available board</li>
                <li>• Win the main board to win the ultimate game!</li>
              </ul>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Score Board */}
          <div className="flex justify-center space-x-4">
            <Badge variant="outline" className={`text-lg px-3 py-1 ${
              darkMode ? 'bg-blue-900/30 border-blue-600 text-blue-300' : 'bg-blue-50'
            }`}>
              X: {scores.X}
            </Badge>
            <Badge variant="outline" className={`text-lg px-3 py-1 ${
              darkMode ? 'bg-red-900/30 border-red-600 text-red-300' : 'bg-red-50'
            }`}>
              O: {scores.O}
            </Badge>
            <Badge variant="outline" className={`text-lg px-3 py-1 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50'
            }`}>
              Draws: {scores.draws}
            </Badge>
          </div>

          {/* Status */}
          <div className="text-center">
            <div className={`text-lg md:text-xl font-semibold mb-2 ${
              darkMode ? 'text-gray-100' : 'text-gray-800'
            }`}>
              {getStatusMessage()}
            </div>
            {winner && (
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto animate-bounce" />
            )}
          </div>

          {/* Ultimate Game Board */}
          <div className={`grid grid-cols-3 gap-3 max-w-2xl mx-auto p-4 rounded-lg ${
            darkMode ? 'bg-gray-900/50' : 'bg-white/50'
          }`}>
            {boards.map((board, boardIndex) => (
              <GameBoard
                key={boardIndex}
                board={board}
                winner={mainBoard[boardIndex] === 'DRAW' ? null : mainBoard[boardIndex] as Player}
                isActive={isAvailableBoard(boardIndex)}
                boardIndex={boardIndex}
                onCellClick={handleCellClick}
                disabled={gameOver || !isAvailableBoard(boardIndex) || isComputerTurn}
                darkMode={darkMode}
              />
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3 justify-center flex-wrap">
            <Button 
              onClick={resetGame}
              variant="outline"
              size="lg"
              className={`flex items-center gap-2 ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <RotateCcw className="h-4 w-4" />
              New Game
            </Button>
            <Button 
              onClick={resetScores}
              variant="outline"
              size="lg"
              className={darkMode ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' : 'bg-white hover:bg-gray-50'}
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
