import { useState } from 'react'
import type { Connection } from './models/connection'
import Contact from './Contact'
import { getAllConnections } from './storage/connectionRepo'

const ConnectionList = () => {
    const [connections, setConnections] = useState<Connection[]>(getAllConnections())

    return (
        <div className="connection-list">
            <p>Connection List</p>
            <Contact connections={connections}/>
        </div>
    )
}

export default ConnectionList