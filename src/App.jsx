import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [display, setDisplay] = useState('0')
  const [equation, setEquation] = useState('')
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  const handleNumber = (number) => {
    if (shouldResetDisplay) {
      setDisplay(number)
      setShouldResetDisplay(false)
    } else {
      setDisplay(display === '0' ? number : display + number)
    }
  }

  const handleOperator = (operator) => {
    setEquation(display + ' ' + operator + ' ')
    setShouldResetDisplay(true)
  }

  const handleEqual = () => {
    const finalEquation = equation + display
    try {
      const result = eval(finalEquation)
      const calculation = `${finalEquation} = ${result}`
      setHistory([...history, calculation])
      setDisplay(result.toString())
      setEquation('')
      setShouldResetDisplay(true)
    } catch (error) {
      setDisplay('Error')
      setEquation('')
      setShouldResetDisplay(true)
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setEquation('')
    setShouldResetDisplay(false)
  }

  const handleDecimal = () => {
    if (shouldResetDisplay) {
      setDisplay('0.')
      setShouldResetDisplay(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const toggleHistory = () => {
    setShowHistory(!showHistory)
  }

  const clearHistory = () => {
    setHistory([])
  }

  const useHistoryItem = (item) => {
    const result = item.split(' = ')[1]
    setDisplay(result)
    setEquation('')
    setShouldResetDisplay(true)
    setShowHistory(false)
  }

  // Keyboard event handler
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key
      
      // Number keys (0-9)
      if (/^[0-9]$/.test(key)) {
        handleNumber(key)
      }
      // Operators
      else if (key === '+') {
        handleOperator('+')
      }
      else if (key === '-') {
        handleOperator('-')
      }
      else if (key === '*') {
        handleOperator('*')
      }
      else if (key === '/') {
        handleOperator('/')
      }
      // Decimal point
      else if (key === '.') {
        handleDecimal()
      }
      // Enter key for equals
      else if (key === 'Enter' || key === '=') {
        handleEqual()
      }
      // Backspace to clear last digit
      else if (key === 'Backspace') {
        handleBackspace()
      }
      // Escape to clear all
      else if (key === 'Escape') {
        handleClear()
      }
      // Space bar to toggle history
      else if (key === ' ') {
        event.preventDefault()
        toggleHistory()
      }
    }

    // Add event listener
    window.addEventListener('keydown', handleKeyPress)
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [display, equation, shouldResetDisplay, history])

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
    }
  }

  // Cursor tracking functionality
  useEffect(() => {
    let mouseX = 0
    let mouseY = 0
    let isMoving = false
    let moveTimeout

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      
      // Update cursor highlight
      const highlight = document.getElementById('cursorHighlight')
      if (highlight) {
        highlight.style.left = mouseX + 'px'
        highlight.style.top = mouseY + 'px'
      }

      // Create cursor trail
      if (isMoving) {
        createCursorTrail(mouseX, mouseY)
      }

      isMoving = true
      clearTimeout(moveTimeout)
      
      moveTimeout = setTimeout(() => {
        isMoving = false
      }, 100)
    }

    const createCursorTrail = (x, y) => {
      const cursorLines = document.getElementById('cursorLines')
      if (!cursorLines) return

      // Create trail dot
      const trail = document.createElement('div')
      trail.className = 'cursor-trail'
      trail.style.left = x + 'px'
      trail.style.top = y + 'px'
      cursorLines.appendChild(trail)

      // Remove trail after animation
      setTimeout(() => {
        if (trail.parentNode) {
          trail.parentNode.removeChild(trail)
        }
      }, 1000)

      // Create line occasionally
      if (Math.random() < 0.3) {
        const line = document.createElement('div')
        line.className = 'cursor-line'
        line.style.left = x + 'px'
        line.style.top = y + 'px'
        line.style.transform = `rotate(${Math.random() * 360}deg)`
        cursorLines.appendChild(line)

        // Remove line after animation
        setTimeout(() => {
          if (line.parentNode) {
            line.parentNode.removeChild(line)
          }
        }, 2000)
      }
    }

    // Add mouse move listener
    window.addEventListener('mousemove', handleMouseMove)

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(moveTimeout)
    }
  }, [])

  return (
    <div className="App">
      <div className="matrix-rain"></div>
      <div className="grid-lines"></div>
      <div className="cursor-lines" id="cursorLines"></div>
      <div className="cursor-highlight" id="cursorHighlight"></div>
      
      <div className="search-app-bar">
        <div className="search-container">
          <div className="search-icon">🔍</div>
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="search-input"
          />
          <button className="search-btn">Search</button>
        </div>
        <div className="welcome-message">
          <h1>Welcome to the User-Friendly Calculator!</h1>
          <p>Perform calculations with ease and track your history</p>
        </div>
      </div>
      
      <div className="calculator-container">
        <div className="calculator-card">
          <div className="card-header">
            <h2>Smart Calculator</h2>
            <button className="history-btn" onClick={toggleHistory}>
              📊 History
            </button>
          </div>
          
          <div className="calculator">
            <div className="display">
              <div className="equation">{equation}</div>
              <div className="current">{display}</div>
            </div>
            <div className="buttons">
              <button className="clear" onClick={handleClear}>AC</button>
              <button className="operator" onClick={() => handleOperator('/')}>÷</button>
              <button className="operator" onClick={() => handleOperator('*')}>×</button>
              <button className="number" onClick={() => handleNumber('7')}>7</button>
              <button className="number" onClick={() => handleNumber('8')}>8</button>
              <button className="number" onClick={() => handleNumber('9')}>9</button>
              <button className="operator" onClick={() => handleOperator('-')}>-</button>
              <button className="number" onClick={() => handleNumber('4')}>4</button>
              <button className="number" onClick={() => handleNumber('5')}>5</button>
              <button className="number" onClick={() => handleNumber('6')}>6</button>
              <button className="operator" onClick={() => handleOperator('+')}>+</button>
              <button className="number" onClick={() => handleNumber('1')}>1</button>
              <button className="number" onClick={() => handleNumber('2')}>2</button>
              <button className="number" onClick={() => handleNumber('3')}>3</button>
              <button className="equal" onClick={handleEqual}>=</button>
              <button className="number zero" onClick={() => handleNumber('0')}>0</button>
              <button className="number" onClick={handleDecimal}>.</button>
            </div>
          </div>
        </div>

        {showHistory && (
          <div className="history-panel">
            <div className="history-header">
              <h3>Calculation History</h3>
              <button className="close-btn" onClick={toggleHistory}>×</button>
            </div>
            <div className="history-list">
              {history.length === 0 ? (
                <p className="no-history">No calculations yet</p>
              ) : (
                <>
                  {history.map((item, index) => (
                    <div key={index} className="history-item" onClick={() => useHistoryItem(item)}>
                      <span className="history-calculation">{item}</span>
                      <span className="use-btn">Use</span>
                    </div>
                  ))}
                  <button className="clear-history-btn" onClick={clearHistory}>
                    Clear History
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
