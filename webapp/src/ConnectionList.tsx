import Contact from './Contact'
import type { Connection } from '../../shared/models/connection'
type ConnectionListProps = {
    setConnections: (value: Connection[] | ((prev: Connection[]) => Connection[])) => void
    filteredConnections: Connection[],
    selectedId: string | undefined
}

const ConnectionList = ({ setConnections, filteredConnections, selectedId }: ConnectionListProps): React.JSX.Element => {
    
    return (
        <div className="pt-24 overflow-y-auto">
            <p>Connection List</p>
            <Contact filteredConnections={filteredConnections} setConnections={setConnections} selectedId={selectedId}/>
        </div>
    )
}

export default ConnectionList