import Contact from './Contact'
import type { Connection } from './models/connection'
type ConnectionListProps = {
    setConnections: (value: Connection[] | ((prev: Connection[]) => Connection[])) => void
    filteredConnections: Connection[]
}

const ConnectionList = ({ setConnections, filteredConnections }: ConnectionListProps): React.JSX.Element => {
    
    return (
        <div className="connection-list">
            <p>Connection List</p>
            <Contact filteredConnections={filteredConnections} setConnections={setConnections}/>
        </div>
    )
}

export default ConnectionList