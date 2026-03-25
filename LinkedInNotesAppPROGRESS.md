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
| 11 | Mobile UI | Make the two screens look and feel like a real mobile app |
| 12 | Tablet/Desktop responsive layout | Master-detail panel layout — list stays visible, detail opens on right |
| 13 | shadcn/ui component upgrades | Swap raw elements for richer components where it's a clean win (deferred — decide after Phase 12) |

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

**Commit 5 — `b599669` — "add a few shadcn components, add claude.md and progress.md files for claude guidance as senior dev and learning, code up localstorage data layer logic for app - placeholder api"**
- Added shadcn Dialog, Input, and Label components
- Built AddContactForm component (modal form UI)
- Added CLAUDE.md and PROGRESS.md tracking files
- Built connectionRepo and noteRepo storage layer

**Commit 6 — `038fea8` — "Seed localStorage with placeholder data and read from the repo, some refactoring and variable name changes"**
- Seeding logic in App.tsx function body
- ConnectionList reads from getAllConnections() via useState initial value
- Refactored prop names in Contact.tsx

**Commit 7 — `bb9be27` — "wire up the AddContactForm submit handler to save a new connection, move around state variables so components have latest data"**
- handleSubmit in AddContactForm: builds Connection object, saves to localStorage, updates state
- Lifted dialogOpen and connections state to App.tsx
- Wired controlled Dialog with open/onOpenChange props
- Added TypeScript props types to Navigation, ConnectionList, AddContactForm

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

### Session 3 — 2026-03-03
**Ticket worked on:** Ticket 4a — Seed localStorage with placeholder data and read from the repo; Ticket 5a — Wire up AddContactForm submit handler to save a new connection to localStorage
**What I built:**
- Seeding logic in `App.tsx` function body: checks if localStorage is null, seeds with placeholder data before `useState` reads it
- `ConnectionList` now reads from `getAllConnections()` via `useState` initial value (removed `useEffect` and `fetch()`)
- `handleSubmit` in `AddContactForm`: builds Connection object from form state, generates ID with `crypto.randomUUID()`, saves with `saveConnection()`, closes dialog, updates connections state
- Lifted `dialogOpen` state to `App`, passed as props to `Navigation` and `AddContactForm`
- Lifted `connections` state to `App`, passed as props to `ConnectionList` and `AddContactForm`
- Wired shadcn `Dialog` with `open` and `onOpenChange` props for controlled open/close
- Added TypeScript props types to `Navigation`, `ConnectionList`, and `AddContactForm`
**What I learned:**
- React render flow: function body code runs during render (top-down), `useEffect` runs after render. Seeding localStorage had to be in the function body so child components could read it during the same render.
- `useState` initial value runs once during first render — for synchronous data like localStorage, no `useEffect` needed
- Lifting state up: when siblings need to share state, move it to their common parent. Signal: "how do I get data from here to over there?" between siblings.
- Controlled components pattern: parent owns state (`open`), child reports changes (`onOpenChange`). Same pattern as `value`/`onChange` on inputs.
- `useState` callback form `setConnections(prev => [...prev, newItem])` — React gives guaranteed latest state as `prev`, safer than using a potentially stale snapshot variable
- TypeScript: when typing a setState prop that accepts callbacks, type must include both forms: `(value: T[] | ((prev: T[]) => T[])) => void`
- `SubmitEvent<HTMLFormElement>` replaces deprecated `FormEvent` in React 19
- `crypto.randomUUID()` for generating unique IDs — no library needed
- shadcn/Radix Dialog props come from the underlying Radix library, not the wrapper file — look up Radix docs or hover in IDE
**Quiz answers:**
- Q1: Connections state needed to live in `App` because both `ConnectionList` (needs the value) and `AddContactForm` (needs the setter) required access — siblings can't share state directly, so it lifts to their common parent
- Q2: Callback form `prev => [...prev, newItem]` is safer because React gives the guaranteed latest state, while the direct form uses a snapshot that could be stale if multiple updates are queued
**Decisions made:** ID generation uses `crypto.randomUUID()`, localStorage seeding happens in `App` function body (not `useEffect`)
**Questions / blockers for next time:** Phase 4-5 complete. Next: delete connection (Phase 6)

---

