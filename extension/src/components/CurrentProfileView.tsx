import { useEffect, useState } from 'react';
import type { Connection } from '../../../shared/models/connection';
import type { Note } from '../../../shared/models/note';
import type { ScrapedProfileData } from '../entrypoints/content/index';
import { getConnectionByLinkedinUrl } from '../storage/connectionRepo';
import { getNoteByConnectionId } from '../storage/noteRepo';
import NoteEditor from './NoteEditor';

interface CurrentProfileViewProps {
  linkedinUrl: string;
  savedConnection?: Connection;
  onAddConnection: (scraped: ScrapedProfileData) => void;
  scrapeProfileData: () => ScrapedProfileData;
}

const s = {
  container: { padding: '16px' },
  loading: { fontSize: '13px', color: '#9ca3af', textAlign: 'center' as const, padding: '24px 0' },
  name: { fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 },
  meta: { fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' },
  divider: { border: 'none', borderTop: '1px solid #e5e7eb', margin: '12px 0' },
  sectionLabel: { fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '8px' },
  addBtn: {
    width: '100%',
    padding: '10px',
    fontSize: '13px',
    fontWeight: 600,
    background: '#0a66c2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  notFoundText: { fontSize: '13px', color: '#6b7280', marginBottom: '12px' },
  error: { fontSize: '13px', color: '#ef4444', textAlign: 'center' as const, padding: '16px 0' },
};

const CurrentProfileView = ({ linkedinUrl, savedConnection, onAddConnection, scrapeProfileData }: CurrentProfileViewProps) => {
  const [connection, setConnection] = useState<Connection | undefined>(savedConnection);
  const [note, setNote] = useState<Note | undefined>(undefined);
  const [loading, setLoading] = useState(!savedConnection);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If a freshly saved connection was passed in, use it directly — no Supabase lookup needed
    if (savedConnection) {
      setConnection(savedConnection);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const conn = await getConnectionByLinkedinUrl(linkedinUrl);
        setConnection(conn);
        if (conn) {
          const n = await getNoteByConnectionId(conn.id);
          setNote(n);
        }
      } catch {
        setError('Could not load data. Check your connection.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [linkedinUrl, savedConnection]);

  if (loading) {
    return <div style={s.container}><p style={s.loading}>Loading...</p></div>;
  }

  if (error) {
    return <div style={s.container}><p style={s.error}>{error}</p></div>;
  }

  // Not found state
  if (!connection) {
    return (
      <div style={s.container}>
        <p style={s.notFoundText}>This person isn't in your connections yet.</p>
        <button style={s.addBtn} onClick={() => onAddConnection(scrapeProfileData())}>
          + Add this person
        </button>
        <p style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginTop: '10px' }}>
          Tip: scroll down to the Experience section first to auto-fill job title and company.
        </p>
      </div>
    );
  }

  // Found state
  return (
    <div style={s.container}>
      <p style={s.name}>{connection.name}</p>
      <p style={s.meta}>{connection.jobTitle}{connection.company ? ` · ${connection.company}` : ''}</p>

      <hr style={s.divider} />

      <p style={s.sectionLabel}>Note</p>
      <NoteEditor
        connectionId={connection.id}
        existingNote={note}
        onNoteChange={setNote}
      />
    </div>
  );
};

export default CurrentProfileView;
