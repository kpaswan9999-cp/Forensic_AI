# Development Roadmap & Phases

This ledger outlines the progression of Forensic.AI.

---

## 🟩 Phase 1: Foundation (Completed)
- Mapped 7-service container dependencies using Docker Compose.
- Built basic endpoints for claims extraction and RAG matches.
- Created initial Next.js layout structure.

---

## 🟩 Phase 2: Gemini Integration (Completed)
- Switched backend LLM components to Google Gemini API (`gemini-3.5-flash`).
- Upgraded python dependencies to use the official new `google-genai` SDK.
- Implemented frontend API route proxies to bypass unreachable backend states.

---

## 🟩 Phase 3: Premium UI/UX & 3D Upgrades (Completed)
- Built interactive golden-spiral 3D particle network globe in [HeroGlobe.tsx](file:///c:/Users/kpasw/OneDrive/Desktop/Project/ai-forensic-investigator/frontend/src/components/3d/HeroGlobe.tsx).
- Configured dynamic mouse-tilt response fields on the hero canvas.
- Re-styled CSS tokens to support the **Aurora Gold & Obsidian** metallic theme.
- Finished dashboard tabs: New Investigation, History, Analytics, and Network.

---

## 🟦 Phase 4: Production Polish (Planned)
- Write unit tests for RAG retriever scoring models.
- Set up real-time WebSockets to stream analysis steps progressively.
- Integrate active news scraping hooks using the News API keys.
