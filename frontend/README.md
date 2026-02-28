# Frontend

This folder contains the React + Tailwind frontend for the Legal Aid Matching Platform.

Overview
- Provides UI for registration, case submission, search/matching results, secure chat, scheduling, notifications, and the impact dashboard.

For collaborators (who to contact / responsibilities)
- Frontend developers: build React components, implement forms, manage state, and connect to backend APIs.
- UX engineers: polish the plain-language case submission flow, map interactions, and accessibility.
- QA: test flows across devices, validate authentication flows, and verify WebSocket messaging UX.

Quick start (development)
- Node 16+ recommended. From `frontend/`:

	npm install
	npm run dev

- Check `package.json` scripts for the exact dev/build/test commands.

Environment variables
- Typical `.env` keys used by the frontend (prefix with `REACT_APP_` or configure via framework):
	- `REACT_APP_API_URL` (backend base URL)
	- `REACT_APP_GOOGLE_MAPS_KEY`
	- `REACT_APP_WS_URL` (WebSocket server URL)

Auth & tokens
- The frontend should obtain JWT access and refresh tokens from the backend and store them securely (refresh token in httpOnly cookie or secure storage pattern defined by the team).
- Support OAuth redirects for Google/GitHub; handle token exchange via backend endpoints.

Key UI areas to implement
- Registration & verification flows for `CITIZEN`, `LAWYER`, `NGO` accounts.
- Case submission UI that accepts plain-language input and optional attachments.
- Search/Matching results UI with filters for expertise, distance, and availability.
- Secure chat component using WebSocket or a real-time messaging library (show unread counts and typing indicators).
- Appointment scheduling UI integrated with notifications and calendar invites.
- Notifications center and an impact dashboard summarizing resolved cases and network metrics.

Testing & quality
- Run unit tests: `npm test`.
- Use `eslint` and `prettier` for linting/formatting. Ensure components are accessible (axe/lighthouse checks).

Build & deploy
- Production build: `npm run build`.
- The build output should be served by a static host or integrated with the backend as needed.

Development conventions
- Use feature branches, small PRs, and include screenshots or animated GIFs for UI changes.
- Keep components reusable; centralize API calls in a `services/api` module.

Where to find more info
- See the `frontend/package.json` for scripts and dependencies.
- UI spec and components may be in `frontend/src/components` and storybook if configured.
