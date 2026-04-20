# CLAUDE.md — LinkedIn Notes Browser Extension

## 🧠 About This Project

A Chrome browser extension that lets users view and manage notes about their LinkedIn connections directly on LinkedIn profile pages. This is the second client in a multi-platform system — the same Supabase backend powers this extension, a web app (already built), and a future mobile app.

**Problem it solves:** When you land on a LinkedIn profile, you have no context about that person unless you remember it. This extension surfaces your private notes about that connection right inside LinkedIn — no tab switching, no friction.

**What this extension does:**
- Detects when the user is on a LinkedIn profile page (`linkedin.com/in/*`)
- Looks up that person in Supabase by their LinkedIn URL
- Shows their note (and lets you add/edit/delete it) directly in the popup
- Optionally shows the full connections list via a toggle
- Detects when the user is on their LinkedIn connections list page and offers a one-click bulk import

**What this extension does NOT (yet):**
- Require login / auth (single user MVP, no auth layer)
- Sync in real-time across open tabs
- Support Firefox or other browsers (Chrome only for MVP)

---

## 🏗 Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Extension Framework | WXT | Handles Manifest V3 boilerplate, file-based entrypoints, HMR dev mode |
| UI Framework | React | Same as webapp — reuse components |
| Language | TypeScript | Shared types with webapp via `../../shared/` |
| Build Tool | Vite (via WXT) | WXT wraps Vite under the hood |
| Backend / DB | Supabase | Postgres + REST API, same project as all other clients |
| UI Components | shadcn/ui + Radix UI | Same as webapp |
| Styling | Tailwind CSS | Same as webapp |
| Icons | Lucide React | Same as webapp |

**Not using:** React Router (no routing needed in a popup), localStorage (Supabase replaces it), any auth library (no auth in MVP)

---

## 🗂 Monorepo Structure

```
LinkedInNotes/
  webapp/           # Existing React + TypeScript web app (do not break)
  extension/        # This project — Chrome extension built with WXT
  shared/           # Shared TypeScript types + utils used by both projects
                    # Import path from webapp/src/: ../../shared/
                    # Import path from extension/src/: ../../shared/
    models/
      connection.ts
      note.ts
    utils/
      getInitials.ts
```

### Extension folder structure (WXT conventions)

```
extension/
  src/
    entrypoints/
      content.ts          # Content script — injects panel, detects URL, scrapes DOM
      background.ts       # Service worker — handles cross-context messaging if needed
    components/
      CurrentProfileView.tsx   # Default view — shows note for current LinkedIn profile
      ConnectionsList.tsx      # Toggle view — full scrollable list of all connections
      NoteEditor.tsx           # Add/edit/delete note inline
      ConnectionCard.tsx       # Single connection row (adapted from webapp Contact.tsx)
      AddConnectionForm.tsx    # Form to add a new connection (adapted from webapp)
      EditConnectionForm.tsx   # Phase 12 — edit an existing connection's info
      ImportBanner.tsx         # Phase 11 — banner shown on LinkedIn connections list page
      # No EmptyState component — extension only activates on linkedin.com/in/* pages
    storage/
      connectionRepo.ts   # Supabase CRUD for connections (mirrors webapp pattern)
      noteRepo.ts         # Supabase CRUD for notes (mirrors webapp pattern)
    lib/
      supabaseClient.ts   # Supabase client initialisation
      utils.ts            # cn() helper for Tailwind class merging
  wxt.config.ts
  package.json
  tsconfig.json
  .env                    # VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (never commit)
```

---

## 🧾 Data Models

Defined in `../../shared/models/` and imported by both `webapp` and `extension`.

```typescript
// shared/models/connection.ts
type Connection = {
  id: string
  name: string
  jobTitle: string
  company?: string
  linkedinUrl: string
  phone?: string
  email?: string
  avatarUrl?: string      // Added in Phase 10 — scraped from LinkedIn DOM
  createdAt: string
  updatedAt: string
}

// shared/models/note.ts
type Note = {
  id: string
  connectionId: string
  body: string
  createdAt: string
  updatedAt: string
}
```

