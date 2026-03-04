import { useState } from 'react'
import './App.css'
import ConnectionList from './ConnectionList'
import Navigation from './Navigation'
import AddContactForm from './AddContactForm'
import type { Connection } from './models/connection'
import { getAllConnections } from './storage/connectionRepo'
import fakeData from './placeholderdata.json'

function App() {
  if (localStorage.getItem('connections') === null) {
    localStorage.setItem('connections', JSON.stringify(fakeData))
  }
  const [connections, setConnections] = useState<Connection[]>(getAllConnections())
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  

  return (
    <>
      <Navigation dialogOpen={dialogOpen} setDialogOpen={setDialogOpen}/>
      {/* <h1>s</h1> */}
      <main>
        <ConnectionList connections={connections} setConnections={setConnections}/>
        <AddContactForm setConnections={setConnections} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen}/>
        {/* ConnectionDetail */}
      </main>
    </>
  )
}

export default App
