import { useState } from 'react'
import { Chess } from 'chess.js'
import './ChessBoard.css'

function ChessBoard() {
  const [game, setGame] = useState(new Chess())
  const [selectedSquare, setSelectedSquare] = useState(null)

  const handleSquareClick = (square) => {
    if (selectedSquare === null) {
      // First click - select the piece
      const piece = game.get(square)
      if (piece) {
        setSelectedSquare(square)
      }
    } else {
      // Second click - attempt to move
      try {
        game.move({
          from: selectedSquare,
          to: square,
          promotion: 'q' // Always promote to queen for simplicity
        })
        setGame(new Chess(game.fen())) // Force a re-render
      } catch (e) {
        // Invalid move
        console.log('Invalid move')
      }
      setSelectedSquare(null)
    }
  }

  const getSquareClass = (square) => {
    const isSelected = square === selectedSquare
    const isLight = (square.charCodeAt(0) + square.charCodeAt(1)) % 2 === 0
    return `square ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''}`
  }

  const renderBoard = () => {
    const board = game.board()
    return (
      <div className="chess-board">
        {board.map((row, i) => (
          <div key={i} className="board-row">
            {row.map((piece, j) => {
              const square = `${String.fromCharCode(97 + j)}${8 - i}`
              return (
                <div
                  key={square}
                  className={getSquareClass(square)}
                  onClick={() => handleSquareClick(square)}
                >
                  {piece && <div className="piece">{getPieceSymbol(piece)}</div>}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  const getPieceSymbol = (piece) => {
    const symbols = {
      'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚',
      'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔'
    }
    return symbols[piece.type] || ''
  }

  return (
    <div className="chess-container">
      <div className="game-info">
        <div>{`Turn: ${game.turn() === 'w' ? 'White' : 'Black'}`}</div>
        {game.isGameOver() && (
          <div>
            {game.isCheckmate() ? 'Checkmate!' : 
             game.isDraw() ? 'Draw!' : 
             game.isStalemate() ? 'Stalemate!' : 'Game Over!'}
          </div>
        )}
      </div>
      {renderBoard()}
    </div>
  )
}

export default ChessBoard 