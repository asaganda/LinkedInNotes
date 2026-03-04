# CLAUDE.md — LinkedIn Connection Notes App

## 🧠 About This Project

A web app that helps users remember important context about their LinkedIn connections by adding and managing notes against each person. Built as a personal MVP to sharpen React + TypeScript skills before extending to React Native.

**Problem it solves:** After networking on LinkedIn, it's hard to remember who someone is, how you met, or what you discussed. This app is a private, local notepad for your network.

**This app does NOT:**
- Scrape LinkedIn
- Replace LinkedIn
- Sync across devices (yet)
- Require login or a backend

---

## 🏗 Tech Stack

| Layer | Tool | Why |
|---|---|---|
| UI Framework | React | Core skill to strengthen |
| Language | TypeScript | Type safety + better data modeling practice |
| Build Tool | Vite | Fast dev environment |
| Routing | React Router | Page navigation between connections list and detail |
| Storage | localStorage | Browser-based persistence, no backend needed for MVP |
| UI Components | shadcn/ui + Radix UI | Pre-built accessible components with Tailwind styling |
| Styling | Tailwind CSS | Utility-first CSS framework |
| Icons | Lucide React | SVG icon library |

**Not using (yet):** TanStack Query, Zustand/Redux, Supabase, any backend or auth.

---

## 🗂 Pages

| Route | Purpose |
|---|---|
| `/connections` | List all connections, search, add new |
| `/connections/:id` | View connection detail, manage notes (add/edit/delete) |

---

## 🧾 Data Models

```typescript
// src/models/connection.ts (as currently implemented)
type Connection = {
  id: string
  name: string
  jobTitle: string        // Changed from optional to required
  company?: string
  linkedinUrl: string     // Changed from optional to required
  phone?: string          // Added (not in original spec)
  email?: string          // Added (not in original spec)
  // NOTE: createdAt and updatedAt from original spec are NOT yet implemented
}

// src/models/note.ts (as currently implemented)
type Note = {
  id: string
  connectionId: string
  body: string
  createdAt: string
  // NOTE: updatedAt from original spec is NOT yet implemented
}
```

**Differences from original spec to discuss:**
- `jobTitle` and `linkedinUrl` were made required (originally optional)
- `phone` and `email` fields were added to Connection
- `createdAt`/`updatedAt` timestamps are missing from Connection
- `updatedAt` is missing from Note

---

## 💾 Storage Architecture

localStorage is wrapped in repository functions to keep UI and storage logic separate. This means later the storage layer can be swapped (e.g. to Supabase) without rewriting the UI.

```
UI → Repository functions → localStorage
```

Storage lives in `src/storage/` — never access localStorage directly from components.

---

## 🧱 Folder Structure

**Planned structure (from original spec):**
```
src/
  pages/        # Full screen views (ConnectionsPage, ConnectionDetailPage)
  components/   # Reusable UI pieces (ConnectionCard, NoteItem, etc.)
  models/       # TypeScript types (Connection, Note)
  storage/      # localStorage read/write logic (repository pattern)
  utils/        # Helper functions (generateId, formatDate, etc.)
```

**Actual structure (as currently built):**
```
src/
  components/ui/   # shadcn/ui components (button, dialog, input, label)
  lib/             # Utility functions (cn helper for Tailwind class merging)
  models/          # TypeScript types — Connection, Note ✅
  storage/         # localStorage repo layer — connectionRepo.ts, noteRepo.ts ✅
  App.tsx           # Root component — owns connections + dialogOpen state, seeds localStorage, renders Navigation + ConnectionList + AddContactForm
  Navigation.tsx    # Header/navbar with "+ New Contact" button (receives dialogOpen props)
  ConnectionList.tsx # Receives connections as prop, renders Contact cards
  Contact.tsx       # Renders individual connection cards with avatar
  AddContactForm.tsx # Modal form for adding connections — wired to storage ✅
  placeholderdata.json # 5 fake connections for seeding localStorage on first load
```

**Notable gaps vs. planned structure:**
- No `pages/` folder yet — components are flat in `src/`
- `storage/` folder now exists with `connectionRepo.ts` and `noteRepo.ts`
- No `utils/` folder yet (shadcn added `lib/utils.ts` automatically)

