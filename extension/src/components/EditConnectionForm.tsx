import { useState } from 'react';
import type { Connection } from '../../../shared/models/connection';
import { updateConnection } from '../storage/connectionRepo';

interface EditConnectionFormProps {
  connection: Connection;
  onSaved: (updated: Connection) => void;
  onCancel: () => void;
}

const s = {
  container: { padding: '16px' },
  fieldWrap: { marginBottom: '12px' },
  label: { display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
  input: {
    width: '100%',
    padding: '8px 10px',
    fontSize: '13px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    boxSizing: 'border-box' as const,
    outline: 'none',
    fontFamily: 'sans-serif',
    color: '#111827',
  },
  inputReadonly: {
    width: '100%',
    padding: '8px 10px',
    fontSize: '13px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    boxSizing: 'border-box' as const,
    fontFamily: 'sans-serif',
    color: '#9ca3af',
    background: '#f9fafb',
  },
  error: { fontSize: '11px', color: '#ef4444', marginTop: '4px' },
  row: { display: 'flex', gap: '8px', marginTop: '4px' },
  btnPrimary: {
    flex: 1,
    padding: '9px',
    fontSize: '13px',
    fontWeight: 600,
    background: '#0a66c2',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '9px 16px',
    fontSize: '13px',
    fontWeight: 600,
    background: 'none',
    color: '#6b7280',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

const EditConnectionForm = ({ connection, onSaved, onCancel }: EditConnectionFormProps) => {
  const [name, setName] = useState(connection.name);
  // const [jobTitle, setJobTitle] = useState(connection.jobTitle ?? '');  // reserved for future phase
  // const [company, setCompany] = useState(connection.company ?? '');     // reserved for future phase
  // const [phone, setPhone] = useState(connection.phone ?? '');           // reserved for future phase
  // const [email, setEmail] = useState(connection.email ?? '');           // reserved for future phase
  const [nameError, setNameError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { setNameError('Name is required'); return; }

    setSaving(true);
    try {
      const updated = await updateConnection(connection.id, {
        name: name.trim(),
        // jobTitle: jobTitle.trim() || undefined,  // reserved for future phase
        // company: company.trim() || undefined,    // reserved for future phase
        // phone: phone.trim() || undefined,        // reserved for future phase
        // email: email.trim() || undefined,        // reserved for future phase
      });
      onSaved(updated);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={s.container}>
      <div style={s.fieldWrap}>
        <label style={s.label}>Name</label>
        <input
          style={s.input}
          value={name}
          onChange={(e) => { setName(e.target.value); if (nameError) setNameError(''); }}
        />
        {nameError && <p style={s.error}>{nameError}</p>}
      </div>

      {/* Job Title — reserved for future phase */}
      {/* <div style={s.fieldWrap}>
        <label style={s.label}>Job Title</label>
        <input
          style={s.input}
          value={jobTitle}
          onChange={(e) => { setJobTitle(e.target.value); }}
        />
      </div> */}

      {/* Company — reserved for future phase */}
      {/* <div style={s.fieldWrap}>
        <label style={s.label}>Company</label>
        <input style={s.input} value={company} onChange={(e) => setCompany(e.target.value)} />
      </div> */}

      {/* Phone — reserved for future phase */}
      {/* <div style={s.fieldWrap}>
        <label style={s.label}>Phone</label>
        <input style={s.input} value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div> */}

      {/* Email — reserved for future phase */}
      {/* <div style={s.fieldWrap}>
        <label style={s.label}>Email</label>
        <input style={s.input} value={email} onChange={(e) => setEmail(e.target.value)} />
      </div> */}

      <div style={s.fieldWrap}>
        <label style={s.label}>LinkedIn URL</label>
        <input style={s.inputReadonly} value={connection.linkedinUrl} readOnly />
      </div>

      <div style={s.row}>
        <button style={s.btnPrimary} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button style={s.btnSecondary} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default EditConnectionForm;
