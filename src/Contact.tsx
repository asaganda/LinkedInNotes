import { Button } from './components/ui/button'
import type { Connection } from './models/connection'
import { deleteConnection } from './storage/connectionRepo'
import { Link } from 'react-router-dom'
interface ContactProps {
    filteredConnections: Connection[],
    setConnections: (value: Connection[]) => void,
    selectedId: string | undefined
}

const Contact = ({ filteredConnections, setConnections, selectedId }: ContactProps ): React.JSX.Element => {

    const handleDelete = (id: string): void => {
        deleteConnection(id)
        const keptConnections: Connection[] = filteredConnections.filter(connection => connection.id !== id)
        setConnections(keptConnections)
    }

    return (
        <>
        {filteredConnections.length > 0 ? (
            filteredConnections.map(contact => (
                <div className={`flex items-center p-3 border-b-2 border-b-gray-200 ${contact.id === selectedId ? "bg-gray-100": ""}`} key={contact.id}>
                    <Link to={`/connections/${contact.id}`} className='flex items-center gap-3 flex-1'>
                        <img src="https://ui-avatars.com/api/?name=Default&size=50&background=ccc&color=555" className='rounded-full'/>
                        <div className='flex flex-col'>
                            <p>{contact.name}</p>
                            <p>{contact.jobTitle}</p>
                        </div>
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