import type { Connection } from './models/connection'
interface ContactProps {
    connections: Connection[]
}

const Contact = ({ connections }: ContactProps ) => {
    return (
        <>
        <p>{connections.length}</p>
        {connections.length > 0 ? (
            connections.map(contact => (
                <div key={contact.id}>
                    <img src="https://ui-avatars.com/api/?name=Default&size=50&background=ccc&color=555"/>
                    <p>{contact.name}</p>
                    <p>{contact.jobTitle}</p>
                </div>
            ))
        ) : ( <p>No data...</p> )
        }
        </>
    )
}

export default Contact