import { useState } from 'react';
import type { Connection } from '../../../shared/models/connection';
import type { ScrapedProfileData } from '../entrypoints/content/index';
import { saveConnection } from '../storage/connectionRepo';

interface AddConnectionFormProps {
  linkedinUrl: string;
  scrapedData?: ScrapedProfileData;
  onSaved: (connection: Connection) => void;
  onCancel: () => void;
}

const s = {
  container: { padding: '16px' },
  title: { fontSize: '14px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0' },
  field: { marginBottom: '12px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' },
  input: {
    width: '100%',
    padding: '7px 10px',
    fontSize: '13px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    boxSizing: 'border-box' as const,
    outline: 'none',
    fontFamily: 'sans-serif',
  },
  inputDisabled: {
    background: '#f3f4f6',
    color: '#6b7280',
  },
  errorText: { fontSize: '11px', color: '#ef4444', marginTop: '3px' },
  row: { display: 'flex', gap: '8px', marginTop: '16px' },
  btnPrimary: {
    flex: 1,
    padding: '8px',
    fontSize: '13px',
    fontWeight: 600,
    background: '#0a66c2',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '8px 14px',
    fontSize: '13px',
    fontWeight: 600,
    background: 'none',
    color: '#6b7280',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  submitError: { fontSize: '12px', color: '#ef4444', marginTop: '8px' },
};

const AddConnectionForm = ({ linkedinUrl, scrapedData, onSaved, onCancel }: AddConnectionFormProps) => {
  const [name, setName] = useState(scrapedData?.name ?? '');
  // const [jobTitle, setJobTitle] = useState(scrapedData?.jobTitle ?? '');  // reserved for future phase
  // const [company, setCompany] = useState(scrapedData?.company ?? '');     // reserved for future phase
  const avatarUrl = scrapedData?.avatarUrl ?? '';
  // const [phone, setPhone] = useState('');   // reserved for future phase
  // const [email, setEmail] = useState('');   // reserved for future phase
  const [nameError, setNameError] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }

    setLoading(true);
    setSubmitError(null);
    try {
      const saved = await saveConnection({
        name: name.trim(),
        linkedinUrl,
        avatarUrl: avatarUrl || undefined,
        // jobTitle: jobTitle.trim() || undefined,  // reserved for future phase
        // company: company.trim() || undefined,    // reserved for future phase
        // phone: phone.trim() || undefined,        // reserved for future phase
        // email: email.trim() || undefined,        // reserved for future phase
      });
      onSaved(saved);
    } catch {
      setSubmitError('Failed to save. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.container}>
      <p style={s.title}>Add New Connection</p>

      <form onSubmit={handleSubmit} noValidate>
        <div style={s.field}>
          <label style={s.label}>Name *</label>
          <input
            style={s.input}
            value={name}
            onChange={(e) => { setName(e.target.value); setNameError(''); }}
            placeholder="Jane Smith"
            disabled={loading}
          />
          {nameError && <p style={s.errorText}>{nameError}</p>}
        </div>

        {/* Job Title — reserved for future phase */}
        {/* <div style={s.field}>
          <label style={s.label}>Job Title</label>
          <input
            style={s.input}
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Software Engineer"
            disabled={loading}
          />
        </div> */}

        <div style={s.field}>
          <label style={s.label}>LinkedIn URL</label>
          <input
            style={{ ...s.input, ...s.inputDisabled }}
            value={linkedinUrl}
            readOnly
          />
        </div>

        {/* Company — reserved for future phase */}
        {/* <div style={s.field}>
          <label style={s.label}>Company</label>
          <input
            style={s.input}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Google"
            disabled={loading}
          />
        </div> */}

        {/* Phone — reserved for future phase */}
        {/* <div style={s.field}>
          <label style={s.label}>Phone</label>
          <input
            style={s.input}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="555-123-4567"
            disabled={loading}
          />
        </div> */}

        {/* Email — reserved for future phase */}
        {/* <div style={s.field}>
          <label style={s.label}>Email</label>
          <input
            style={s.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            disabled={loading}
          />
        </div> */}

        {submitError && <p style={s.submitError}>{submitError}</p>}

        <div style={s.row}>
          <button type="submit" style={s.btnPrimary} disabled={loading}>
            {loading ? 'Saving...' : 'Add Connection'}
          </button>
          <button type="button" style={s.btnSecondary} onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddConnectionForm;
