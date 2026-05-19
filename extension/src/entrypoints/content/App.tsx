import { useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { Connection } from '../../../../shared/models/connection';
import type { ScrapedProfileData } from './index';
import { supabase } from '../../lib/supabaseClient';
import SignInView from '../../components/SignInView';
import CurrentProfileView from '../../components/CurrentProfileView';
import AddConnectionForm from '../../components/AddConnectionForm';
import EditConnectionForm from '../../components/EditConnectionForm';
import ConnectionsList from '../../components/ConnectionsList';

interface AppProps {
  linkedinUrl: string;
  scrapeProfileData: () => ScrapedProfileData;
}

type PanelView = 'profile' | 'add' | 'edit' | 'list';

const App = ({ linkedinUrl, scrapeProfileData }: AppProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<PanelView>('profile');
  const [savedConnection, setSavedConnection] = useState<Connection | undefined>(undefined);
  const [connectionToEdit, setConnectionToEdit] = useState<Connection | undefined>(undefined);
  const scrapedDataRef = useRef<ScrapedProfileData | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setSessionLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSaved = (connection: Connection) => {
    setSavedConnection(connection);
    scrapedDataRef.current = undefined;
    setView('profile');
  };

  const handleAddConnection = (scraped: ScrapedProfileData) => {
    scrapedDataRef.current = scraped;
    setView('add');
  };

  const handleEdit = (connection: Connection) => {
    setConnectionToEdit(connection);
    setView('edit');
  };

  // reserved for future phase
  // const handleEnrich = (connection: Connection, scraped: ScrapedProfileData) => {
  //   setConnectionToEdit({
  //     ...connection,
  //     jobTitle: scraped.jobTitle,
  //     company: scraped.company || connection.company,
  //   });
  //   setView('edit');
  // };

  const handleEditSaved = (updated: Connection) => {
    setSavedConnection(updated);
    setConnectionToEdit(undefined);
    setView('profile');
  };

  const handleClose = () => {
    setIsOpen(false);
    setView('profile');
  };

  const headerTitle = view === 'add' ? 'Add Connection' : view === 'edit' ? 'Edit Connection' : 'LinkedIn Notes';

  return (
    <div style={{ position: 'fixed', bottom: '70px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      {isOpen && (
        <div
          style={{
            width: '360px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            marginBottom: '12px',
            overflow: 'hidden',
          }}
        >
          {/* Panel header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: '1px solid #e5e7eb',
              background: '#f9fafb',
            }}
          >
            <span style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>
              {headerTitle}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {/* Sign out — only shown when a session exists */}
              {session && (
                <button
                  onClick={() => supabase.auth.signOut()}
                  title="Sign out"
                  style={{
                    background: 'none',
                    border: '1px solid #d1d5db',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    color: '#6b7280',
                    padding: '3px 7px',
                    fontFamily: 'sans-serif',
                  }}
                >
                  Sign out
                </button>
              )}
              {/* Import All — redirects to connections list page to trigger bulk import */}
              <button
                onClick={() => { window.location.href = 'https://www.linkedin.com/mynetwork/invite-connect/connections/'; }}
                title="Import all connections"
                style={{
                  background: 'none',
                  border: '1px solid #d1d5db',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  color: '#6b7280',
                  padding: '3px 7px',
                  fontFamily: 'sans-serif',
                }}
              >
                Import
              </button>
              {/* Toggle between profile and full list — only visible on profile/add views */}
              {view !== 'list' && (
                <button
                  onClick={() => setView('list')}
                  title="All connections"
                  style={{
                    background: 'none',
                    border: '1px solid #d1d5db',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    color: '#6b7280',
                    padding: '3px 7px',
                    fontFamily: 'sans-serif',
                  }}
                >
                  All
                </button>
              )}
              {view === 'list' && (
                <button
                  onClick={() => setView('profile')}
                  title="Current profile"
                  style={{
                    background: 'none',
                    border: '1px solid #d1d5db',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    color: '#6b7280',
                    padding: '3px 7px',
                    fontFamily: 'sans-serif',
                  }}
                >
                  Profile
                </button>
              )}
              <button
                onClick={handleClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#6b7280',
                  lineHeight: 1,
                  padding: '0 4px',
                }}
                aria-label="Close panel"
              >
                ×
              </button>
            </div>
          </div>

          {/* Panel body */}
          {sessionLoading ? (
            <div style={{ padding: '32px', textAlign: 'center', fontSize: '13px', color: '#6b7280', fontFamily: 'sans-serif' }}>
              Loading...
            </div>
          ) : !session ? (
            <SignInView />
          ) : view === 'list' ? (
            <ConnectionsList onClose={() => setView('profile')} />
          ) : view === 'add' ? (
            <AddConnectionForm
              linkedinUrl={linkedinUrl}
              scrapedData={scrapedDataRef.current}
              onSaved={handleSaved}
              onCancel={() => setView('profile')}
            />
          ) : view === 'edit' && connectionToEdit ? (
            <EditConnectionForm
              connection={connectionToEdit}
              onSaved={handleEditSaved}
              onCancel={() => setView('profile')}
            />
          ) : (
            <CurrentProfileView
              linkedinUrl={linkedinUrl}
              savedConnection={savedConnection}
              onAddConnection={handleAddConnection}
              scrapeProfileData={scrapeProfileData}
              onEdit={handleEdit}
              // onEnrich={handleEnrich}  // reserved for future phase
            />
          )}
        </div>
      )}

      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        title="LinkedIn Notes"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'transparent',
          border: '1px solid #0f1b2d',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.08)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
        }}
        aria-label="Toggle LinkedIn Notes panel"
      >
        <img
          src={chrome.runtime.getURL('icon/128.png')}
          alt="Conntext"
          style={{ width: '28px', height: '28px', display: 'block', borderRadius: '6px' }}
        />
      </button>
    </div>
  );
};

export default App;
