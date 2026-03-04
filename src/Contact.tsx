import { Button } from './components/ui/button'
import type { Connection } from './models/connection'
import { deleteConnection } from './storage/connectionRepo'
interface ContactProps {
    connections: Connection[],
    setConnections: (value: Connection[]) => void
}

const Contact = ({ connections, setConnections }: ContactProps ): React.JSX.Element => {

    const handleDelete = (id: string): void => {
        deleteConnection(id)
        const keptConnections: Connection[] = connections.filter(connection => connection.id !== id)
        setConnections(keptConnections)
    }

    return (
        <>
        <p>{connections.length}</p>
        {connections.length > 0 ? (
            connections.map(contact => (
                <div key={contact.id}>
                    <img src="https://ui-avatars.com/api/?name=Default&size=50&background=ccc&color=555"/>
                    <p>{contact.name}</p>
                    <p>{contact.jobTitle}</p>
                    <Button onClick={() => handleDelete(contact.id)}>Delete Contact</Button>
                </div>
            ))
        ) : ( <p>No data...</p> )
        }
        </>
    )
}

export default Contact