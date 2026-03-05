import type { Note } from "@/models/note"

const getAllNotes = (): Note[] => {
    return JSON.parse(localStorage.getItem('notes') || '[]')
}

const getNoteByConnectionId = (connId: string): Note | undefined => {
    const allNotes: Note[] = getAllNotes()
    const connectionIdNote: Note | undefined = allNotes.find((note: Note) => note.connectionId === connId)
    return connectionIdNote
}

const saveNote = (note: Note): void => {
    const allNotes: Note[] = getAllNotes()
    const updatedNotes: Note[] = [...allNotes, note]
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
}

const deleteNote = (id: string): void => {
    const allNotes: Note[] = getAllNotes()
    const keptNotes: Note[] = allNotes.filter((note: Note) => note.id !== id)
    localStorage.setItem('notes', JSON.stringify(keptNotes))
}

const updateNote = (updatedNote: Note): void => {
    const allNotes: Note[] = getAllNotes()
    const updatedNotes: Note[] = allNotes.map((note: Note) => note.id === updatedNote.id ? updatedNote : note)
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
}

export { getAllNotes, getNoteByConnectionId, saveNote, deleteNote, updateNote} 