import { useParams } from "react-router-dom"
import { getConnectionById } from "./storage/connectionRepo";
import { getNoteByConnectionId, saveNote } from "./storage/noteRepo";
import { useState } from "react";
import { Button } from "./components/ui/button";
import type { Note } from "./models/note";

const ConnectionDetail = () => {
    const [noteValue, setNoteValue] = useState('')
    const { id } = useParams();
    const [note, setNote] = useState<Note | undefined>(id ? getNoteByConnectionId(id) : undefined)
    if (id === undefined) {
        return <h2>Connection not found.</h2>
    }
    const connection = getConnectionById(id)

    const handleSave = () => {
        const newNote: Note = {
            id: crypto.randomUUID(),
            connectionId: id,
            body: noteValue,
            createdAt: new Date().toLocaleString()
        }
        saveNote(newNote)
        setNote(newNote)
    }

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
                    <>
                    <p>No note written yet.</p>
                    <textarea onChange={e => setNoteValue(e.target.value)} value={noteValue} placeholder="type note here"></textarea>
                    <Button variant="outline" size="sm" onClick={ handleSave}>Save Note</Button>
                    </>
                }
            </div>
        </>
    )
}

export default ConnectionDetail