### Session 4 — 2026-03-04
**Ticket worked on:** Ticket 6a — Add delete button to each connection card
**What I built:**
- `handleDelete` function in Contact.tsx: calls `deleteConnection(id)` to remove from localStorage, then `setConnections()` with `.filter()` to update UI state
- Delete button on each connection card with `onClick={() => handleDelete(contact.id)}`
- Threaded `setConnections` prop from App → ConnectionList → Contact (prop drilling)
- Added TypeScript props types for `setConnections` in ConnectionList and Contact
**What I learned:**
- Delete requires two actions: remove from storage (persistence) AND update React state (UI). Skipping either causes storage/UI to be out of sync.
- If you only update storage but not state: UI looks the same until refresh. If you only update state but not storage: UI updates but data comes back on refresh.
- `.filter()` with `!==` to keep everything except the deleted item — same pattern learned in Session 1 when building `deleteConnection` in the repo
- onClick patterns: passing a function reference (`handleClick`) vs calling a function (`handleClick()`) vs wrapping in arrow function (`() => handleDelete(id)`)
- `()` after a function name is the "run now" operator — it executes immediately during render instead of waiting for the click event
- Prop threading: even if a component only passes a prop through without using it, TypeScript still requires it to be typed in that component's props interface
- CSS: `position: fixed` needs explicit height + `overflow-y: auto` for scrolling
**Quiz answers:**
- Q1: Need both `deleteConnection(id)` and `setConnections()` because one updates storage (persistence) and the other updates UI state — skipping either puts them out of sync
- Q2: `() => handleDelete(contact.id)` wraps the call in an arrow function so it only runs on click. `handleDelete(contact.id)` runs immediately during render because `()` is the "run now" operator.
**Decisions made:** Delete button lives on connection cards in Contact.tsx
**Questions / blockers for next time:** Phase 6 complete. Next: connection detail page + routing (Phase 7)

---

### Session 5 — 2026-03-04
**Ticket worked on:** Ticket 7a — Install React Router and set up basic route configuration
**What I built:**
- Installed `react-router-dom` package
- Added `BrowserRouter` wrapper around `<App />` in `main.tsx`
- Defined two routes in `App.tsx` using `<Routes>` and `<Route>`:
  - `/` → renders `ConnectionList`
  - `/connections/:id` → renders placeholder text (ConnectionDetail coming in next ticket)
- Kept `Navigation` and `AddContactForm` outside of `<Routes>` since they're always visible
**What I learned:**
- React Router v7 has three modes: declarative (simplest, JSX-based), data (adds loaders/actions), and framework (full-stack with file-based routing). Declarative is the right fit for this app since the data layer is localStorage.
- `BrowserRouter` is infrastructure — it belongs in `main.tsx` alongside `StrictMode`, not inside App.tsx with application logic
- `<Routes>` can only have `<Route>` as direct children — no `<div>`, `<main>`, or other elements inside it
- Components that are always visible (Navigation, modals) go outside `<Routes>`. Only URL-dependent content goes inside `<Route>` elements.
- `:id` in a route path is a dynamic URL parameter — it represents a variable part of the URL (like a specific connection's ID). Accessed via `useParams` hook inside the rendered component.
- Routing setup is one of the bigger mental shifts in React — you have to think about what the URL controls vs. what's always visible
**Quiz answers:**
- Q1: Navigation is outside `<Routes>` because it's always visible on every page regardless of URL. ConnectionList is inside a `<Route>` because it only shows on specific routes (though on desktop both panels will be visible — that's a layout/CSS concern, not routing).
- Q2: `:id` is a dynamic URL parameter representing a specific connection's ID. Access it with `useParams` inside the component rendered by that route.
**Decisions made:** Using React Router declarative mode (not data or framework mode). BrowserRouter in main.tsx. URL changes when selecting a connection (supports bookmarking/sharing).
**Questions / blockers for next time:** Build ConnectionDetail component (Ticket 7b). User shared desktop wireframe: master-detail layout (connection list left ~30%, detail right ~70%) — responsive layout will be addressed later.

---

