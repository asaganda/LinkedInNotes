# LinkedIn Notes

A personal web app for keeping track of your LinkedIn connections — who they are, what they do, and notes on how you know them or what you've discussed.

## Objective

LinkedIn doesn't give you a private space to jot down context about your connections. This app fills that gap. Add connections manually, write a note against each one, and search your network by name or job title. Everything is stored locally in your browser — no backend, no account required.

<!-- ## Screenshots

![Mobile view](screenshots/mobile.png)
![Desktop view](screenshots/desktop.png)
![Connection detail](screenshots/connection-detail.png) -->

## Features

- Add, view, and delete connections
- Store name, job title, company, LinkedIn URL, phone, and email per connection
- Write and edit a personal note per connection
- Search connections by name or job title
- Responsive layout: single-column on mobile, master-detail on tablet and desktop
- Avatar with initials derived from the contact's name

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router v7
- Tailwind CSS v4
- shadcn/ui (Avatar, Button, Textarea)
- localStorage (via a repository pattern, swappable for a real database later)

## Running Locally

**Prerequisites:** Node.js installed

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.
