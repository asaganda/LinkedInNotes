import { useState } from 'react'
import './App.css'
import ConnectionList from './ConnectionList'
import Navigation from './Navigation'
import AddContactForm from './AddContactForm'
import ConnectionDetail from './ConnectionDetail'
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
  const [searchQuery, setSearchQuery] = useState('')

  const filteredConnections: Connection[] = connections.filter((connection: Connection) =>
      connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    )
  

  return (
    <>
      <Navigation dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      <main>
        <Routes>
          <Route path="/" element={<ConnectionList setConnections={setConnections} filteredConnections={filteredConnections}/>}/>
          <Route path="/connections/:id" element={<ConnectionDetail/>}/>
        </Routes>
            <AddContactForm setConnections={setConnections} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen}/>
      </main>
    </>
  )
}

export default App
