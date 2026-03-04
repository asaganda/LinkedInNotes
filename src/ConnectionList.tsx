import Contact from './Contact'
import type { Connection } from './models/connection'
type ConnectionListProps = {
    connections: Connection[]
}

const ConnectionList = ({ connections }: ConnectionListProps): React.JSX.Element => {
    
    return (
        <div className="connection-list">
            <p>Connection List</p>
            <Contact connections={connections}/>
        </div>
    )
}

export default ConnectionList