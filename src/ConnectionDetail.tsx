import { useParams } from "react-router-dom"
import { getConnectionById } from "./storage/connectionRepo";
import { getNoteByConnectionId, saveNote, updateNote } from "./storage/noteRepo";
import { useState } from "react";
import { Button } from "./components/ui/button";
import type { Note } from "./models/note";
import { deleteNote } from "./storage/noteRepo";

const ConnectionDetail = () => {
    const [noteString, setNoteString] = useState('')
    const { id } = useParams();
    const [note, setNote] = useState<Note | undefined>(id ? getNoteByConnectionId(id) : undefined)
    const [isEditing, setIsEditing] = useState(false)

    if (id === undefined) {
        return <h2>Connection not found.</h2>
    }
    const connection = getConnectionById(id)

    const handleSave = () => {
        const newNote: Note = {
            id: crypto.randomUUID(),
            connectionId: id,
            body: noteString,
            createdAt: new Date().toLocaleString()
        }
        saveNote(newNote)
        setNote(newNote)
    }

    const handleGoInEditMode = (noteText: string): void => {
        setIsEditing(true)
        setNoteString(noteText)
    }

    const handleEditSave = () => {
        if (note === undefined) {
            setIsEditing(false)
            return
        }
        const updatedNote: Note = {...note, body: noteString}
        updateNote(updatedNote)
        setNote(updatedNote)
        setIsEditing(false)
    }

    const handleDelete = () => {
        if (note === undefined) {
            return
        }
        deleteNote(note.id)
        setNote(undefined)
        setNoteString('')
    }

    return (
        <>
            <div className="pt-24 overflow-y-auto">
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
                {note && !isEditing &&
                    <>
                    <p onClick={() => handleGoInEditMode(note.body)}>{note.body}</p>
                    <Button variant="outline" size="sm" onClick={ handleDelete}>Delete Note</Button>
                    </>
                }
                {note && isEditing &&
                    <>
                    <textarea id="noteTextArea" onChange={e => setNoteString(e.target.value)} value={noteString} placeholder="type note here"></textarea>
                    <Button variant="outline" size="sm" onClick={ handleEditSave}>Save Note</Button>
                    </>
                }
                {!note && 
                    <>
                    <p>No note written yet.</p>
                    <textarea onChange={e => setNoteString(e.target.value)} value={noteString} placeholder="type note here"></textarea>
                    <Button variant="outline" size="sm" onClick={ handleSave}>Save Note</Button>
                    </>
                }
            </div>
        </>
    )
}

export default ConnectionDetail