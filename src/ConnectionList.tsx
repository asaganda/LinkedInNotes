import Contact from './Contact'
import type { Connection } from './models/connection'
type ConnectionListProps = {
    connections: Connection[],
    setConnections: (value: Connection[] | ((prev: Connection[]) => Connection[])) => void
}

const ConnectionList = ({ connections, setConnections }: ConnectionListProps): React.JSX.Element => {
    
    return (
        <div className="connection-list">
            <p>Connection List</p>
            <Contact connections={connections} setConnections={setConnections}/>
        </div>
    )
}

export default ConnectionList