### Session 6 — 2026-03-04
**Ticket worked on:** Ticket 7b — Build ConnectionDetail component using useParams
**What I built:**
- `ConnectionDetail.tsx` component that reads `:id` from the URL using `useParams()` hook
- Early return pattern for when `id` is `undefined` (type narrowing)
- Calls `getConnectionById(id)` to look up connection from localStorage
- Conditional rendering: `{connection && <div>...</div>}` to display connection data when found
- Fallback rendering: `{!connection && <p>...</p>}` to show "Connection not found" when id exists but doesn't match any connection
- Renders all connection fields: name, jobTitle, company, linkedinUrl, phone, email, avatar
- Wired into App.tsx route: `<Route path="/connections/:id" element={<ConnectionDetail/>}/>`
**What I learned:**
- `useParams()` hook returns an object of URL parameters — destructure with `const { id } = useParams()`
- `useParams` values are `string | undefined` — TypeScript doesn't know if the param exists at runtime
- Type narrowing with early return: check for the bad case (`if (id === undefined)`) and return early. After the check, TypeScript knows `id` is a `string` — no casting needed
- One component can have multiple failure points that need separate guards (no id in URL vs. id doesn't match any data)
- Conditional rendering with `&&`: left side truthy → render right side. Left side falsy → skip. Flip with `!` for the inverse case.
- Don't reuse components across different views just because they share the same data model — list cards and detail views have different purposes and layouts
**Quiz answers:**
- Q1: Both checks are needed because they guard against different failures. Line 6-8 guards `id` being `undefined` (no param in URL). Lines 24-25 guard `id` existing but not matching any connection in localStorage. Two different failure points, two different checks.
- Q2: `{connection && <div>...</div>}` renders connection data when connection is truthy. `{!connection && <p>...</p>}` renders a fallback message when connection is falsy. Same `&&` pattern, flipped with `!`.
**Decisions made:** ConnectionDetail is its own component (not reusing Contact card). Early return pattern for type narrowing.
**Questions / blockers for next time:** Phase 7 connection detail page complete (basic data display). Next: wire up navigation from connection list to detail page (clicking a connection card), then notes list per connection (Phase 7 continued / Phase 8).

---

### Session 7 — 2026-03-05
**Ticket worked on:** Ticket 7c — Make connection cards clickable to navigate to the detail page
**What I built:**
- Added `<Link>` from React Router to Contact.tsx, wrapping the avatar, name, and job title so clicking navigates to `/connections/:id`
- Moved the delete button outside of `<Link>` to prevent event bubbling from triggering navigation on delete click
- Used string form of `to` prop: `<Link to={`/connections/${contact.id}`}>`
**What I learned:**
- `<Link>` component for SPA navigation — updates URL and swaps components without a full page reload, preserving React state. A plain `<a>` tag triggers a full reload, destroying everything.
- Event bubbling — click events travel up from child to parent. A button inside a `<Link>` triggers both the button's onClick AND the Link's navigation. Fixed by restructuring so they aren't nested.
- `<Link to>` syntax — simple string form for paths, object form `to={{ pathname: "..." }}` for when you need search params or hash.
**Quiz answers:**
- Q1: Wrapping the whole card in `<Link>` caused the delete button click to bubble up to the Link, triggering navigation. The behavior is called event bubbling.
- Q2: `<Link>` prevents a full page reload — it intercepts the click, updates the URL, and swaps the component while keeping all React state intact. A plain `<a>` tag causes the browser to reload the entire page, destroying and rebuilding all state.
**Decisions made:** `<Link>` wraps only the clickable content (avatar, name, job title), not the entire card. Delete button sits outside `<Link>` to avoid event bubbling.
**Questions / blockers for next time:** Phase 7 navigation complete. Next: notes list per connection (Phase 8).

---

### Session 8 — 2026-03-05
**Ticket worked on:** Ticket 8a — Display note for a connection on the detail page
**What I built:**
- Renamed `getNotesByConnectionId` to `getNoteByConnectionId` in `noteRepo.ts` — changed from `.filter()` (returns `Note[]`) to `.find()` (returns `Note | undefined`) to match the MVP one-note-per-connection decision
- Updated the export in `noteRepo.ts` accordingly
- Wired `getNoteByConnectionId(id)` into `ConnectionDetail.tsx` to display the note body
- Added conditional rendering for both cases: `{note && <p>{note.body}</p>}` and `{!note && <p>No note written yet.</p>}`
- Removed unused `import type { Note }` from ConnectionDetail (TypeScript infers the type from the repo function's return)
**What I learned:**
- Early return vs. conditional rendering — early return exits the entire component (use for true failures like missing `id`). Conditional rendering keeps the rest of the page visible (use for optional sections like "no note yet"). "No note" is a normal state, not a failure.
- Keeping data logic in the repo layer — changed from `.filter()` to `.find()` in the repo, not in the component. The component asks "give me the note" without caring about the underlying data structure.
- `.find()` vs `.filter()` — `.find()` returns the first match or `undefined`. `.filter()` returns an array of all matches. Use `.find()` when you expect one result.
**Quiz answers:**
- Q1: Early return was wrong for "no note" because connection detail info should still display — "no note" is a normal state, not a failure. Early return was correct for "no id" because that's a true dead-end where nothing else can render.
- Q2: The `.filter()` → `.find()` change was done in the repo layer so the component doesn't need to know about the underlying data structure. Separation of concerns — if requirements change later, update the repo, not the UI.
**Decisions made:** MVP one note per connection. Repo function returns `Note | undefined` (not an array). Component uses conditional rendering for optional note section.
**Questions / blockers for next time:** Phase 8 read complete. Next: add note (create) — Ticket 8b.

---

### Session 9 — 2026-03-10
**Ticket worked on:** Ticket 8b — Add note (create) for a connection on the detail page
**What I built:**
- Added `useState` for `noteValue` (textarea input) and converted `note` from a plain variable to `useState<Note | undefined>` in ConnectionDetail.tsx
- Used a ternary in the `useState` initializer to handle `id` being `undefined` before the early return: `id ? getNoteByConnectionId(id) : undefined`
- Added a `<textarea>` with `onChange` handler and `value` prop (controlled input), plus a "Save Note" button — visible only when no note exists
- Built `handleSave` function: constructs a `Note` object with `crypto.randomUUID()`, `new Date().toLocaleString()`, and `noteValue`, then calls `saveNote(newNote)` to persist and `setNote(newNote)` to update UI
- After save, conditional rendering switches from textarea/button to `<p>{note.body}</p>`
**What I learned:**
- Rules of Hooks — React tracks hooks by position (1st hook, 2nd hook, etc.). Every render must call the same number of hooks in the same order. Hooks cannot be placed after an early return because some renders would skip them, breaking React's internal tracking.
- Ternary in `useState` initializer — to satisfy both React's hooks rule (must run before early return) and TypeScript (id might be undefined), use a ternary expression as the initial value: `id ? getNoteByConnectionId(id) : undefined`
- Variable shadowing bug — renaming a variable (`note` → `newNote`) but forgetting to update all references (`setNote(note)` should have been `setNote(newNote)`) causes the old state value to be passed back, so nothing updates. Always check all references after renaming.
- Storage + state sync pattern — same as delete: `saveNote()` persists to localStorage, `setNote()` updates React state. Skipping either puts storage and UI out of sync.
- Plain variable vs `useState` — a plain variable reads once per render but can't trigger a re-render. `useState` gives a setter that tells React "this value changed, re-render."
**Quiz answers:**
- Q1: Both `saveNote(newNote)` and `setNote(newNote)` are needed because one persists to localStorage and the other updates React state. Only doing one leaves either storage or UI out of date — same pattern as `handleDelete`.
- Q2: `note` was changed from a plain variable to `useState` because a plain variable can't trigger a re-render. After saving, the component needs to re-render to switch from the textarea to the note display. `useState` provides the setter to make that happen.
**Decisions made:** Note creation uses `new Date().toLocaleString()` for `createdAt`. Textarea + Save button only visible when no note exists. `handleSave` builds full Note object inline.
**Questions / blockers for next time:** Ticket 8b complete. Next: edit note (Ticket 8c) — inline edit pattern where clicking saved note text turns it into an editable textarea.

---

### Session 10 — 2026-03-10
**Ticket worked on:** Ticket 8c — Edit note (update) for a connection on the detail page
**What I built:**
- Added `isEditing` boolean state (`useState(false)`) to track view vs. edit mode
- Built `handleGoInEditMode` function: sets `isEditing` to `true` and pre-fills `noteString` with existing `note.body` so the textarea shows the current note text
- Built `handleEditSave` function: guards against `note === undefined` with early return (for TypeScript type narrowing), builds updated Note using spread `{...note, body: noteString}`, calls `updateNote()` to persist to localStorage, `setNote()` to update React state, and `setIsEditing(false)` to exit edit mode
- Added `onClick` to the note `<p>` tag to trigger `handleGoInEditMode`
- Conditional rendering: `{note && !isEditing &&` shows `<p>`, `{note && isEditing &&` shows textarea + Save button
- Imported `updateNote` from noteRepo
- Renamed `noteValue` to `noteString` for clarity (distinguishes the draft string from the full Note object)
**What I learned:**
- Boolean state for UI modes — `isEditing` tracks whether the component is in view or edit mode. A boolean `useState` is the simplest way to toggle between two UI states.
- Pre-filling state on mode switch — when entering edit mode, `noteString` must be set to `note.body` (not left as `''`), otherwise the textarea would appear empty and the user would lose their existing note text.
- Event handlers don't return JSX — `handleEditSave` is a regular function called on click, not a React component. It does work (update storage, update state) and can use `return` to stop execution, but `return <p>...</p>` won't render anything. Plain `return` is sufficient.
- Early return in event handlers for type narrowing — same pattern as early return in the component body. After `if (note === undefined) { return }`, TypeScript narrows `note` from `Note | undefined` to `Note`, allowing the spread syntax to work.
- Spread syntax for partial updates — `{...note, body: noteString}` copies all existing Note fields (id, connectionId, createdAt) and only overrides `body`. This preserves the note's identity so `updateNote` (which matches by `id`) can find and replace it.
- Create vs. Update distinction — creating a note generates new `id` and `createdAt` because it's a new record. Editing keeps the existing `id` and `createdAt` because it's the same record with modified content.
- Inline vs. extracted event handlers — inline is fine for single expressions (`onClick={() => setX(true)}`). Extract to a named function when the handler does multiple things or has logic worth naming.
**Quiz answers:**
- Q1: `noteString` needs to be pre-filled with `note.body` when entering edit mode because otherwise the textarea would show an empty string — the user would lose their existing note text and have to retype everything.
- Q2: `handleEditSave` keeps the existing `id` and `createdAt` (via spread) because it's the same note being modified, not a new note. If a new `id` were generated, `updateNote` (which uses `.map()` to match by `id`) would never find the old note to replace it — the data would break.
**Decisions made:** `isEditing` boolean controls view/edit toggle. `noteString` pre-filled on edit mode entry. Early return in `handleEditSave` for type narrowing. Spread syntax for partial Note updates.
**Questions / blockers for next time:** Ticket 8c complete. Next: delete note (Ticket 8d).

---

### Session 11 — 2026-03-11
**Ticket worked on:** Ticket 8d — Delete note for a connection on the detail page
**What I built:**
- `handleDelete` function in `ConnectionDetail.tsx`: type narrows `note` with early return, calls `deleteNote(note.id)` to remove from localStorage, `setNote(undefined)` and `setNoteString('')` to sync all state
- Delete button in the `note && !isEditing` block — visible only in view mode when a note exists
- Imported `deleteNote` from noteRepo
**What I learned:**
- State cleanup on delete — resetting ALL state variables set during the item's lifetime, not just the primary one. Ask: "what state exists because this item existed?" — reset all of it. `note` → `undefined`, `noteString` → `''`.
- Type narrowing in event handlers — `handleDelete` needed the guard because it accesses `note.id` and `note` is `Note | undefined`. `handleSave` didn't need it because it never touches `note` — it creates a brand new object. Rule: if your handler accesses a property on something that could be `undefined`, guard it first.
- `useState` ternary initializer chain — `id ? getNoteByConnectionId(id) : undefined` exists because: `.find()` returns `Note | undefined` → repo return type reflects that → `useState` must be called before the early return (Rules of Hooks) → at that point `id` is still `string | undefined` → ternary safely skips the function call when `id` is undefined.
**Quiz answers:**
- Q1: `handleDelete` needed type narrowing because it accesses `note.id` and `note` is `Note | undefined`. `handleSave` didn't because it never reads from `note` — it builds a new object from scratch.
- Q2: `setNoteString('')` was needed in `handleDelete` because `noteString` still held the old note text. When `note` became `undefined`, the `!note` block rendered the textarea — which is controlled by `noteString`. Without resetting it, the deleted text would reappear.
**Decisions made:** Delete button lives in view mode only (`note && !isEditing`). `handleDelete` resets both `note` and `noteString`.
**Questions / blockers for next time:** Ticket 8d complete. Phase 8 (notes CRUD) fully done. Next: Phase 9 — Search.

### Session 12 — 2026-03-11
**Ticket worked on:** Ticket 9a — Search/filter connections
**What I built:**
- `searchQuery` state in `App.tsx` (`useState('')`)
- `filteredConnections` derived variable using `.filter()` with case-insensitive matching on `name`, `company` (optional chaining), and `jobTitle`
- Passed `searchQuery`/`setSearchQuery` to `Navigation`, `filteredConnections` to `ConnectionList`
- Controlled search input in `Navigation.tsx` wired to `setSearchQuery` via `onChange`
- Updated `ConnectionList` and `Contact` props from `connections` to `filteredConnections`
**What I learned:**
- Derived state vs stored state — if a value can be calculated from existing state, don't put it in `useState`. `filteredConnections` is computed from `connections` + `searchQuery` on every render. Storing it would create two sources of truth.
- `.filter()` + `||` chaining — callback runs once per item. `||` means keep if ANY condition is true. JavaScript short-circuits: stops evaluating as soon as one condition is true.
- `?.` optional chaining — safe access on values that might be `undefined`. `connection.company?.toLowerCase()` returns `undefined` instead of throwing if `company` is undefined. The `||` then moves on to the next check.
- `.includes()` for substring matching — returns `true`/`false`, exactly what `.filter()` needs.
- `.toLowerCase()` on both sides — normalizes case so "john" matches "John".
- Re-render drives re-filtering — `filteredConnections` isn't reactive. `setSearchQuery` triggers a re-render of `App`, which re-runs `.filter()` with the new value. The filtering is plain JavaScript; the re-render is what makes it feel live.
**important**
      onChange in Navigation → setSearchQuery → searchQuery value changed → App function re-runs → .filter() executes with new searchQuery → new filteredConnections → list updat
- `filteredConnections` handles both states automatically — when `searchQuery` is `''`, `.includes('')` is always true, so the full list shows. No extra conditional logic needed.
**Quiz answers:**
- Q1: `filteredConnections` is a derived variable, not `useState`, because it can be calculated from `connections` and `searchQuery`. Storing it would create two sources of truth that could get out of sync.
- Q2: User types → `onChange` calls `setSearchQuery` → React re-renders `App` → `.filter()` runs with new `searchQuery` → new `filteredConnections` passed to `ConnectionList` → list updates.
**Decisions made:** Search filters on name, company, jobTitle. Case-insensitive. Fires on every keystroke. `searchQuery` state lives in `App.tsx`.
**Questions / blockers for next time:** Phase 9 complete. Next: Phase 10 — Polish (empty states, validation, UX edge cases).

### Session 13 — 2026-03-24
**Ticket worked on:** Ticket 10a — Empty state when search returns no results; Ticket 10b — Form validation on Add Contact form
**What I built:**
- Empty state in `Contact.tsx`: `filteredConnections.length === 0` renders "Contact not found! Try another search" instead of an empty list
- `errorMessages` state in `AddContactForm.tsx` typed as `{ name: string, jobTitle: string, linkedinUrl: string }` with empty string initial values
- `handleLinkedinUrlBlur` function using `new URL()` in a `try/catch` — `try` clears the error, `catch` sets it. Wired to `onBlur={(e) => handleLinkedinUrlBlur(e.target.value)}` on the LinkedIn URL input
- Name and jobTitle validation in `handleSubmit` — sequential `if` checks with early `return` before `newConnection` is built
- Error messages displayed inline in JSX next to each field via `{errorMessages.name}`, `{errorMessages.jobTitle}`, `{errorMessages.linkedinUrl}`
- Added `noValidate` to the `<form>` element to disable browser's built-in validation so custom logic runs
**What I learned:**
- Empty state placement — the check belongs in the component responsible for rendering the list (`Contact.tsx`), not where the data is computed (`App.tsx`)
- Error messages as an object — `{ name, jobTitle, linkedinUrl }` object over array because you access errors by field name directly next to the relevant input. No index tracking needed.
- `new URL()` for URL validation — browser built-in, no regex needed. Throws if invalid, so wrap in `try/catch`. `try` clears the error, `catch` sets it.
- `onBlur` vs `onChange` for validation — `onBlur` fires once when user leaves the field, less noisy than `onChange` especially for paste actions.
- `noValidate` on the form — disables browser's built-in validation so custom validation logic in `handleSubmit` runs instead. Without it, `required` attributes intercept submit before your code executes.
- Sequential validation with early return — separate `if` checks, each sets its error and `return`s, stopping execution before `newConnection` is built or saved.
- Arrow function wrapper for `onBlur` — same pattern as `onClick`. `onBlur={(e) => handleLinkedinUrlBlur(e.target.value)}` extracts the string value from the event before passing to the handler.
**Quiz answers:**
- Q1: Empty state check belongs in `Contact.tsx` because that's the component responsible for rendering the list — `App.tsx` just computes the data, it shouldn't care about how it's displayed.
- Q2: `noValidate` was needed because the browser's `required` attribute intercepted the submit event before `handleSubmit` ran, so custom validation code never executed.
**Decisions made:** Empty state message in `Contact.tsx`. `noValidate` on form with custom validation. URL validated on blur, name/jobTitle validated on submit.
**Questions / blockers for next time:** Error messages for name/jobTitle don't clear when user starts typing to fix them — left as known issue for now.

---

*(Copy the session template above for each new session)*

---

## 🧠 Key Decisions Log

> Record decisions here so you don't relitigate them in future sessions.

| Decision | What we chose | Why |
|---|---|---|
| Storage abstraction | Repository pattern (UI → repo → localStorage) | Makes it swappable later (e.g. Supabase) without rewriting UI |
| ID generation | `crypto.randomUUID()` | Built-in browser API, no library needed, generates unique UUIDs |
| Routing | React Router | Two distinct pages with a dynamic `:id` param needed |
| UI component library | shadcn/ui + Radix UI + Tailwind | Accessible, customizable components with utility-first styling |
| Avatar display | ui-avatars.com API | Generates letter avatars from names, no image upload needed |
| Add contact UI | Modal dialog (shadcn Dialog) | Keeps user on the connections list while adding |
| Connection model changes | Made `jobTitle` and `linkedinUrl` required, added `phone` and `email` | Diverged from original spec — needs review |
| Notes per connection | One note per connection for MVP | Simplifies UI and logic; can expand to multiple notes later |

---

## 💡 Concepts Learned

> Build this list as you go. It becomes your personal reference.

- React component composition (App → Navigation + ConnectionList → Contact)
- Props and typing with TypeScript (passing Connection arrays between components)
- useEffect for data fetching on mount
    This is used for side effects that don't need to be ready before the first render
- useState for managing component-level state
    useState tells React "when this data changes, re-render the component." A plain variable wouldn't trigger a re-render — the screen would be stale even after the data changed in localStorage.
    - if a value can change during the lifetime of the component and the UI needs to reflect that change, use useState. If it's read-once and static, a plain variable is fine.
- Lifting state up: When sibling components (Navigation, ConnectionList, AddContactForm) need to share state, move that state to their common parent (App) and pass it down as props. Siblings can't talk to each other directly.
    If an action in Component A needs to cause a change in Component B, and neither is a parent/child of the other — they need shared state.
    The moment you find yourself thinking "how do I get this data from here to over there?" and the two components are siblings — that's when you lift state up to their common parent.
- Importing and using third-party UI components (shadcn/ui)
- JSON.parse() expects a string value only as input so we must handle a null (falsy value) before it reaches this point
- React render flow is like a function call chain calling functions top-down
App() is called
  → line 10: seeding check runs (synchronous, happens immediately)
  → line 17: return JSX... which includes <ConnectionList/>
  → so React calls ConnectionList()
    → line 7: useState(getAllConnections()) runs (reads localStorage)
    → line 9: return JSX... which includes <Contact/>
    → so React calls Contact()
      → renders the list items to the screen
During a render, React calls your component functions top-to-bottom like normal JavaScript. Any code in the function body runs immediately, in order, before moving to the next line.
useEffect is the exception — it queues code to run after the render is fully painted to the screen. Think of it as "do this later."
That's why seeding had to be in the function body (runs during render, before child components) and not in useEffect (runs after everything is already rendered).
- CSS: position: fixed takes the element out of the normal flow, so you have to be explicit about its boundaries. it won't grow with the page/viewport
- **onClick patterns — passing vs calling a function:**
  - `onClick={handleClick}` — passes the function itself. React stores it, calls it on click. Use when the handler takes **no arguments** (or only the event object).
  - `onClick={() => handleDelete(contact.id)}` — passes an arrow function wrapper. React stores the arrow function, calls it on click, which then calls `handleDelete(contact.id)`. Use when you need to pass **specific arguments**.
  - `onClick={handleDelete(contact.id)}` — **BUG: calls the function immediately during render.** The `()` is the "run now" operator. React gets back `undefined` (the return value), not a function. Nothing happens on click.
  - Rule of thumb: `()` after a function name = "run this now." No `()` = "here's a reference to this function, call it later."
- **React Router declarative mode basics:**
  - `BrowserRouter` wraps the app in `main.tsx` — infrastructure, not application logic
  - `<Routes>` is a container that only accepts `<Route>` children — think of it as a switch statement for URLs
  - `<Route path="/" element={<Component />} />` — maps a URL pattern to a component
  - `:id` in a path is a dynamic parameter — access it with `useParams()` hook
  - Components outside `<Routes>` always render (Navigation, modals). Components inside `<Route>` only render when the URL matches.
  - useParams() hook — how to read dynamic URL parameters (:id) from the route. Returns an object you destructure: const { id } = useParams().
  - Type narrowing with early return — useParams gives string | undefined, but your function expects string. Instead of casting or ignoring it, you check for the bad case first and return early. After that check, TypeScript knows id is a string. This is a pattern you'll use constantly.
  - Handling multiple failure points — one component can fail in different ways (no id in URL vs. id doesn't match any data). Each needs its own guard. Thinking through "what could go wrong and where" is a core part of building robust components.
  - Conditional rendering with && — using truthy/falsy checks to show or hide JSX blocks. And flipping it with ! for the inverse case.
  - <Link> component for SPA navigation — React Router's <Link> updates the URL and swaps components without a full page reload, preserving all React state. A plain <a> tag triggers a full reload, destroying and rebuilding everything.
  - Event bubbling — click events travel up from child to parent elements. An interactive element (button) inside a <Link> triggers both — the button's onClick AND the Link's navigation. Fix by restructuring so they aren't nested.
  - <Link to> syntax — use the simple string form <Link to={`/path/${id}`}> when you just need a path.
  - Early return vs. conditional rendering — knowing which to use. Early return is for when nothing else in the component should render (a true failure/dead-end). Conditional rendering is for when one section is optional but the rest of the page should still display. "No note" is a normal state, not a failure.
  - Keeping data logic in the repo layer. Changed from .filter() (returns array) to .find() (returns single item) in the repo, not in the component. The component asks "give me the note" and doesn't care about the underlying data structure. If requirements change later, you update the repo, not the UI.
  - Ternary in useState initializer — handles uncertain values (like id being undefined) so the hook can live before the early return.
  - Plain variable vs useState — a plain variable can't trigger a re-render; useState can, which is what makes the UI switch from textarea to saved note.
  - Boolean useState for UI mode toggling — `isEditing` tracks view vs. edit mode. Simplest way to toggle between two UI states that affect what JSX renders.
  - Pre-filling state on mode switch — when entering edit mode, set the draft state (`noteString`) to the existing data (`note.body`) so the textarea isn't empty. The *when* matters: do it at the moment of the mode switch, not at component mount.
  - Event handlers don't return JSX — an event handler (like `handleEditSave`) is a regular function called on user interaction, not a React component. It can use `return` to stop execution, but `return <p>...</p>` won't render anything. Use plain `return` to bail out early.
  - Early return in event handlers for type narrowing — same pattern as in component body. After `if (note === undefined) { return }`, TypeScript narrows the type so subsequent code can safely use `note` as `Note`.
  - Spread syntax for partial object updates — `{...note, body: noteString}` copies all fields from the existing object and overrides only the specified ones. Preserves the object's identity (id, createdAt) while changing just what was edited.
  - Create vs. Update — creating generates new id/createdAt (new record). Updating preserves existing id/createdAt (same record, modified content). Using the wrong approach breaks data matching (e.g. `updateNote` matches by id).
  - Inline vs. extracted event handlers — inline for single expressions, extracted named function when the handler does multiple things or has logic worth naming for readability.
  - State cleanup on delete — when deleting, reset ALL state variables that were set during the deleted item's lifetime, not just the primary one. In `handleDelete`: `note` → `undefined` (clears the Note object), `noteString` → `''` (clears the draft text). If `isEditing` had been `true`, that would need resetting too. Ask: "what state exists because this item existed?" — reset all of it.
  - Type narrowing in event handlers — `handleDelete` needed `if (note === undefined) { return }` because it accesses `note.id`, and `note` is typed `Note | undefined`. `handleSave` didn't need it because it never touches `note` — it builds a brand new object. The rule: if your handler accesses a property on a value that could be `undefined`, guard it first.
  - `useState` ternary initializer chain — the reason `id ? getNoteByConnectionId(id) : undefined` is written that way traces back through three layers: (1) `.find()` in the repo returns `Note | undefined` because a connection might not have a note; (2) that makes the repo function's return type `Note | undefined`; (3) `useState` must be called before the early return (Rules of Hooks), but at that point `id` is still `string | undefined` — passing `undefined` to `getNoteByConnectionId` would be a type error. The ternary solves it: call the function only when `id` is safe to use, otherwise fall back to `undefined`.
  - Derived state vs stored state — connections is stored in useState because it needs to persist across renders and can change (add/delete). filteredConnections is never stored — it's just a variable computed from connections and searchQuery on every render. Rule: if a value can be calculated from existing state, don't store it in useState. Storing it would create two sources of truth that could get out of sync.
  - .filter() + || chaining — the callback runs once per connection. Inside it, || means "keep this connection if the name matches OR the company matches OR the jobTitle matches." JavaScript evaluates left to right and short-circuits — if name matches, it stops checking and returns true immediately. Only checks the next condition if the previous one was false.
  - `?.` optional chaining — a safe way to access a property that might not exist. `connection.company?.toLowerCase()` means: "if `company` has a value, call `.toLowerCase()` on it. If `company` is `undefined`, stop here and return `undefined` — don't throw an error." Without `?.`, calling `.toLowerCase()` on `undefined` would crash. With it, you get `undefined` back, which is falsy, so the `||` just moves on to the next check.
  - Re-render drives re-filtering — filteredConnections isn't reactive on its own. When the user types, onChange calls setSearchQuery, which tells React "state changed, re-render App." React re-runs the App function top to bottom, hits the .filter() line with the new searchQuery value, and produces a new filteredConnections array. That gets passed down and the list updates. The filtering is just a plain JavaScript expression — the re-render is what makes it feel live.
---

## ❓ Questions to Come Back To

> Park questions here that came up mid-session but weren't the current focus.

- Should we add `createdAt`/`updatedAt` timestamps back to the Connection model?
- File organization: components are flat in `src/` instead of in `pages/` and `components/`. Reorganize now or later?
