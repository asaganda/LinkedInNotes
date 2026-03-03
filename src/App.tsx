import { useState } from 'react'
import './App.css'
import ConnectionList from './ConnectionList'
import Navigation from './Navigation'
import type { Connection } from './models/connection'

function App() {
  const [connections, setConnections] = useState<Connection[]>([])

  return (
    <>
      <Navigation/>
      {/* <h1>s</h1> */}
      <main>
        <ConnectionList/>
        {/* ConnectionDetail */}
      </main>
    </>
  )
}

export default App