> `createdAt` and `updatedAt` are managed automatically by Supabase via `default now()` in the schema.
> `avatarUrl` is optional — connections added before Phase 10 fall back to the initials avatar.

---

## 🗄 Supabase Schema

See `schema.sql` at the repo root. Tables:

**connections**
- `id` uuid primary key default gen_random_uuid()
- `name` text not null
- `job_title` text not null
- `company` text
- `linkedin_url` text not null unique
- `phone` text
- `email` text
- `avatar_url` text         ← added in Phase 10 (alter table migration)
- `created_at` timestamptz default now()
- `updated_at` timestamptz default now()

**notes**
- `id` uuid primary key default gen_random_uuid()
- `connection_id` uuid references connections(id) on delete cascade
- `body` text not null
- `created_at` timestamptz default now()
- `updated_at` timestamptz default now()

> `linkedin_url` has a unique constraint — this is how the extension looks up a connection from the current tab URL.

---

## 💾 Storage Architecture

Same repository pattern as the webapp. UI never touches Supabase directly.

```
UI → Repository functions → Supabase client → Supabase DB
```

Storage lives in `src/storage/` — never call `supabase` directly from components.

---

## 🖥 Injected Panel UI — Two Modes

The UI is a floating panel (~400px wide) injected directly into the LinkedIn page by the content script. No Chrome toolbar popup. Mode is controlled by a single boolean state in the root `App` component.

On `linkedin.com/in/*` pages, a small floating button is injected on the side of the page. The full panel is hidden by default. Clicking the button opens the full panel. Clicking the button again (or a close button) hides it.

### Default mode — Current Profile View

- Content script normalises the current page URL
- Panel looks up the connection in Supabase by `linkedin_url`
- **If found:** shows connection name, job title, company + their note. Note is editable/deletable inline. Edit connection info button available (Phase 12).
- **If not found:** shows an "Add this person" button. Clicking opens `AddConnectionForm` pre-filled with the LinkedIn URL and any data scraped from the page (Phase 9 onwards).

### Toggle mode — Full Connections List

Accessed via a toggle button in the panel header.

- Pulls all connections from Supabase
- Scrollable list using `ConnectionCard` component
- Search/filter bar at the top
- Clicking a connection shows their note inline (no navigation — same panel, replace content)
- Toggle button switches back to Current Profile View

---

## 🔌 Content Script Behaviour

`entrypoints/content.ts` runs on `linkedin.com/in/*` pages AND `linkedin.com/mynetwork/invite-connect/connections/`.

**On profile pages (`linkedin.com/in/*`):**
- Injects the React panel UI into the LinkedIn page DOM using WXT's `createShadowRootUi`
- Normalises the current page URL: `https://www.linkedin.com/in/username` — strip query params and trailing slashes
- Passes the normalised URL as a prop to the root `App` component
- Shadow DOM is used so extension styles don't clash with LinkedIn's styles
- Phase 8+: uses `MutationObserver` to detect LinkedIn SPA navigation and re-renders with the new URL
- Phase 9+: scrapes the profile DOM for name, job title, company and passes as props to `App`
- Phase 10+: also scrapes the profile picture URL from the DOM and passes as a prop

**On the connections list page (`linkedin.com/mynetwork/invite-connect/connections/`):**
- Phase 11+: injects `ImportBanner` as a floating card (bottom-right, same position as the profile panel)
- User arrives here by clicking "Import All" in the panel header on a profile page
- Banner has three states: confirmation → progress → completion
- Confirmation: "Import your connections to LinkedIn Notes?" with [Start Import] and [Dismiss] buttons
- On [Start Import]: scrapes visible connection cards (name, avatar URL, LinkedIn URL), auto-scrolls to load more, repeats until done
- Each connection saved to Supabase immediately — progress preserved if tab is closed
- Duplicates skipped silently
- Progress: "Importing... 47 saved" live counter
- Completion: "Done — 312 imported, 4 skipped" with [Close] button

