# API & WebSocket Specification

## 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Request Body | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | `{ email, password }` | Authenticate and retrieve JWT access/refresh tokens. |
| `POST` | `/api/auth/register/manager` | Manager Registration Payload | Submit request for Manager account. |
| `POST` | `/api/auth/register/employee` | Employee Registration Payload | Submit request for Employee account. |
| `POST` | `/api/auth/register/client` | Client Registration Payload | Submit request for Client account + initial project requirement. |
| `GET`  | `/api/auth/invitation/{token}` | None | Validate single-use expiring invitation token. |
| `POST` | `/api/auth/invitation/accept` | `{ token, password }` | Activate user account and set password. |
| `POST` | `/api/auth/refresh` | `{ refreshToken }` | Generate new access token using refresh token. |
| `POST` | `/api/auth/logout` | None | Revoke active refresh token. |

---

## 2. Projects & Team Management (`/api/projects`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET`  | `/api/projects` | Get all authorized projects for authenticated user. |
| `GET`  | `/api/projects/{id}` | Get specific project details (requires membership). |
| `POST` | `/api/projects` | Create new project workspace (Project Manager only). |
| `PUT`  | `/api/projects/{id}` | Update project details (Project Manager only). |
| `GET`  | `/api/projects/{id}/team` | Get project team members and Team Lead status. |
| `POST` | `/api/projects/{id}/team` | Add employee to project team (enforces max 3 active projects limit). |
| `DELETE`| `/api/projects/{id}/team/{userId}`| Remove employee from project team. |
| `POST` | `/api/projects/{id}/team-lead` | Assign/change Team Lead for project. |
| `GET`  | `/api/projects/workload` | Get employee workload metrics across all active projects. |

---

## 3. Communication & WebSockets (`/ws` & `/api/conversations`)

### STOMP WebSocket Channels
- **Connect URL**: `/ws` (with `Authorization: Bearer <token>` STOMP header)
- **Chat Destination**: `/app/chat.send` -> Broadcasts to `/topic/conversations/{conversationId}`
- **Typing Status**: `/app/chat.typing` -> Broadcasts to `/topic/conversations/{conversationId}/typing`
- **WebRTC Signaling**: `/app/call.signal` -> Relays SDP offer/answer/ICE candidates to `/topic/calls/{sessionId}/signal`
- **User Notifications**: `/user/queue/notifications`

---

## 4. Meetings & Structured Memory (`/api/projects/{projectId}`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET`  | `/meetings` | List scheduled & past meetings for project. |
| `POST` | `/meetings` | Schedule project meeting. |
| `GET`  | `/meetings/{id}/notes` | Get structured 9-section meeting notes. |
| `PUT`  | `/meetings/{id}/notes` | Save structured meeting notes. |
| `POST` | `/meetings/{id}/submit-to-memory` | Extract outcomes & submit to Project Memory review queue. |
| `GET`  | `/memory` | List approved Project Memory Cards. |
| `GET`  | `/memory/review-queue` | Get cards pending human review. |
| `POST` | `/memory/{id}/review` | Action card review (`APPROVE`, `EDIT`, `REJECT`). |

---

## 5. RAG AI Assistant (`/api/rag`)

| Method | Endpoint | Payload | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/rag/ask` | `{ question, projectId, topK }` | Execute permission-aware RAG question answering. |
