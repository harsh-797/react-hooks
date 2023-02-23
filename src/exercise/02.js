// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(
  key = 'name',
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [name, setName] = React.useState(() => {
    const previousStored = deserialize(window.localStorage.getItem(key))
    if (previousStored) {
      return serialize(previousStored)
    }
    return serialize(defaultValue)
  })

  const previousKeyRef = React.useRef(key)
  React.useEffect(() => {
    const previousKey = previousKeyRef.current
    if (key !== previousKey) {
      window.localStorage.removeItem(previousKey)
      previousKeyRef.current = key
    }
    window.localStorage.setItem(key, serialize(name))
  }, [name, key])

  return [name, setName, serialize]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