URL normalisation rule: store and match on `https://www.linkedin.com/in/username` — strip everything after the username slug.

---

## 🤝 Working Agreement

> Read this before every session.

This extension is being built with Claude Code acting as the agent/implementer. However the developer still wants to understand what was built and why — not just that it works.

### After each phase Claude Code completes:

1. **Summarise what was built** — what files were created/changed and why
2. **Explain one key architectural decision** made in that phase — why that approach over alternatives
3. **Flag anything deferred** — what was intentionally left out and why
4. **Ask the developer one review question** — something that checks understanding of what was just built

The developer will review the code, ask questions, and sign off before the next phase begins.

### What Claude Code should NOT do:
- Skip ahead to the next phase without a summary + sign-off
- Make auth decisions (no auth in MVP — if something requires auth, flag it and wait)
- Change the shared types without noting it explicitly
- Access localStorage anywhere in the extension (Supabase only)
- Break the existing webapp

---

## 📍 Current Status

> Update this section at the end of every phase.

**Currently working on:** Phase 12 complete — ready for Phase 13

### Build Checklist

- [x] **Phase 0** — Shared types extracted + schema written
  - [x] `webapp/`, `extension/`, `shared/` folders already created by developer
  - [x] `shared/models/connection.ts` and `shared/models/note.ts` created
  - [x] `shared/utils/getInitials.ts` created
  - [x] `webapp` imports updated to point to `../../shared/`
  - [x] Webapp still runs after import updates
  - [x] `schema.sql` written at repo root

- [x] **Phase 1** — WXT scaffold + Supabase client
  - [x] WXT project initialised in `extension/`
  - [x] React + TypeScript + Tailwind configured
  - [x] `supabaseClient.ts` created with env var config
  - [x] `.env` wired up (not committed)
  - [ ] Popup renders a blank shell ("Extension is working") in Chrome — verify manually

- [x] **Phase 2** — Storage / repository layer
  - [x] `connectionRepo.ts` — getAll, getByLinkedinUrl, save, delete
  - [x] `noteRepo.ts` — getByConnectionId, save, update, delete
  - [x] All repo functions use Supabase client, not localStorage
  - [ ] Tested manually — data reads/writes to Supabase correctly (verify in Phase 4 when UI is wired up)

- [x] **Phase 3** — Content script + URL detection
  - [x] Content script runs on `linkedin.com/in/*`
  - [x] Normalises LinkedIn profile URL correctly
  - [x] Sends URL to popup via message passing (approach changed — popup now queries tab URL directly)
  - [x] Popup receives URL and displays it (verified working)

- [x] **Phase 4** — Injected floating panel (replaces toolbar popup)
  - [x] Content script rewritten to inject React UI via `createShadowRootUi`
  - [x] Small floating button injected on the side of the page (always visible on `linkedin.com/in/*`)
  - [x] Full panel hidden by default — opens when button is clicked, closes when clicked again
  - [x] Panel passes normalised LinkedIn URL to `App` component
  - [x] `src/entrypoints/popup/` removed (replaced by injected UI)

- [x] **Phase 5** — Current Profile View
  - [x] Panel uses LinkedIn URL to call `getConnectionByLinkedinUrl`
  - [x] Found state: shows connection name, job title, company + note
  - [x] Not found state: shows "Add this person" button pre-filled with LinkedIn URL
  - [x] Note add/edit/delete working inline

- [x] **Phase 6** — Add Connection form
  - [x] `AddConnectionForm` adapted from webapp
  - [x] Pre-fills `linkedinUrl` from current page URL
  - [x] Saves to Supabase on submit
  - [x] Returns to Current Profile View after save

- [x] **Phase 7** — Full Connections List toggle
  - [x] Toggle button in panel header
  - [x] Pulls all connections from Supabase
  - [x] Search/filter working
  - [x] Clicking a connection shows their note inline
  - [x] Toggle back to Current Profile View works