---

## 📱 UI Layout & Wireframes

**Mobile-first.** Design and build for mobile screens first. The app should also work on tablet and desktop but wireframes have only been sketched for mobile at this stage — tablet/desktop layouts to be defined later.

**Chosen layout: Two separate screens (standard mobile navigation pattern)**

### Screen 1 — Connections List (`/connections`)
- Header with search bar and an add/new connection button (top right)
- Scrollable list of connection rows
- Each row shows: avatar circle, connection name, job title/company
- Tapping a row navigates to the Connection Detail screen

### Screen 2 — Connection Detail (`/connections/:id`)
- Header with a back button to return to the list
- Avatar + connection info (name, job title, company) at the top
- Scrollable list of notes below
- Actions: add note button, edit and delete per individual note

**Why this layout was chosen over the alternative:**
A master-detail layout (both panels on one screen) was considered but rejected — it's harder to build, requires more complex state management, and feels cramped on mobile. The two-screen approach maps directly to the route structure already defined, keeps each screen focused on one job, and follows standard mobile UX patterns users already understand.

---

## 🏆 Skills Being Practiced

- React fundamentals (components, props, state, hooks)
- React Router (navigation, dynamic routes, params)
- TypeScript modeling (types, optional fields, type safety)
- Component architecture (separation of concerns)
- Local persistence (localStorage, repository pattern)
- Clean code structure (scalable folder layout)
- Thinking like a product builder

---

## 🤝 Working Agreement (How to Assist Me)

> This is critical. Read this before every session.

I am using this project to **rebuild and sharpen my development skills**. I am not here to get a finished app quickly — I am here to learn by doing.

**You are my senior developer. I am the junior dev working through tickets.**

### Your role:
1. **Assign me one ticket at a time.** Break tasks down as small as needed. Do not give me the next ticket until I've completed and understood the current one.
2. **Give hints, not full solutions.** If I'm stuck, guide my thinking with questions or point me in the right direction. Only write code for me if I've genuinely tried and asked you to show me.
3. **Quiz me after every task without exception.** Before moving to the next ticket, ask me at least one of the following:
   - Explain in plain English what you just built and why it works
   - What would happen if you changed X?
   - Why did we structure it this way instead of another way?
   - Where does this piece fit in the bigger picture of the app?
   Only move to the next ticket once I've answered satisfactorily. If my answer is vague or incomplete, push back and ask me to go deeper.
4. **Explain reasoning when I ask.** If I ask why we're doing something a certain way, give me a clear explanation — not just the what, but the why. Don't do this unprompted for every decision, but always answer thoroughly when I ask.

### What I need from you:
- Treat me as capable but learning
- Ask me questions to help me think, don't just give answers
- Flag when my approach has a problem but let me figure out the fix first
- Keep the build sequence logical — don't skip ahead

### What I don't want:
- You writing full features for me unprompted
- Moving on before I understand what I built
- Vague answers — be specific and use my actual code as examples

---

## 📍 Current Status

> Update this section at the end of every session.

**Currently working on:** Phase 4-5 complete. Next: delete connection (Phase 6)

### Build Checklist
- [x] Project scaffolded (Vite + React + TypeScript)
- [x] Folder structure created (partially — diverged from plan, see above)
- [x] TypeScript models defined (`Connection`, `Note`) — with some differences from spec
- [x] Storage layer — `connectionRepo` functions (getAllConnections, getConnectionById, saveConnection, deleteConnection)
- [x] Storage layer — `noteRepo` functions (getAllNotes, getNotesByConnectionId, saveNote, deleteNote, updateNote)
- [x] Connections list page (read) — reads from localStorage via `getAllConnections()`
- [x] Add connection form (create) — `handleSubmit` implemented, wired to storage, dialog controlled via lifted state
- [ ] Delete connection (delete)
- [ ] Connection detail page
- [ ] Notes list per connection (read)
- [ ] Add note (create)
- [ ] Edit note (update)
- [ ] Delete note (delete)
- [ ] Search/filter connections
- [ ] Polish + edge cases (empty states, validation)
- [ ] React Router setup (NOT STARTED — no routing exists yet)

### Known Issues in Current Code
- Components are flat in `src/` instead of organized into `pages/` and `components/`
