# Live Link: https://forensic-ai-delta.vercel.app/
# AI Forensic Investigator 🕵️

An AI-powered misinformation detection and fact verification system that ingests multi-source data, extracts claims, cross-verifies against trusted sources, detects contradictions, and outputs a credibility score with explainable reasoning.

## Overview

Given a piece of information, this system answers:
- Is it true?
- Who said it first?
- Does it contradict other sources?
- How reliable is the source?
- What's the confidence level?

This is a multi-step reasoning + retrieval + verification pipeline.

## Features

- **Multi-source ingestion**: News APIs, Social Media, Fact-Check Databases.
- **Claim Extraction**: Extracts specific verifiable claims from raw text using LLMs.
- **Hybrid Retrieval**: Combines Semantic Search (Qdrant + BGE-Large) and BM25, with Cross-Encoder re-ranking.
- **Reasoning Engine**: Chain-of-Thought verification over retrieved evidence.
- **Dashboard**: Modern dashboard with credibility scores, visual timelines, and contradiction mapping.

## Tech Stack

- **Backend**: FastAPI, Python 3.10+
- **Database**: PostgreSQL (Data), Qdrant (Vectors), Redis (Cache)
- **AI Models**: OpenAI GPT-4o, BGE-Large-En, MS-Marco-MiniLM Cross-Encoder
- **Frontend**: Next.js 14, TailwindCSS
- **Infrastructure**: Docker, Celery

## Getting Started

1. Clone the repository
2. Fill out `.env` with your API keys (OpenAI, Twitter, Reddit, etc.)
3. Run `docker-compose up --build -d`
4. Access the API at `http://localhost:8000/docs`
5. Run the Next.js frontend in the `frontend` folder using `npm run dev`

## Architecture

1. Data Ingestion Pipeline
2. Claim Extraction Module
3. Vector Database (RAG Core)
4. Multi-Stage Retrieval Engine
5. Reasoning & Verification Engine
6. Scoring Engine
7. Output Layer (Dashboard)

## License
MIT
