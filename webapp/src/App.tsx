import { useState } from 'react'
import './App.css'
import ConnectionList from './ConnectionList'
import Navigation from './Navigation'
import AddContactForm from './AddContactForm'
import ConnectionDetail from './ConnectionDetail'
import type { Connection } from '../../shared/models/connection'
import { getAllConnections } from './storage/connectionRepo'
import fakeData from './placeholderdata.json'
import { Routes, Route, useMatch } from 'react-router-dom'

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
  
    const match = useMatch('/connections/:id')
    const selectedId = match?.params.id

  return (
    <>
      <Navigation dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      <main>
        {/* Desktop: always rendered side by side container */}
        <div className='hidden md:flex'>
          <div className='md:w-[35%]'>
            <ConnectionList setConnections={setConnections} filteredConnections={filteredConnections} selectedId={selectedId}/>
          </div>
          <div className='flex-1'>
            <ConnectionDetail selectedId={selectedId} isDesktop={true}/>
          </div>
        </div>
        {/* Mobile: routing controls what's visible */}
        <div className='md:hidden'>
          <Routes>
            <Route path="/" element={<ConnectionList setConnections={setConnections} filteredConnections={filteredConnections} selectedId={selectedId}/>}/>
            <Route path="/connections/:id" element={<ConnectionDetail/>}/>
          </Routes>
        </div>
            <AddContactForm setConnections={setConnections} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen}/>
      </main>
    </>
  )
}

export default App
