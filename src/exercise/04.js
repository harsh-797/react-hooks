// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'

function Board({position, onClickSquare}) {

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClickSquare(i)}>
        {position[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [history, setHistory] = React.useState(
    () =>
      JSON.parse(window.localStorage.getItem('history')) ||
      Array(1).fill(Array(9).fill(null)),
  )
  const [currentMove, setCurrentMove] = React.useState(
    () => JSON.parse(window.localStorage.getItem('currentMove')) || 0,
  )

  React.useEffect(() => {
    window.localStorage.setItem('history', JSON.stringify(history))
    window.localStorage.setItem('currentMove', JSON.stringify(currentMove))
  }, [history, currentMove])

  const position = history[currentMove]

  const nextValue = calculateNextValue(position)
  const winner = calculateWinner(position)
  const status = calculateStatus(winner, position, nextValue)

  function restart() {
    setHistory(Array(1).fill(Array(9).fill(null)))
    setCurrentMove(0)
  }

  function handleUpdateHistory(square) {
    const newPosition = [...history[currentMove]]

    if (winner || newPosition[square]) return

    newPosition[square] = nextValue

    let cloneHistory = history.filter((e, i) => {
      return i <= currentMove
    })
    cloneHistory = [...cloneHistory, newPosition]

    setHistory(cloneHistory)
    setCurrentMove(c => c + 1)
  }
  const moves = history.map((each, i) => {
    let moveNumber = each.filter(Boolean).length
    if (i) {
      return (
        <li
          className="restart"
          key={moveNumber}
          onClick={() => setCurrentMove(moveNumber)}
          disabled={currentMove === moveNumber}
        >
          Go to move #{moveNumber}
        </li>
      )
    } else {
      return (
        <li
          className="restart"
          key={0}
          onClick={() => setCurrentMove(moveNumber)}
          disabled={currentMove === moveNumber}
        >
          Go to Start of the game
        </li>
      )
    }
  })
  return (
    <div className="game">
      <div className="game-board">
        <Board position={position} onClickSquare={handleUpdateHistory} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
