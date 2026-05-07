# LinkedIn Notes

LinkedIn is great for staying connected — but terrible for remembering context. Who is this person? Where did you meet them? What did you talk about? What did you promise to follow up on?

**LinkedIn Notes** is a Chrome extension that solves this by letting you attach private notes to any LinkedIn profile, visible right on the page as you browse. No tab switching, no separate app, no friction — just your notes, exactly where you need them.

## Who it's for

Anyone who uses LinkedIn seriously: recruiters, founders, sales professionals, job seekers, or anyone who meets a lot of people and wants to remember more than a name and a job title. If you've ever landed on a LinkedIn profile and thought "I know I've spoken to this person but I can't remember anything about them," this extension is for you.

## What it does

- **Instant context on any profile** — open a LinkedIn profile and your notes about that person appear automatically in a panel on the side of the page
- **Add and edit notes inline** — write, update, or delete notes without leaving the page
- **Auto-fills connection details** — when you add someone new, the extension scrapes their name and profile photo from the page so you don't have to type it
- **Full connections list** — browse and search all your saved connections from within the panel
- **Bulk import** — import your existing LinkedIn connections in one click, with auto-scroll to capture your full list
- **SPA-aware** — the panel updates automatically as you navigate between profiles without a page reload

## Tech stack

Built with [WXT](https://wxt.dev/) (Chrome extension framework), React, TypeScript, and [Supabase](https://supabase.com/) as the backend database. Part of a broader multi-platform system that also includes a web app and a planned React Native mobile app, all sharing the same Supabase backend.

---

## Privacy Policy

**LinkedIn Notes Browser Extension**
*Last updated: May 7, 2026*
*Developer: SD Labs - Andrew Saganda*

Overview
LinkedIn Notes is a Chrome browser extension that lets you save and manage private notes about your LinkedIn connections directly on LinkedIn profile pages. This policy explains what data the extension collects, how it is used, and how it is stored.

Data Collected
When you use LinkedIn Notes, the following data may be collected and stored:

Full name — scraped from the LinkedIn profile page you are viewing
LinkedIn profile URL — the URL of the profile page you are viewing
Profile photo URL — a link to the profile photo on LinkedIn's servers (not the photo itself)
Notes — text notes you write about a connection
Job title and company — scraped from the LinkedIn profile page (reserved for a future version)
No passwords, financial information, health information, or Google Account data is ever collected.

How Your Data Is Used
All data collected is used solely to provide the core functionality of the extension: displaying and managing your private notes about LinkedIn connections. Your data is never used for advertising, analytics, or any purpose unrelated to this functionality.

How Your Data Is Stored
Your data is stored in a private Supabase database hosted on your behalf. This database is controlled by the developer (Andrew Saganda) and is not shared with any third party, data broker, or advertising platform.

Data Sharing
Your data is never sold, rented, or shared with any third party. The only external service that receives your data is Supabase (the database provider), which stores it on your behalf.

Data Retention
Your data is retained for as long as you use the extension. You can delete any connection or note at any time from within the extension. There is currently no automated deletion schedule.

Permissions
The extension requests access to linkedin.com pages only. This permission is required solely to inject the notes panel into LinkedIn profile pages and to read profile data visible on the page. No other websites are accessed.

Children's Privacy
This extension is not directed at children under the age of 13 and does not knowingly collect data from children.

Changes to This Policy
If this policy is updated, the "Last updated" date at the top of this page will be revised. Continued use of the extension after changes are posted constitutes acceptance of the updated policy.

Contact
If you have questions about this privacy policy, contact: asaganda@gmail.com