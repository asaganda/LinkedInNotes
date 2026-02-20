import type { Connection } from './models/connection'
interface ContactProps {
    data: Connection[]
}

const Contact = ({ data }: ContactProps ) => {
    return (
        <>
        <p>{data.length}</p>
        {data.length > 0 ? (
            data.map(contact => (
                <div key={contact.id}>
                    <p>{contact.name}</p>
                    <p>{contact.jobTitle}</p>
                </div>
            ))
        ) : ( <p>Loading data...</p> )
        }
        </>
    )
}

export default Contact