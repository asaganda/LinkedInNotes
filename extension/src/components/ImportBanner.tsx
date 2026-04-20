import { useState } from 'react';
import { saveConnection } from '../storage/connectionRepo';
import { supabase } from '../lib/supabaseClient';
import normaliseLinkedinUrl from '../../../shared/utils/normaliseLinkedinUrl';

type BannerState = 'confirm' | 'importing' | 'done' | 'dismissed';

// Scrapes all currently visible connection cards from the DOM.
// Each card is a direct child div of [data-testid="lazy-column"].
// Returns an array of { name, avatarUrl, linkedinUrl } objects.
const scrapeVisibleCards = (): { name: string; avatarUrl: string; linkedinUrl: string }[] => {
  const cards = document.querySelectorAll('[data-testid="lazy-column"] > div');
  const results: { name: string; avatarUrl: string; linkedinUrl: string }[] = [];

  cards.forEach((card) => {
    // Profile URL — href on the anchor wrapping the avatar figure
    const avatarAnchor = card.querySelector('a[href*="linkedin.com/in/"]');
    const rawUrl = avatarAnchor?.getAttribute('href') ?? '';
    const linkedinUrl = normaliseLinkedinUrl(rawUrl);
    if (!linkedinUrl.includes('linkedin.com/in/')) return;

    // Avatar — img with alt containing "profile picture" inside the avatar anchor
    const avatarUrl =
      avatarAnchor?.querySelector('img[alt*="profile picture"]')?.getAttribute('src') ?? '';

    // Name — first <p> inside the second a[href*="linkedin.com/in/"] (the name link)
    const allProfileAnchors = card.querySelectorAll('a[href*="linkedin.com/in/"]');
    const nameAnchor = allProfileAnchors[1];
    const name = nameAnchor?.querySelector('p')?.textContent?.trim() ?? '';

    if (name && linkedinUrl) {
      results.push({ name, avatarUrl, linkedinUrl });
    }
  });

  return results;
};

// Checks whether a linkedinUrl already exists in Supabase.
const connectionExists = async (linkedinUrl: string): Promise<boolean> => {
  const { data } = await supabase
    .from('connections')
    .select('id')
    .eq('linkedin_url', linkedinUrl)
    .maybeSingle();
  return !!data;
};

const s = {
  wrapper: {
    position: 'fixed' as const,
    bottom: '20px',
    right: '20px',
    zIndex: 9999,
    width: '300px',
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    padding: '16px',
    fontFamily: 'sans-serif',
  },
  title: { fontSize: '14px', fontWeight: 700, color: '#111827', margin: '0 0 6px 0' },
  sub: { fontSize: '12px', color: '#6b7280', margin: '0 0 14px 0' },
  progress: { fontSize: '13px', color: '#374151', margin: '0 0 4px 0' },
  row: { display: 'flex', gap: '8px', marginTop: '4px' },
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
};

const ImportBanner = () => {
  const [bannerState, setBannerState] = useState<BannerState>('confirm');
  const [imported, setImported] = useState(0);
  const [skipped, setSkipped] = useState(0);

  const runImport = async () => {
    setBannerState('importing');

    // Phase 1 — scroll to load all cards before processing any.
    // LinkedIn locks window scroll — the actual scrollable container is #workspace.
    const scrollContainer = document.getElementById('workspace') ?? document.documentElement;
    let previousCardCount = 0;
    let stalledCount = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // Scroll to the very bottom of the container to maximally trigger lazy loading
      scrollContainer.scrollTo(0, scrollContainer.scrollHeight);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const currentCount = scrapeVisibleCards().length;
      if (currentCount > previousCardCount) {
        previousCardCount = currentCount;
        stalledCount = 0;
      } else {
        stalledCount++;
        // Only stop after 3 consecutive scrolls with no new cards
        if (stalledCount >= 3) break;
      }
    }

    // Phase 2 — process all loaded cards
    const allCards = scrapeVisibleCards();
    let totalImported = 0;
    let totalSkipped = 0;

    for (const card of allCards) {
      const exists = await connectionExists(card.linkedinUrl);
      if (exists) {
        totalSkipped++;
      } else {
        try {
          await saveConnection({
            name: card.name,
            jobTitle: '',
            company: undefined,
            linkedinUrl: card.linkedinUrl,
            phone: undefined,
            email: undefined,
            avatarUrl: card.avatarUrl || undefined,
          });
          totalImported++;
        } catch {
          // Skip on error — don't abort the whole import
        }
      }
      setImported(totalImported);
      setSkipped(totalSkipped);
    }

    setBannerState('done');
  };

  if (bannerState === 'dismissed') return null;

  return (
    <div style={s.wrapper}>
      {bannerState === 'confirm' && (
        <>
          <p style={s.title}>Import Connections</p>
          <p style={s.sub}>Import your LinkedIn connections to LinkedIn Notes?</p>
          <div style={s.row}>
            <button style={s.btnPrimary} onClick={runImport}>Start Import</button>
            <button style={s.btnSecondary} onClick={() => setBannerState('dismissed')}>Dismiss</button>
          </div>
        </>
      )}

      {bannerState === 'importing' && (
        <>
          <p style={s.title}>Importing...</p>
          <p style={s.progress}>{imported} saved, {skipped} skipped</p>
          <p style={{ fontSize: '11px', color: '#9ca3af', margin: '6px 0 0 0' }}>
            You can switch tabs — import continues in the background.
          </p>
        </>
      )}

      {bannerState === 'done' && (
        <>
          <p style={s.title}>Import Complete</p>
          <p style={s.progress}>Done — {imported} imported, {skipped} skipped</p>
          <div style={s.row}>
            <button style={s.btnPrimary} onClick={() => setBannerState('dismissed')}>Close</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImportBanner;
