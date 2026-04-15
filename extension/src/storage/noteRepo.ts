import { supabase } from '../lib/supabaseClient';
import type { Note } from '../../../shared/models/note';

// Maps a raw Supabase row (snake_case) to the shared Note type (camelCase)
const toNote = (row: Record<string, string>): Note => ({
    id: row.id,
    connectionId: row.connection_id,
    body: row.body,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

const getNoteByConnectionId = async (connectionId: string): Promise<Note | undefined> => {
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('connection_id', connectionId)
        .maybeSingle();
    if (error) throw error;
    return data ? toNote(data) : undefined;
};

const saveNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
    const { data, error } = await supabase
        .from('notes')
        .insert({
            connection_id: note.connectionId,
            body: note.body,
        })
        .select()
        .single();
    if (error) throw error;
    return toNote(data);
};

const updateNote = async (note: Pick<Note, 'id' | 'body'>): Promise<Note> => {
    const { data, error } = await supabase
        .from('notes')
        .update({
            body: note.body,
            updated_at: new Date().toISOString(),
        })
        .eq('id', note.id)
        .select()
        .single();
    if (error) throw error;
    return toNote(data);
};

const deleteNote = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
    if (error) throw error;
};

export { getNoteByConnectionId, saveNote, updateNote, deleteNote };
