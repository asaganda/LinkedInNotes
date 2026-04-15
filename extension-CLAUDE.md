# CLAUDE.md — LinkedIn Notes Browser Extension

## 🧠 About This Project

A Chrome browser extension that lets users view and manage notes about their LinkedIn connections directly on LinkedIn profile pages. This is the second client in a multi-platform system — the same Supabase backend powers this extension, a web app (already built), and a future mobile app.

**Problem it solves:** When you land on a LinkedIn profile, you have no context about that person unless you remember it. This extension surfaces your private notes about that connection right inside LinkedIn — no tab switching, no friction.

**What this extension does:**
- Detects when the user is on a LinkedIn profile page (`linkedin.com/in/*`)
- Looks up that person in Supabase by their LinkedIn URL
- Shows their note (and lets you add/edit/delete it) directly in the popup
- Optionally shows the full connections list via a toggle

**What this extension does NOT (yet):**
- Require login / auth (single user MVP, no auth layer)
- Auto-scrape profile data (user manually adds connections for now)
- Sync in real-time across open tabs
- Support Firefox or other browsers (Chrome only for MVP)

---

## 🏗 Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Extension Framework | WXT | Handles Manifest V3 boilerplate, file-based entrypoints, HMR dev mode |
| UI Framework | React | Same as webapp — reuse components |
| Language | TypeScript | Shared types with webapp via `../shared/` |
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
      popup/
        index.html
        main.tsx
        App.tsx           # Root popup component — owns view mode state
      content.ts          # Content script — detects LinkedIn profile URL, sends to popup
      background.ts       # Service worker — handles cross-context messaging if needed
    components/
      CurrentProfileView.tsx   # Default view — shows note for current LinkedIn profile
      ConnectionsList.tsx      # Toggle view — full scrollable list of all connections
      NoteEditor.tsx           # Add/edit/delete note inline
      ConnectionCard.tsx       # Single connection row (adapted from webapp Contact.tsx)
      AddConnectionForm.tsx    # Form to add a new connection (adapted from webapp)
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

> Note: `createdAt` and `updatedAt` are added here for the Supabase layer even though the webapp MVP omitted them. Supabase can auto-manage these with `default now()` in the schema.

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

The repo function signatures mirror the webapp exactly — the only difference is the implementation (Supabase instead of localStorage).

---

## 🖥 Injected Panel UI — Two Modes

The UI is a floating panel (~400px wide) injected directly into the LinkedIn page by the content script. No Chrome toolbar popup. Mode is controlled by a single boolean state in the root `App` component.

On `linkedin.com/in/*` pages, a small floating button is injected on the side of the page. The full panel is hidden by default. Clicking the button opens the full panel. Clicking the button again (or a close button) hides it.

### Default mode — Current Profile View

- Content script normalises the current page URL
- Panel looks up the connection in Supabase by `linkedin_url`
- **If found:** shows connection name, job title, company + their note. Note is editable/deletable inline.
- **If not found:** shows an "Add this person" button. Clicking opens `AddConnectionForm` pre-filled with the LinkedIn URL.

### Toggle mode — Full Connections List

Accessed via a toggle button in the panel header.

- Pulls all connections from Supabase
- Scrollable list using `ConnectionCard` component
- Search/filter bar at the top
- Clicking a connection shows their note inline (no navigation — same panel, replace content)
- Toggle button switches back to Current Profile View

---

## 🔌 Content Script Behaviour

`entrypoints/content.ts` runs on every `linkedin.com/in/*` page.

- Injects the React panel UI into the LinkedIn page DOM using WXT's `createShadowRootUi`
- Normalises the current page URL: `https://www.linkedin.com/in/username` — strip query params and trailing slashes
- Passes the normalised URL as a prop to the root `App` component
- Shadow DOM is used so extension styles don't clash with LinkedIn's styles

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

**Currently working on:** Complete — all phases shipped

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

### Known Issues / Deferred
- No auth — single user only, no row-level security in Supabase for MVP
- No real-time sync across tabs
- Avatar photo URLs not implemented (initials fallback only)
- Error messages on name/jobTitle fields don't clear on typing (inherited from webapp — revisit later)
- ConnectionsList re-fetches all connections on every mount — needs caching in App.tsx for performance
- Client-side search loads the full connections list into memory — fine for MVP but won't scale when the extension is published and users have large datasets. Should switch to Supabase-side filtering (ilike query) beyond a certain threshold
- SPA navigation not handled — navigating between LinkedIn profiles without a full page reload does not update the panel. Needs MutationObserver in content script to detect URL changes and re-render with new URL