- [x] **Phase 8** — SPA navigation fix
  - [x] `MutationObserver` added to content script watching for LinkedIn URL changes
  - [x] Observer fires when `window.location.href` changes without a full page reload
  - [x] On navigation detected: tears down old UI, mounts fresh `App` with new URL prop
  - [x] `isProfileUrl` guard ensures observer only reacts on `/in/*` URLs (ignores feed, messaging, etc.)
  - [x] Observer disconnected on `ctx.onInvalidated()` (extension context teardown)
  - [x] Tested by clicking between multiple LinkedIn profiles — panel updates correctly each time (verify manually)

- [x] **Phase 9** — DOM scraping to auto-fill Add Connection form
  - [x] `scrapeProfileData()` function added to content script — reads the LinkedIn DOM at call time, returns `{ name, jobTitle, company }`
  - [x] Scraping only runs when the user clicks "Add this person" — not on page load, not for profiles already in the DB
  - [x] All DOM selectors documented with a comment explaining what each one targets
  - [x] `scrapeProfileData` passed as a function prop from content script → `App` → `CurrentProfileView`
  - [x] `CurrentProfileView` calls it when the user clicks "Add this person", passes result to `AddConnectionForm`
  - [x] `AddConnectionForm` accepts scraped fields as optional props and uses them as initial state values
  - [x] User can edit or clear any pre-filled field before saving — scraping only sets defaults, never locks fields
  - [x] If a DOM element is not found, that field is left blank — no crash, no error thrown
  - [x] Tested on a real LinkedIn profile — name, job title, company populate in the form correctly (verify manually)

- [x] **Phase 10** — Profile picture scraping + avatarUrl
  - [x] Content script also scrapes the profile picture URL from the LinkedIn DOM
  - [x] `avatarUrl?: string` field added to `Connection` type in `../../shared/models/connection.ts`
  - [x] `avatar_url text` column added to Supabase `connections` table — ALTER TABLE migration SQL written and noted for developer to run in Supabase SQL editor
  - [x] `connectionRepo.ts` updated to include `avatarUrl` in save and read operations
  - [x] `AddConnectionForm` receives scraped `avatarUrl` as a prop and includes it in the saved connection object
  - [x] `ConnectionCard` displays `avatarUrl` in the avatar image when present, falls back to initials when not
  - [x] `CurrentProfileView` also displays `avatarUrl` when present
  - [x] Tested: photo shows for a newly added connection; initials still show for connections added before Phase 10

- [x] **Phase 11** — Bulk import from LinkedIn connections list page
  - [x] **Entry point:** "Import" button added to the panel header in `App.tsx` — redirects to connections list page
  - [x] Clicking "Import" redirects the tab to `https://www.linkedin.com/mynetwork/invite-connect/connections/`
  - [x] Content script extended to also match `linkedin.com/mynetwork/invite-connect/connections/` — injects `ImportBanner` component on that page
  - [x] `ImportBanner` is a floating card (bottom-right, same position as the panel on profile pages) — NOT injected into the LinkedIn page body
  - [x] **Confirmation state:** banner shows "Import your connections to LinkedIn Notes?" with [Start Import] and [Dismiss] buttons
  - [x] On [Start Import]: content script begins scraping visible connection cards
  - [x] On [Dismiss]: banner disappears
  - [x] Each card scrapes: name, profile image URL, and LinkedIn profile URL
  - [x] Selectors (confirmed from DOM snapshot):
    - Profile URL: `href` on `a[href*="linkedin.com/in/"]` — the anchor wrapping the avatar figure
    - Avatar: `img[alt*="profile picture"]` inside that anchor's `<figure>`
    - Name: first `<p>` inside the second `a[href*="linkedin.com/in/"]` anchor (the name link)
  - [x] Each card is scoped to `[data-testid="lazy-column"] > div` to avoid selecting unrelated links
  - [x] LinkedIn URL normalised with shared `normaliseLinkedinUrl()` from `shared/utils/`
  - [x] Auto-scroll loop: scrolls `#workspace` container to bottom, waits 3s, repeats — stops after 3 consecutive scrolls with no new cards
  - [x] Each scraped connection is saved to Supabase immediately (not batched at the end) so progress is preserved if user closes the tab
  - [x] Duplicate check: if `linkedinUrl` already exists in Supabase, that connection is skipped silently
  - [x] `jobTitle` and `company` default to empty string for bulk-imported connections
  - [x] **Progress state:** banner updates live with saved/skipped counters while running
  - [x] Import runs asynchronously — user can leave the tab or switch tabs and it continues
  - [x] **Completion state:** banner updates to "Done — X imported, Y skipped" with a [Close] button
  - [x] Tested with a real LinkedIn connections list — scrolling, importing, and duplicate skipping all working

