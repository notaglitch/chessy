import { useState } from 'react'
import { Chess } from 'chess.js'
import './ChessBoard.css'

function ChessBoard() {
  const [game, setGame] = useState(new Chess())
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [draggedPiece, setDraggedPiece] = useState(null)

  const handleDragStart = (e, square) => {
    const piece = game.get(square)
    if (piece && piece.color === game.turn()) {
      setDraggedPiece(square)
      // Set a transparent drag image
      const dragImage = e.target.cloneNode(true)
      dragImage.style.opacity = '0'
      document.body.appendChild(dragImage)
      e.dataTransfer.setDragImage(dragImage, 35, 35)
      setTimeout(() => document.body.removeChild(dragImage), 0)
    } else {
      e.preventDefault()
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, targetSquare) => {
    e.preventDefault()
    if (draggedPiece) {
      try {
        game.move({
          from: draggedPiece,
          to: targetSquare,
          promotion: 'q'
        })
        setGame(new Chess(game.fen()))
      } catch (e) {
        // Invalid move
        console.log('Invalid move')
      }
      setDraggedPiece(null)
      setSelectedSquare(null)
    }
  }

  const handleSquareClick = (square) => {
    if (selectedSquare === null) {
      const piece = game.get(square)
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square)
      }
    } else {
      try {
        game.move({
          from: selectedSquare,
          to: square,
          promotion: 'q'
        })
        setGame(new Chess(game.fen()))
      } catch (e) {
        // Invalid move
        if (game.get(square)?.color === game.turn()) {
          setSelectedSquare(square)
          return
        }
      }
      setSelectedSquare(null)
    }
  }

  const getSquareClass = (square) => {
    const isSelected = square === selectedSquare
    const isDragged = square === draggedPiece
    const isLight = (square.charCodeAt(0) + square.charCodeAt(1)) % 2 === 0
    return `square ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''} ${isDragged ? 'dragged' : ''}`
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
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, square)}
                >
                  {piece && (
                    <div 
                      className={`piece ${piece.color === 'w' ? 'white-piece' : 'black-piece'}`}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, square)}
                    >
                      {getPieceSymbol(piece)}
                    </div>
                  )}
                  {i === 7 && (
                    <span className="coordinates file-coord">
                      {String.fromCharCode(97 + j)}
                    </span>
                  )}
                  {j === 0 && (
                    <span className="coordinates rank-coord">
                      {8 - i}
                    </span>
                  )}
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
    return symbols[piece.type]
  }

  const getGameStatus = () => {
    if (game.isCheckmate()) return 'Checkmate!'
    if (game.isDraw()) return 'Draw!'
    if (game.isStalemate()) return 'Stalemate!'
    if (game.isCheck()) return 'Check!'
    return `${game.turn() === 'w' ? 'White' : 'Black'}'s turn`
  }

  return (
    <div className="chess-container">
      <div className="game-info">
        <div>{getGameStatus()}</div>
      </div>
      {renderBoard()}
    </div>
  )
}

export default ChessBoard 