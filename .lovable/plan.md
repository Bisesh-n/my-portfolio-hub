## Bishesh Nakarmi — Personal Portfolio

### Design System

- Sleek, minimal SPA with frosted glass (`backdrop-blur`) cards, rounded corners, and smooth section transitions
- Light/dark theme toggle in the header using `next-themes`
- Smooth scroll navigation via anchor links with `scroll-behavior: smooth`

### Portfolio Sections (Single Page)

1. **Header Nav** — Fixed top bar with nav links (About, Experience, Projects, Resume, Contact) + dark/light toggle. Clicking scrolls smoothly to each section.
2. **Hero Section** — Your photo, name "Bishesh Nakarmi", title "Frontend Developer", location "Kathmandu, Nepal", brief career summary, and social links (GitHub, LinkedIn).
3. **Timeline Section** — Vertical timeline showing:
  - **NEPA Works** — Developer (Current)
  - **VoxCrow Pvt. Ltd.** — Frontend Developer (Apr 2020 – Jun 2023)
  - **BlendWit International** — SEO Intern (Sep 2019 – Jan 2020)
  - **Education**: MSc. IT (Islington College), BSc. CSIT (Academia International), etc.
4. **Skills Section** — Technical skills (React, JS, Python, PHP, MongoDB, Postgres, etc.) and soft skills displayed as badges/chips.
5. **Projects Section** — Fetches your public GitHub repos from `https://api.github.com/users/Bisesh-n/repos` and displays them as cards with name, description, language, and link.
6. **Resume Section** — Download button for your resume PDF.
7. **Visitor Resume Upload** — A form where visitors can upload their own resume (stored in Supabase Storage).
8. **Contact / Message Section** — Form with name, email, and message fields. Messages saved to a Supabase `messages` table. Email notification sent to you via Resend edge function. Name, email and message required. Apply regex so to prevent spam emails, and if messages contain random, nonsensical or vulgar words, deny sending messages. Messages should be at leat five words long and only english words allowed 
9. **Footer** — Social links, copyright, and a subtle animated design.

### Admin Dashboard (`/admin`)

- **Login** — Supabase Auth email/password sign-in (your account: [nbiseshm@gmail.com](mailto:nbiseshm@gmail.com))
- **Editable Content** — Edit hero text, timeline entries, skills from a `site_content` table
- **Uploaded Resumes** — View/download all visitor-uploaded resumes from Supabase Storage
- **Messages** — View all contact form submissions with sender info and message

### Backend (External Supabase)

- **Tables**: `messages`, `site_content`, `user_roles`
- **Storage bucket**: `resumes` for visitor uploads
- **Edge Function**: `send-contact-email` using Resend API (key stored as Supabase secret)
- **Auth**: Supabase Auth with email/password for admin
- **RLS**: Public insert on messages & resume uploads; admin-only read/edit via `has_role` function