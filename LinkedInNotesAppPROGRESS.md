# PROGRESS.md — LinkedIn Connection Notes App

> Running log of sessions, decisions, and learning. Update at the end of every session.

---

## 🗺 Build Sequence (Agreed Order)

The order below is intentional — each phase depends on the previous one being understood, not just working.

| Phase | Focus | Why This Order |
|---|---|---|
| 1 | Project setup + folder structure | Everything else depends on this foundation |
| 2 | TypeScript models | Define your data before you build anything that uses it |
| 3 | Storage layer (repository functions) | UI needs somewhere to read/write before it can do anything |
| 4 | Connections list page | Simplest read operation — just display data |
| 5 | Add connection | First write operation |
| 6 | Delete connection | Complete the basic CRUD loop for connections |
| 7 | Connection detail page + notes list | Build on routing knowledge from Phase 1 |
| 8 | Add / edit / delete notes | Repeat CRUD pattern but for a related model |
| 9 | Search | Filter over existing data — no new storage logic needed |
| 10 | Polish | Empty states, validation, UX edge cases |

---

## 📋 Session Log

### Pre-tracking Sessions (reconstructed from codebase)

Work was done across multiple sessions before tracking began. Here's what was built based on the git history and current code:

**Commit 1 — `e26133c` — "first commit - setting up first few components"**
- Initial project scaffolding with Vite + React + TypeScript
- Created Connection and Note type models
- Built early components

**Commit 2 — `42dd5f8` — "new components and files, new fake data, new types"**
- Added placeholder data (5 fake connections in JSON)
- Created ConnectionList, Contact, Navigation components
- Updated type models

**Commit 3 — `43ca436` — "made a few file adjustments so I could add shadcn ui library into project, add tailwind package"**
- Added Tailwind CSS
- Integrated shadcn/ui component library
- Added lib/utils.ts for class merging

**Commit 4 — `968f120` — "add shadcn button component for use in navbar, modify a bit"**
- Added shadcn Button component
- Used it in Navigation for "+ New Contact" button

**Uncommitted work (current state):**
- Added shadcn Dialog, Input, and Label components
- Built AddContactForm component (modal form UI — incomplete, no submit handler)
- Modified App.tsx and Navigation.tsx

---

### Session 1 — 2026-03-02
**Ticket worked on:** Ticket 3a-3d — Build `connectionRepo` storage layer
**What I built:** `src/storage/connectionRepo.ts` with 4 exported functions: `getAllConnections`, `getConnectionById`, `saveConnection`, `deleteConnection`
**What I learned:**
- `JSON.parse()` expects a string — must handle null from `localStorage.getItem()` before it reaches parse (use `|| '[]'` fallback)
- Return empty arrays instead of null — callers can `.map()` directly without null checks
- Repository pattern centralizes storage logic in one file so swapping backends only requires changing one place
- `.find()` returns `undefined` when no match — return type should be `Connection | undefined`
- `.filter()` with `!==` to remove items from an array
- Write functions follow a read-modify-write pattern: get all, change the list, save back
**Quiz answers:**
- Q1: Repo layer exists so storage logic is in one place — if we swap localStorage for Supabase, we change one file instead of every component
- Q2: save and delete both follow read → modify → write back pattern
**Decisions made:** localStorage key for connections is `'connections'`
**Questions / blockers for next time:** Build `noteRepo` next (same patterns)

---

### Session 2 — 2026-03-02
**Ticket worked on:** Ticket 3e-3i — Build `noteRepo` storage layer
**What I built:** `src/storage/noteRepo.ts` with 5 exported functions: `getAllNotes`, `getNotesByConnectionId`, `saveNote`, `deleteNote`, `updateNote`
**What I learned:**
- Notes need a `getNotesByConnectionId` function because a connection can have many notes — connections don't need this because they aren't owned by another model
- `.filter()` decides keep or remove (changes array length). `.map()` decides transform or keep as-is (never changes array length)
- Arrow function implicit vs explicit return: curly braces `{}` require a `return` keyword, no braces means the expression result is returned automatically
- `.map()` with a ternary is the pattern for replacing one item in an array while keeping the rest unchanged
- `saveNote` and `deleteNote` follow the same read-modify-write pattern from `connectionRepo`
**Quiz answers:**
- Q1: noteRepo needs `getNotesByConnectionId` because a connection can have many notes and they need to be retrieved by connection id
- Q2: `.filter()` removes items (doesn't include the unwanted one), `.map()` modifies items without removing any
**Decisions made:** localStorage key for notes is `'notes'`
**Questions / blockers for next time:** Phase 3 (storage layer) complete. Next: wire storage to UI (Phase 4-5)

---

### Session [Next] — [Date]
**Ticket worked on:**
**What I built:**
**What I learned:**
**Quiz answers:**
**Decisions made:**
**Questions / blockers for next time:**

---

*(Copy the session template above for each new session)*

---

## 🧠 Key Decisions Log

> Record decisions here so you don't relitigate them in future sessions.

| Decision | What we chose | Why |
|---|---|---|
| Storage abstraction | Repository pattern (UI → repo → localStorage) | Makes it swappable later (e.g. Supabase) without rewriting UI |
| ID generation | To be decided in session | Options: `crypto.randomUUID()`, `uuid` library, timestamp-based |
| Routing | React Router | Two distinct pages with a dynamic `:id` param needed |
| UI component library | shadcn/ui + Radix UI + Tailwind | Accessible, customizable components with utility-first styling |
| Avatar display | ui-avatars.com API | Generates letter avatars from names, no image upload needed |
| Add contact UI | Modal dialog (shadcn Dialog) | Keeps user on the connections list while adding |
| Connection model changes | Made `jobTitle` and `linkedinUrl` required, added `phone` and `email` | Diverged from original spec — needs review |

---

## 💡 Concepts Learned

> Build this list as you go. It becomes your personal reference.

- React component composition (App → Navigation + ConnectionList → Contact)
- Props and typing with TypeScript (passing Connection arrays between components)
- useEffect for data fetching on mount
- useState for managing component-level state
- Importing and using third-party UI components (shadcn/ui)
- JSON data loading with fetch in React
- JSON.parse() expects a string value only as input so we must handle a null (falsy value) before it reaches this point

---

## ❓ Questions to Come Back To

> Park questions here that came up mid-session but weren't the current focus.

- Should we add `createdAt`/`updatedAt` timestamps back to the Connection model?
- The build sequence was skipped — jumped ahead to UI (Phase 4-5) before building the storage layer (Phase 3). Should we go back and build storage before continuing?
- File organization: components are flat in `src/` instead of in `pages/` and `components/`. Reorganize now or later?
- `useEffect` in ConnectionList has no dependency array — runs every render. Fix needed.
