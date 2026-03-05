import { useParams } from "react-router-dom"
import { getConnectionById } from "./storage/connectionRepo";
import { getNoteByConnectionId } from "./storage/noteRepo";

const ConnectionDetail = () => {
    const { id } = useParams();
    if (id === undefined) {
        return <h2>Connection not found.</h2>
    }
    const connection = getConnectionById(id)

    const note = getNoteByConnectionId(id)

    return (
        <>
            <div className="connection-full">
                {connection &&
                    <div className="connection-detail">
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
                {note && 
                    <p>{note.body}</p>
                }
                {!note && 
                    <p>No note written yet.</p>
                }
            </div>
        </>
    )
}

export default ConnectionDetail