import { Link, useParams } from "react-router-dom"
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
                <Link className="inline-flex items-center text-sm font-medium text-blue-600 p-2 border border-blue-600 rounded-md" to="/">Back</Link>
                {connection &&
                    <div className="flex flex-col items-center mb-3">
                        <div className="flex items-center gap-3 mb-3">
                            <img src="https://ui-avatars.com/api/?name=Default&size=50&background=ccc&color=555" className="rounded-full"/>
                            <div className="flex flex-col">
                                <p className="font-bold">{connection.name}</p>
                                <p className="text-sm text-gray-500">{connection.jobTitle}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 w-80">
                            <p>Company: {connection.company}</p>
                            <p>LinkedIn: {connection.linkedinUrl}</p>
                            <p>Phone: {connection.phone}</p>
                            <p>Email: {connection.email}</p>
                        </div>
                    </div>
                }
                {!connection && 
                    <p>Connection not found.</p>
                }
                {note && 
                    <div className="flex flex-col items-center mb-3">
                        <p>Note:</p>
                    </div>
                }
                {note && !isEditing &&
                    <div className="flex flex-col items-center">
                        <p className="mb-3" onClick={() => handleGoInEditMode(note.body)}>{note.body}</p>
                        <Button variant="outline" size="sm" onClick={ handleDelete}>Delete Note</Button>
                    </div>
                }
                {note && isEditing &&
                    <div className="flex flex-col items-center w-80">
                        <textarea id="noteTextArea" onChange={e => setNoteString(e.target.value)} value={noteString} placeholder="type note here"></textarea>
                        <Button variant="outline" size="sm" onClick={ handleEditSave}>Save Note</Button>
                    </div>
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