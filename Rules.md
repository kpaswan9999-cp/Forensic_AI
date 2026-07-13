# Development & Coding Rules

## 1. Environment & Config Rules
- **API Keys**: All sensitive credentials must reside in the local `.env` file. Never hardcode API keys in repositories.
- **Docker Mounts**: Local backend files must mount to `/app/backend` inside the containers to match Python package paths.

---

## 2. Coding Standards
### 2.1. Python (FastAPI Backend)
- **Formatting**: Adhere to PEP 8 standards.
- **Asynchronous Code**: Use async/await for I/O bound queries (e.g., HTTP fetches, database hits).
- **Docstrings**: Maintain detailed docstrings describing function signatures and return schemas.
- **Imports**: Avoid circular references; initialize packages using blank `__init__.py` markers.

### 2.2. TypeScript & React (Frontend)
- **Types**: Explicitly type React states and function arguments. Avoid using `any` unless absolutely necessary.
- **Components**: Group UI elements inside `src/components/ui/` and 3D canvases inside `src/components/3d/`.
- **Framer Motion**: Always cast bezier curves or easing arrays to number tuples: `as [number, number, number, number]`.

---

## 3. Deployment & Ports

| Service | Port | Access Scope |
|---|---|---|
| **Next.js Frontend** | `3000` | Public browser access |
| **FastAPI Backend** | `8000` | Browser API `/docs` |
| **Celery Flower** | `5555` | Monitoring dashboard |
| **Qdrant DB** | `6333` | Vector query access |
| **PostgreSQL** | `5432` | Relational storage logs |
