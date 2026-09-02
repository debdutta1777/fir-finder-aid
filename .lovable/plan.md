# FIR Investigation Portal Frontend

## Goal

Replace the starter page with a professional, light-theme investigation portal for Indian police workflows. The frontend will mirror the documented FastAPI capabilities and remain usable when the local backend is unavailable by switching to clearly labeled demo data.

## User-facing experience

- Create a restrained government-tool visual system: navy authority header, khaki-gold accents, small saffron warning states, slate page backgrounds, compact tables, and accessible contrast. Avoid playful SaaS gradients or unsupported claims.
- Replace the placeholder `/` route with a concise landing page that presents the FIR Summarizer identity, local/air-gapped value, supported file types/languages, and clear entry into the portal.
- Add a shared portal shell with responsive navigation for Dashboard, Upload & Summarize, FIR Number Search, Name Search, All Records, and Chat Assistant. Keep the landing view uncluttered and make the shell mobile-friendly with a collapsible navigation drawer.
- Build the dashboard with API/model status, live record count, recent FIRs, quick search, processing capability metrics, and primary workflow actions. Poll health on a bounded 10–15 second interval and distinguish API offline, model loading, live data, and demo mode.
- Build the upload workflow for PDF, PNG, JPG/JPEG, TIFF, and TXT files: file selection, language selection (including Urdu, Assamese, and Nepali from the specification), processing state, and results. Results will show extracted metadata, English summary, translation status/note, narrative, and collapsible raw OCR with copy/download actions.
- Build FIR-number lookup, free-text/name search, and paginated all-records views using the documented response shapes. Include empty, offline, loading, 404, and backend-error states; allow a record to be inspected without inventing unsupported editing or deletion actions.
- Build the chat assistant as a search-oriented conversation UI backed by `/ask`, showing matching FIR context and a helpful no-match response rather than pretending the backend is generative chat.

## Data and integration

- Add a typed browser API client with a configurable `VITE_BACKEND_URL` defaulting to `http://localhost:8000`.
- Implement the documented endpoints only: `/health`, `/summarize`, `/fir/{number}`, `/search`, `/records`, and `/ask`.
- Normalize backend payloads and missing values (`Not explicitly stated`, `Not available`, `null`) into readable muted placeholders.
- Add deterministic demo fixtures for health, recent records, search, records pagination, chat results, and a representative summarize response. Use live data first; on connection failure, fall back to demo mode and expose that state in the UI rather than silently presenting fixtures as real records.
- Map HTTP 503 from `/summarize` to a model-loading state, HTTP 400 to an unreadable-document message, HTTP 404 to a no-match state, and other failures to a retryable service message.
- Keep all data in browser memory for this frontend-only implementation; do not add authentication, a new database, or fabricated backend capabilities.

## Technical implementation

- Add focused reusable components for the shell, status indicators, record table/card, metadata grid, upload stepper, result panels, empty/error states, and responsive navigation.
- Use the existing shadcn-style UI primitives and semantic design tokens; update the global tokens and base styles to support the police-theme palette, typography, focus states, tables, badges, and reduced-motion behavior.
- Add route files for `/dashboard`, `/upload`, `/search/fir`, `/search/name`, `/records`, and `/assistant`, each with unique `head()` title/description/Open Graph metadata. Update the root metadata and navigation without editing the generated route tree.
- Keep browser-only work inside effects and event handlers. Use client-side fetches for the separate localhost FastAPI service, with abort/timeout handling for health polling and long-running summarize requests.

## Validation

- Verify the landing page, each navigation route, demo fallback, live/offline status states, upload result states, search empty states, pagination, copy/download controls, and responsive layouts in the running preview.
- Check build/runtime diagnostics and confirm no placeholder route, broken route IDs, console errors, or unsupported claims remain.