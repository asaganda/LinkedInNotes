import { useParams } from "react-router-dom"
import { getConnectionById } from "./storage/connectionRepo";

const ConnectionDetail = () => {
    const { id } = useParams();
    if (id === undefined) {
        return <h2>Connection not found.</h2>
    }
    const connection = getConnectionById(id)

    return (
        <>
            {connection &&
                <div>
                    <img src="https://ui-avatars.com/api/?name=Default&size=50&background=ccc&color=555"/>
                    <p>{connection.name}</p>
                    <p>{connection.jobTitle}</p>
                    <p>{connection.company}</p>
                    <p>{connection.linkedinUrl}</p>
                    <p>{connection.phone}</p>
                    <p>{connection.email}</p>
                </div>
            }
            {!connection && 
                <p>Connection not found.</p>
            }
        </>
    )
}

export default ConnectionDetail