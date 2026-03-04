import { useState } from 'react'
import './App.css'
import ConnectionList from './ConnectionList'
import Navigation from './Navigation'
import AddContactForm from './AddContactForm'
import type { Connection } from './models/connection'
import { getAllConnections } from './storage/connectionRepo'
import fakeData from './placeholderdata.json'
import { Routes, Route } from 'react-router-dom'

function App() {
  if (localStorage.getItem('connections') === null) {
    localStorage.setItem('connections', JSON.stringify(fakeData))
  }
  const [connections, setConnections] = useState<Connection[]>(getAllConnections())
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  

  return (
    <>
      <Navigation dialogOpen={dialogOpen} setDialogOpen={setDialogOpen}/>
      <main>
        <Routes>
          <Route path="/" element={<ConnectionList connections={connections} setConnections={setConnections}/>}/>
          <Route path="/connections/:id" element={<p>Connection Detail coming soon</p>}/>
        </Routes>
            <AddContactForm setConnections={setConnections} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen}/>
      </main>
    </>
  )
}

export default App
