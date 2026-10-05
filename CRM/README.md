# AI-Native CRM Platform with Intelligent Project Memory System

An enterprise-grade, project-centric CRM, internal collaboration system, intelligent project memory engine, and permission-aware RAG AI assistant.

---

## 🚀 Key Architectural Invariant

> **ONE PROJECT = ONE ISOLATED KNOWLEDGE AND COLLABORATION SPACE.**
>
> Security and data isolation are strictly enforced across Database, Backend REST APIs, STOMP WebSockets, MinIO Object Storage, WebRTC Signaling, Vector Embeddings (pgvector), and LLM Retrieval Generation. No user can access cross-project data without explicitly granted membership.

---

## 🏗️ Tech Stack

- **Backend**: Java 21, Spring Boot 3.2, Spring Security (JWT HS512), Spring Data JPA, SockJS + STOMP WebSocket
- **Frontend**: React 18, Vite, Tailwind CSS, Zustand, TanStack React Query v5, SimplePeer WebRTC
- **AI / RAG Service**: Python 3.11, FastAPI, `sentence-transformers` (`all-MiniLM-L6-v2`), `pgvector`, Ollama (Local) / OpenAI API
- **Database & Storage**: PostgreSQL 16 + `pgvector`, MinIO Object Storage
- **Orchestration**: Docker Compose

---

## 👥 Role & Permission Matrix

| Feature / Resource | Admin | Project Manager | Employee | Client |
| :--- | :---: | :---: | :---: | :---: |
| Manager Access Approval | ✅ | ❌ | ❌ | ❌ |
| User Deactivation / Audit | ✅ | ❌ | ❌ | ❌ |
| Create & Manage Projects | ❌ | ✅ | ❌ | ❌ |
| Approve Project Requests | ❌ | ✅ | ❌ | ❌ |
| Assign Team Members / Lead | ❌ | ✅ (Max 3/employee) | ❌ | ❌ |
| Manage Tasks & Kanban | ❌ | ✅ | ✅ | ❌ |
| Submit Project Requests | ❌ | ❌ | ❌ | ✅ |
| Audio/Video WebRTC Calls | ❌ | ✅ | ✅ | ✅ |
| Meeting Notes & Outcomes | ❌ | ✅ | ✅ | ❌ |
| Memory Card Human Review | ❌ | ✅ | ❌ | ❌ |
| AI Assistant RAG Query | ❌ | ✅ (All Visibilities) | ✅ (All Visibilities) | ✅ (CLIENT_SHARED only) |

---

## ⚡ Quickstart & Local Setup

### Prerequisites
- Windows 10/11 with Docker Desktop installed and running in Linux-container mode
- Docker Compose v2 (included with Docker Desktop)

### 1. Open the project and configure environment

Open PowerShell in the project directory:

```powershell
cd "C:\Users\<your-user>\Downloads\CRM"
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
notepad .env
```

The defaults in `.env.example` are for local development. Set `JWT_SECRET` to at least 64 characters and make `INTERNAL_SERVICE_KEY` non-empty; if you already created `.env`, update these values in it. Avoid `@` and `:` in `DB_PASSWORD` unless the password is URL-encoded. Set `OLLAMA_MODEL=llama3.2` to match the optional local AI model below. Do not publish or commit your `.env` file.

Verify Docker Desktop is ready before starting:

```powershell
docker info
```

If Docker reports that it cannot connect to the engine, start Docker Desktop and wait for it to finish starting.

### 2. Build and start the project

From the project directory, run:

```powershell
docker compose up --build -d
```

The first build can take several minutes because Docker downloads the service images, Java/Python/Node dependencies, and the embedding model.

Check container status and recent application logs:

```powershell
docker compose ps
docker compose logs --tail 100 backend ai-service frontend
```

Open the web application at **http://localhost:5173**. Other service endpoints:

- Backend: `http://localhost:8080`
- AI service health check: `http://localhost:8001/health`
- RustFS Console: `http://localhost:9001`
- PostgreSQL: `localhost:5432`
- Ollama: `http://localhost:11434`

To enable local AI answers, download the configured model after the containers start:

```powershell
docker compose exec ollama ollama pull llama3.2
```

### 3. Provisioned Admin Credentials
Upon initial launch, Flyway DB migration (`V11__seed_initial_data.sql`) seeds the initial system administrator:
- **Email**: `admin@crm.local`
- **Password**: `Change@Admin123!`

### Stop and restart

Stop the containers while retaining database and model data:

```powershell
docker compose down
```

Start the project again later:

```powershell
docker compose up -d
```

To also permanently delete the database, uploaded files, and downloaded Ollama models, run `docker compose down -v`.

---

## 🧠 Project Memory System & RAG Security

Each project has an isolated, structured Memory System with **9 Card Types**:
1. `REQUIREMENT`
2. `DECISION`
3. `APPROVAL`
4. `ACTION`
5. `QUESTION`
6. `RISK`
7. `ISSUE`
8. `CHANGE_REQUEST`
9. `CLIENT_FEEDBACK`

### Permission-Aware Vector Search (Pre-Generation Filter)
1. Spring Boot authenticates user project membership and computes allowed visibility levels (`CLIENT_SHARED` for Clients; `INTERNAL_ONLY`, `PROJECT_MEMBERS`, `CLIENT_SHARED` for Employees/Managers).
2. Request forwarded to AI Service via secured internal HTTP header (`X-Internal-Service-Key`).
3. Vector similarity search executes with hard `WHERE project_id = :projectId AND visibility IN (:allowedVisibilities)` filter **BEFORE** LLM context construction.
4. Unauthorized knowledge is never retrieved or fed into the context window.

---

## 📋 Comprehensive Documentation

Detailed documentation is available in the `docs/` folder:
- [`docs/architecture.md`](docs/architecture.md) — Detailed System Architecture & Diagram
- [`docs/api-spec.md`](docs/api-spec.md) — Complete REST & WebSocket API Specification
- [`docs/security.md`](docs/security.md) — Security Model, JWT, & Pre-Retrieval Filtering
- [`docs/requirements-traceability.md`](docs/requirements-traceability.md) — Master Prompt & Implementation Spec Traceability Matrix
