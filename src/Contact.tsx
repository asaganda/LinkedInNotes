import { Button } from './components/ui/button'
import type { Connection } from './models/connection'
import { deleteConnection } from './storage/connectionRepo'
import { Link } from 'react-router-dom'
interface ContactProps {
    filteredConnections: Connection[],
    setConnections: (value: Connection[]) => void
}

const divStyle = {
    border: "5px solid black"
}

const Contact = ({ filteredConnections, setConnections }: ContactProps ): React.JSX.Element => {

    const handleDelete = (id: string): void => {
        deleteConnection(id)
        const keptConnections: Connection[] = filteredConnections.filter(connection => connection.id !== id)
        setConnections(keptConnections)
    }

    return (
        <>
        {filteredConnections.length > 0 ? (
            filteredConnections.map(contact => (
                <div style={divStyle} key={contact.id}>
                    <Link to={`/connections/${contact.id}`}>
                        <img src="https://ui-avatars.com/api/?name=Default&size=50&background=ccc&color=555"/>
                        <p>{contact.name}</p>
                        <p>{contact.jobTitle}</p>
                    </Link>
                    <Button onClick={() => handleDelete(contact.id)}>Delete Contact</Button>
                </div>
            ))
        ) : ( <p>Contact not found! Try another search</p> )
        }
        </>
    )
}

export default Contact