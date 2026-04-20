import { useEffect, useState } from 'react';
import type { Connection } from '../../../shared/models/connection';
import type { Note } from '../../../shared/models/note';
import { getAllConnections } from '../storage/connectionRepo';
import { getNoteByConnectionId } from '../storage/noteRepo';
import ConnectionCard from './ConnectionCard';
import NoteEditor from './NoteEditor';
import EditConnectionForm from './EditConnectionForm';

interface ConnectionsListProps {
  onClose: () => void;
}

const s = {
  container: { display: 'flex', flexDirection: 'column' as const, height: '480px' },
  searchWrap: { padding: '10px 16px', borderBottom: '1px solid #e5e7eb' },
  searchInput: {
    width: '100%',
    padding: '7px 10px',
    fontSize: '13px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    boxSizing: 'border-box' as const,
    outline: 'none',
    fontFamily: 'sans-serif',
  },
  list: { flex: 1, overflowY: 'auto' as const },
  empty: { fontSize: '13px', color: '#9ca3af', textAlign: 'center' as const, padding: '32px 16px' },
  loading: { fontSize: '13px', color: '#9ca3af', textAlign: 'center' as const, padding: '32px 16px' },
  error: { fontSize: '13px', color: '#ef4444', textAlign: 'center' as const, padding: '16px' },
  detailHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderBottom: '1px solid #e5e7eb',
    background: '#f9fafb',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#6b7280',
    lineHeight: 1,
    padding: '0',
  },
  detailName: { fontSize: '13px', fontWeight: 600, color: '#111827', margin: 0 },
  detailBody: { padding: '16px' },
  detailMeta: { fontSize: '12px', color: '#6b7280', margin: '2px 0 12px 0' },
  sectionLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#9ca3af',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '8px',
  },
};

const ConnectionsList = ({ onClose }: ConnectionsListProps) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Connection | undefined>(undefined);
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState<Note | undefined>(undefined);
  const [noteLoading, setNoteLoading] = useState(false);

  useEffect(() => {
    getAllConnections()
      .then(setConnections)
      .catch(() => setError('Could not load connections.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (connection: Connection) => {
    setSelected(connection);
    setNote(undefined);
    setNoteLoading(true);
    try {
      const n = await getNoteByConnectionId(connection.id);
      setNote(n);
    } finally {
      setNoteLoading(false);
    }
  };

  const filtered = connections.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
    (c.company ?? '').toLowerCase().includes(search.toLowerCase())
  );

  // Edit view — inline within the list panel
  if (selected && editing) {
    return (
      <div style={s.container}>
        <div style={s.detailHeader}>
          <button style={s.backBtn} onClick={() => setEditing(false)} aria-label="Back to detail">
            ←
          </button>
          <p style={s.detailName}>Edit Connection</p>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <EditConnectionForm
            connection={selected}
            onSaved={(updated) => { setSelected(updated); setEditing(false); }}
            onCancel={() => setEditing(false)}
          />
        </div>
      </div>
    );
  }

  // Detail view — selected connection + note
  if (selected) {
    return (
      <div style={s.container}>
        <div style={s.detailHeader}>
          <button style={s.backBtn} onClick={() => setSelected(undefined)} aria-label="Back to list">
            ←
          </button>
          <p style={s.detailName}>{selected.name}</p>
          <button
            onClick={() => setEditing(true)}
            style={{ marginLeft: 'auto', background: 'none', border: '1px solid #d1d5db', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', color: '#6b7280', padding: '3px 7px', fontFamily: 'sans-serif' }}
          >
            Edit
          </button>
        </div>
        <div style={s.detailBody}>
          <p style={s.detailMeta}>
            {selected.jobTitle}{selected.company ? ` · ${selected.company}` : ''}
          </p>
          <p style={s.sectionLabel}>Note</p>
          {noteLoading ? (
            <p style={{ fontSize: '13px', color: '#9ca3af' }}>Loading...</p>
          ) : (
            <NoteEditor
              connectionId={selected.id}
              existingNote={note}
              onNoteChange={setNote}
            />
          )}
        </div>
      </div>
    );
  }

  // List view
  return (
    <div style={s.container}>
      <div style={s.searchWrap}>
        <input
          style={s.searchInput}
          placeholder="Search connections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div style={s.list}>
        {loading && <p style={s.loading}>Loading...</p>}
        {error && <p style={s.error}>{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p style={s.empty}>
            {search ? 'No results.' : 'No connections yet.'}
          </p>
        )}
        {filtered.map((c) => (
          <ConnectionCard key={c.id} connection={c} onClick={handleSelect} />
        ))}
      </div>
    </div>
  );
};

export default ConnectionsList;
