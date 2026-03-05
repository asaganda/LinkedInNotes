import { Button } from './components/ui/button'
import type { Connection } from './models/connection'
import { deleteConnection } from './storage/connectionRepo'
import { Link } from 'react-router-dom'
interface ContactProps {
    connections: Connection[],
    setConnections: (value: Connection[]) => void
}

const divStyle = {
    border: "5px solid black"
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
                <div style={divStyle} key={contact.id}>
                    <Link to={`/connections/${contact.id}`}>
                        <img src="https://ui-avatars.com/api/?name=Default&size=50&background=ccc&color=555"/>
                        <p>{contact.name}</p>
                        <p>{contact.jobTitle}</p>
                    </Link>
                    <Button onClick={() => handleDelete(contact.id)}>Delete Contact</Button>
                </div>
            ))
        ) : ( <p>No data...</p> )
        }
        </>
    )
}

export default Contact