import { useState } from 'react';
import type { Note } from '../../../shared/models/note';
import { saveNote, updateNote, deleteNote } from '../storage/noteRepo';

interface NoteEditorProps {
  connectionId: string;
  existingNote: Note | undefined;
  onNoteChange: (note: Note | undefined) => void;
}

const s = {
  textarea: {
    width: '100%',
    minHeight: '80px',
    padding: '8px',
    fontSize: '18px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    resize: 'vertical' as const,
    fontFamily: 'sans-serif',
    boxSizing: 'border-box' as const,
    outline: 'none',
  },
  row: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  btnPrimary: {
    flex: 1,
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 600,
    background: '#0a66c2',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  btnDanger: {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 600,
    background: 'none',
    color: '#ef4444',
    border: '1px solid #ef4444',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  noteBody: {
    fontSize: '18px',
    color: '#374151',
    lineHeight: 1.5,
    margin: 0,
    whiteSpace: 'pre-wrap' as const,
  },
  editBtn: {
    marginTop: '8px',
    padding: '4px 10px',
    fontSize: '12px',
    background: 'none',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#6b7280',
  },
  error: {
    fontSize: '12px',
    color: '#ef4444',
    marginTop: '6px',
  },
};

const NoteEditor = ({ connectionId, existingNote, onNoteChange }: NoteEditorProps) => {
  const [isEditing, setIsEditing] = useState(!existingNote);
  const [body, setBody] = useState(existingNote?.body ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!body.trim()) return;
    setLoading(true);
    setError(null);
    try {
      if (existingNote) {
        const updated = await updateNote({ id: existingNote.id, body: body.trim() });
        onNoteChange(updated);
      } else {
        const created = await saveNote({ connectionId, body: body.trim() });
        onNoteChange(created);
      }
      setIsEditing(false);
    } catch {
      setError('Failed to save. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingNote) return;
    setLoading(true);
    setError(null);
    try {
      await deleteNote(existingNote.id);
      onNoteChange(undefined);
      setBody('');
      setIsEditing(true);
    } catch {
      setError('Failed to delete. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setBody(existingNote?.body ?? '');
    setIsEditing(true);
  };

  if (!isEditing && existingNote) {
    return (
      <div>
        <p style={s.noteBody}>{existingNote.body}</p>
        <div style={s.row}>
          <button style={s.editBtn} onClick={handleEdit} disabled={loading}>
            Edit
          </button>
          <button style={{ ...s.editBtn, color: '#ef4444', borderColor: '#ef4444' }} onClick={handleDelete} disabled={loading}>
            Delete
          </button>
        </div>
        {error && <p style={s.error}>{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <textarea
        style={s.textarea}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add a note about this person..."
        disabled={loading}
      />
      <div style={s.row}>
        <button style={s.btnPrimary} onClick={handleSave} disabled={loading || !body.trim()}>
          {loading ? 'Saving...' : existingNote ? 'Update' : 'Save'}
        </button>
        {existingNote && (
          <button style={s.btnDanger} onClick={() => setIsEditing(false)} disabled={loading}>
            Cancel
          </button>
        )}
      </div>
      {error && <p style={s.error}>{error}</p>}
    </div>
  );
};

export default NoteEditor;
