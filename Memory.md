# Project State & Memory Ledger

This file tracks major technical blocks, errors resolved, and key developer notes during the build.

---

## 1. Key Bugs & Resolutions

### 1.1. Version Conflicts (Requirements)
- **Problem**: `httpx==0.28.1` caused a dependency conflict with `qdrant-client`'s HTTP/2 requirements. Additionally, old `langsmith` pins conflicted with `langchain`.
- **Solution**: Removed unnecessary heavy ML packages (`torch`, `spacy`, `langchain`) from `requirements.txt` because the current code did not import them. Flexible package ranges like `httpx>=0.23.0,<1.0.0` solved conflicts, cutting build sizes by 95%.

### 1.2. Backend Volume Mismatch
- **Problem**: The backend container volume was mapped to `/app` while Python sought packages in `/app/backend`.
- **Solution**: Updated `docker-compose.yml` mounts to `./backend:/app/backend`.

### 1.3. Module Not Found
- **Problem**: FastAPI failed to launch because subfolders did not have python package markers.
- **Solution**: Created empty `__init__.py` files inside all backend package directories.

### 1.4. Gemini Model Quotas & Deprecations
- **Problem**: The key used a newer format (`AQ.`) that encountered a `NotFound` error for `v1beta` models on the deprecated SDK, and `gemini-2.0-flash` returned a quota limit error.
- **Solution**: Installed the new `google-genai` SDK and successfully tested it on `gemini-3.5-flash`, which has an active quota. Updated all backend engines and frontend Next.js API routes to use `gemini-3.5-flash`.

---

## 2. Current State
- Next.js compiles cleanly with 0 TypeScript/Turbopack errors.
- Active sessions are securely tracked (`localStorage.setItem("isLoggedIn", "true")`) during Login/Signup.
- Home page navbar automatically swaps the static "Launch App" button with a professional **User Avatar Circle & Dropdown** when logged in.
- Dashboard `/dashboard` is protected by client-side **Route Guards** (redirects unauthenticated hits to `/login`).
- Dashboard opens into a professional **Overview Hub** by default (displaying index counts and system health) instead of the input search page.
- "How It Works" tab renders a **3D perspective flowchart** with rotating cards, glare reflections, and a background floating particle canvas.
- Extracted claim cards show **Corrected Assertions / True Context** automatically below false statements, flat-rendered by default (no accordion clicking required).
- Tested Gemini connection with `gemini-3.5-flash` model using user's credential key — confirmed **ACTIVE** status.
