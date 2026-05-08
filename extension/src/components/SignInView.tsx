import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const s = {
  container: {
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '16px',
    fontFamily: 'sans-serif',
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#111827',
    margin: 0,
  },
  subtitle: {
    fontSize: '13px',
    color: '#6b7280',
    margin: 0,
    textAlign: 'center' as const,
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  button: {
    width: '100%',
    padding: '9px',
    background: '#0a66c2',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed' as const,
  },
  error: {
    fontSize: '12px',
    color: '#dc2626',
    margin: 0,
  },
  success: {
    fontSize: '13px',
    color: '#16a34a',
    textAlign: 'center' as const,
    margin: 0,
  },
};

const SignInView = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setLoading(true);
    const redirectTo = `chrome-extension://${chrome.runtime.id}/`;
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div style={s.container}>
      <p style={s.title}>Sign in to LinkedIn Notes</p>

      {sent ? (
        <p style={s.success}>
          Magic link sent! Check your email and click the link to sign in — then come back to this tab.
        </p>
      ) : (
        <>
          <p style={s.subtitle}>Enter your email and we'll send you a sign-in link.</p>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={s.input}
          />
          {error && <p style={s.error}>{error}</p>}
          <button
            onClick={handleSend}
            disabled={loading}
            style={{ ...s.button, ...(loading ? s.buttonDisabled : {}) }}
          >
            {loading ? 'Sending...' : 'Send magic link'}
          </button>
        </>
      )}
    </div>
  );
};

export default SignInView;
