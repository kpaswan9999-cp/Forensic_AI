# Product Requirements Document (PRD) - Forensic.AI

## 1. Executive Summary
**Forensic.AI** is an enterprise-grade OSINT (Open Source Intelligence) and fact-checking dashboard designed to extract, analyze, and verify factual assertions from digital text. It provides journalists, forensic analysts, and researchers with real-time credibility assessments, step-by-step logic chains, and propagation maps to combat digital misinformation.

---

## 2. Core Objectives
- **Automatic Claim Extraction**: Parse natural language text and isolate specific, testable assertions.
- **Hybrid Verification (RAG)**: Search historical fact-checks, web articles, and vector indexes to retrieve matching evidence.
- **Explainable AI Verdicts**: Grade claims as `TRUE`, `FALSE`, `PARTIALLY_TRUE`, or `MISLEADING` with a numerical confidence score.
- **Social Propagation Mapping**: Visualize sharing vectors and risk patterns of misinformation.

---

## 3. Key Features
### 3.1. Analytical Fact-Checking
- Input text area supporting up to 5,000 characters.
- Live pipeline loading alerts showing active operations.
- Credibility circular gauges with A-F grading.

### 3.2. Forensic Ledger (History)
- Audit log of past scans, allowing users to reload previous analyses.

### 3.3. Information Flow Mapping
- Interactive source network nodes showing sharing clusters, bot propagation risks, and credibility links.

### 3.4. Analytics Dashboard
- Weekly audit volumes.
- Classification category tags (Politics, Health, Tech, Finance).
- Latency and accuracy trends.

---

## 4. Non-Functional Requirements
- **High Performance**: RAG response and AI consensus reasoning in under 2 seconds.
- **Fail-Safe Fallbacks**: If the FastAPI backend is unreachable, Next.js falls back to direct Gemini API calls; if the API quota is hit, it falls back to styled mock data.
- **Responsive Theme**: Premium Obsidian Dark layout optimization for desktop viewports.