- [x] **Phase 12** — Edit connection info
  - [x] Edit button added to `CurrentProfileView` — visible when a connection is found in Supabase
  - [x] Clicking edit opens `EditConnectionForm` inline in the panel, replacing the connection detail view
  - [x] `EditConnectionForm` pre-fills all current connection fields: name, jobTitle, company, linkedinUrl, phone, email
  - [x] `linkedinUrl` field is read-only in the edit form — it is the unique key and should not be changed
  - [x] On save: calls `updateConnection` in `connectionRepo.ts`
  - [x] `updateConnection` in Supabase uses an `update` query matched by `id`, and sets `updated_at` to `now()`
  - [x] On save success: returns to `CurrentProfileView` showing the updated connection info
  - [x] On cancel: returns to `CurrentProfileView` with no changes made
  - [x] Validation: name and jobTitle are required — show inline error if blank on save attempt
  - [x] Edit also accessible from the connections list detail view
  - [x] Tested: edit a connection, save, confirm updated info and note both appear correctly in the panel

---

### Known Issues / Deferred
- No auth — single user only, no row-level security in Supabase for MVP
- No real-time sync across tabs
- Error messages on name/jobTitle fields don't clear on typing (inherited from webapp — revisit later)
- ConnectionsList re-fetches all connections on every mount — needs caching in App.tsx for performance
- Client-side search loads the full connections list into memory — fine for MVP but won't scale. Should switch to Supabase-side filtering (ilike query) beyond a certain threshold
- Phone and email scraping from LinkedIn DOM not implemented — phone/email are sometimes in a "Contact info" popup (not the main DOM) or in the About section. Inconsistent across profiles. Deferred until a reliable scraping approach is identified. For now, user fills these fields manually in the Add Connection form.
- Job title and company scraping requires Experience section to be in the DOM — LinkedIn lazy-loads it on scroll. If the user hasn't scrolled to it before clicking "Add this person", those fields come back empty. Current fix: tip text below the button tells the user to scroll first. Better fix (Option 4): MutationObserver that waits for the Experience section to appear and updates the form fields once it does. Deferred.
- Stale connection info not handled — if a saved connection updates their name, job title, or company on LinkedIn, the panel will continue showing the old saved data. No automatic sync or "refresh from LinkedIn" feature exists. Options to address: a manual "re-scrape" button in the panel, or a prompt when the scraped DOM data differs from what's saved. To be planned together.
- MutationObserver debouncing not implemented — LinkedIn's SPA can trigger many DOM mutations during a single navigation; rapid-fire observer callbacks could cause multiple remounts to stack. A 300ms debounce on the observer callback would prevent this. Deferred pending testing to confirm if it's an actual problem in practice.
- Bulk import saves one connection at a time — 1,272 connections = 1,272 Supabase round trips. Switching to a single batched `insert` call would be significantly faster. Deferred because the current approach works correctly; live progress counter would need to be replaced with a spinner or removed entirely if batching is adopted.
- Avatar URL expiry — LinkedIn CDN URLs for profile photos contain a token (`?e=...&t=...`) that expires after a period of time. A stored `avatarUrl` will eventually 404, causing the avatar to silently fall back to initials. Options to address: re-scrape and update `avatarUrl` on each visit to the profile, or use a proxy/cache layer. Deferred for MVP — fallback to initials is acceptable for now.
