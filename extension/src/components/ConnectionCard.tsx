import type { Connection } from '../../../shared/models/connection';

interface ConnectionCardProps {
  connection: Connection;
  onClick: (connection: Connection) => void;
}

const s = {
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 16px',
    cursor: 'pointer',
    borderBottom: '1px solid #f3f4f6',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#0a66c2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  initials: {
    color: 'white',
    fontSize: '13px',
    fontWeight: 700,
    fontFamily: 'sans-serif',
  },
  info: { flex: 1, minWidth: 0 },
  name: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#111827',
    margin: 0,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  meta: {
    fontSize: '11px',
    color: '#6b7280',
    margin: '1px 0 0 0',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const ConnectionCard = ({ connection, onClick }: ConnectionCardProps) => {
  return (
    <div
      style={s.card}
      onClick={() => onClick(connection)}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#f9fafb'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'white'; }}
    >
      <div style={s.avatar}>
        {connection.avatarUrl ? (
          <img
            src={connection.avatarUrl}
            alt={connection.name}
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <span style={s.initials}>{getInitials(connection.name)}</span>
        )}
      </div>
      <div style={s.info}>
        <p style={s.name}>{connection.name}</p>
        <p style={s.meta}>
          {connection.jobTitle}{connection.company ? ` · ${connection.company}` : ''}
        </p>
      </div>
    </div>
  );
};

export default ConnectionCard;
