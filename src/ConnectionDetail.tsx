import { Link, useParams } from "react-router-dom"
import { getConnectionById } from "./storage/connectionRepo";
import { getNoteByConnectionId, saveNote, updateNote } from "./storage/noteRepo";
import { useState } from "react";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import type { Note } from "./models/note";
import { deleteNote } from "./storage/noteRepo";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import getInitials from "./utils/getInitials";

type ConnectionDetailProps = {
    selectedId?: string,
    isDesktop?: boolean
}

const ConnectionDetail = ({ selectedId, isDesktop }: ConnectionDetailProps ) => {
    const [noteString, setNoteString] = useState('')
    const { id } = useParams();
    const activeId = selectedId || id
    const [note, setNote] = useState<Note | undefined>(activeId ? getNoteByConnectionId(activeId) : undefined)
    const [isEditing, setIsEditing] = useState(false)

    if (activeId === undefined && isDesktop) { // Desktop, no connection selected yet
        return (
            <div className="md:pt-24">
                <h2>Select a Connection</h2>
            </div>
        )
    } else if (activeId === undefined) { // Any other case where activeId is undefined
        return (
            <div className="md:pt-24">
                <h2>Connection not found</h2>
            </div>
        )
    }
    const connection = getConnectionById(activeId)

    const handleSave = () => {
        const newNote: Note = {
            id: crypto.randomUUID(),
            connectionId: activeId,
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
            <div className="flex flex-col items-center pt-24 overflow-y-auto">
                <Link className="inline-flex items-center text-sm font-medium text-blue-600 p-2 border border-blue-600 rounded-md md:hidden self-start" to="/">Back</Link>
                {connection &&
                    <div className="flex flex-col items-center mb-3">
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar>
                                <AvatarImage src="" className="rounded-full"/>
                                <AvatarFallback>{getInitials(connection.name)}</AvatarFallback>
                            </Avatar>
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
                    <div className="">
                        <p>Connection not found.</p>
                    </div>
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
                        <Textarea id="noteTextArea" onChange={e => setNoteString(e.target.value)} value={noteString} placeholder="type note here"></Textarea>
                        <Button variant="outline" size="sm" onClick={ handleEditSave}>Save Note</Button>
                    </div>
                }
                {!note && 
                    <div className="flex flex-col w-[320px] items-center">
                    <p>No note written yet.</p>
                    <Textarea onChange={e => setNoteString(e.target.value)} value={noteString} placeholder="type note here"></Textarea>
                    <Button variant="outline" size="sm" onClick={ handleSave}>Save Note</Button>
                    </div>
                }
            </div>
        </>
    )
}

export default ConnectionDetail