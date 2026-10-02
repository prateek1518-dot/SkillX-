# SkillX — frontend

Frontend for **SkillX**, a peer-to-peer skill exchange platform (course
project 25CS022). Built with React + Vite + React Router. No backend
calls are wired up yet — everything reads from `src/data/mockData.js`
so the UI is fully browsable on its own.

## Run it

```bash
npm install
npm run dev
```

Opens on `http://localhost:5173`.

## Structure

```
src/
  components/     Navbar, Footer, SkillTicket (shared "ticket" card)
  pages/          Landing, Login, Register, Dashboard, Profile,
                  Requests, Sessions, Certificate, NotFound
  data/           mockData.js — sample users, listings, requests
  index.css       design tokens + shared classes (buttons, tags, forms)
```

## Wiring up the real backend

Per the project's architecture (React → Express REST API → MongoDB),
each page has a `// TODO` comment marking where a `fetch`/`axios` call
should replace the mock data:

- `Login.jsx` / `Register.jsx` → `POST /api/auth/login`, `/register`
- `Dashboard.jsx` → `GET /api/skills`, `POST /api/requests`
- `Requests.jsx` → `GET /api/requests`, `PATCH /api/requests/:id`
- `Sessions.jsx` → `GET /api/sessions`
- `Certificate.jsx` → `GET /api/certificates/:id`

## Not yet built

Matches the "Pending Tasks" from the project deck: chat between
matched users, video call integration, a smarter matching algorithm,
downloadable PDF certificates, and email notifications.
