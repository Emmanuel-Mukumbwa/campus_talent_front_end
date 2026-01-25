
# Campus Talent — Frontend

Campus Talent is a React-based frontend for a student talent marketplace that connects students, freelancers and recruiters. It provides discovery, applications, portfolio management, messaging, and recruiter tools (gigs/jobs, application review, verification and analytics).

This repository contains the single-page React application. The backend live API is implemented in the sibling folder `campus-talent-backend` (see the `campus-talent-backend` directory in the workspace).

## Why this project exists

Students and early-career talent often lack a purpose-built platform to showcase skills and get hired for short-term gigs and entry-level roles. Campus Talent provides:

- A searchable student marketplace with portfolio previews
- Recruiter workflows for posting gigs/jobs, reviewing candidates and tracking applications
- Built-in verification and escrow flows to increase trust
- Simple analytics and notifications for recruiter follow-up

If you're a recruiter, this README highlights the features you'd care about and how to run the app locally to evaluate candidates.

## Recruiter-facing highlights

- Discover Students: advanced search & filter by skills, programs, availability, and location.
- Portfolio Previews: quick view of projects, media and skill proficiency.
- Applications & Tracking: view, filter and review candidate applications; recruiter application review pages and status tabs are available.
- Post Gigs/Jobs: create, preview and publish gigs with escrow/payment steps and requirements.
- Recruiter Network & Messaging: connect with candidates, send messages, and manage conversations.
- Verification: business and recruiter verification workflows to build trust.
- Analytics: basic dashboards and metrics for posted gigs and candidate engagement.
- Notifications: realtime-like notifications for new applications, messages and verification events.

## Tech stack

- Frontend: React (Create React App)
- Language: JavaScript (ES6+), CSS
- Patterns: SPA, component-based UI, client API layer in `src/utils/api.js`
- Backend: Node/Express in `campus-talent-backend` (separate service)

## Quick start (developer / recruiter local evaluation)

These steps assume you're on Windows PowerShell (default for this project environment).

1) Install dependencies

```powershell
npm install
```

2) Run the development server

```powershell
npm start
```

This starts the frontend at http://localhost:3000. The app expects a backend API; when running locally, run the backend in `campus-talent-backend` or provide a mock API. If the backend runs on a different port, set the appropriate env variable (see `src/utils/api.js` for where the base URL is read).

3) Build for production

```powershell
npm run build
```

4) Tests

```powershell
npm test
```

## Environment and configuration

- The frontend reads the API base URL from `src/utils/api.js` (inspect or change this file to point to your backend). If you add environment variables, follow CRA's `REACT_APP_` prefixed variables.

## Project structure (high level)

- `src/pages` — top-level pages (Gigs, Recruiter applications, Portfolio builder, etc.)
- `src/components` — reusable UI components (DiscoverStudents, FiltersSidebar, ApplicationsTable, etc.)
- `src/services` / `src/utils` — API and helper modules
- `public` / `build` — static assets and production build output

## Running with the local backend

If you want an end-to-end local evaluation, start the backend in `campus-talent-backend` (the workspace includes that folder). Typical steps (in a separate terminal):

```powershell
cd campus-talent-backend
npm install
npm start
```

Then make sure the frontend `api` base URL points to the backend (usually http://localhost:5000 or as configured by the backend). If needed, update `src/utils/api.js`.

## Security & privacy notes (for recruiters)

- Personal data: candidate profiles may contain personal contact info and portfolio media. Treat export or storage of this data according to your org's privacy policy.
- Verification: the app includes verification flows; do not rely solely on the app for background checks — use formal HR processes where required.
- Production readiness: for production use enable HTTPS, secure cookies, token expiration and server-side rate limiting.

## Contributing

Contributions are welcome. If you'd like to:

1. Fork the repo and create a feature branch.
2. Add meaningful tests for new behavior when possible.
3. Open a pull request describing the change and why it's needed.

If you're evaluating the app as a recruiter and want new recruiter-specific features (bulk export, ATS integration), open an issue describing the use case and data requirements.

## Known notes & next steps

- The project currently uses a mock API in `src/api/mockAPI.js` for some flows; connect the full backend to exercise applications and verification.
- Consider adding CI, E2E tests and a seeded demo dataset for easy recruiter evaluation.

## License & contact

This project does not include a license file in the repository. If you'd like to use it commercially, please contact the maintainer in the repo or add a suitable license.

Maintainer / Contact: see repository owner or open an issue on GitHub for questions and recruiting/demo requests.

---

Thank you for checking out Campus Talent 
