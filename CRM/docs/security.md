# Security Architecture & Data Isolation Model

## 1. Authentication & Token Management

- **JWT Tokens**: Signed with HMAC-SHA512 (`HS512`). Access tokens expire in 15 minutes; Refresh tokens expire in 7 days.
- **Token Storage**: Refresh tokens are stored hashed in PostgreSQL (`refresh_tokens` table) with device/IP tracking, allowing immediate revocation upon logout or termination.
- **Password Security**: Hashing enforced with BCrypt (`strength = 12`). Mandatory validation rules: 8+ characters, uppercase, lowercase, numeric, special character.
- **Account State Machine**:
  `PENDING` -> `ACTIVE` -> `SUSPENDED` / `TERMINATED` -> `ARCHIVED`
  Token verification immediately rejects deactivated accounts even if the JWT has not expired.

---

## 2. Project-Centric Data Isolation

### Invariant: ONE PROJECT = ONE ISOLATED KNOWLEDGE SPACE

1. **Database Isolation**: Every database table stores `project_id` foreign key.
2. **Backend Interceptor / Security Service**: `ProjectSecurityService.hasProjectAccess(projectId, userId)` validates project membership before executing REST or WebSocket controllers.
3. **MinIO Object Isolation**: Documents stored under isolated buckets named `project-{projectId}` with strict presigned URL access authorization.
4. **WebSocket Channel Security**: Subscriptions to `/topic/conversations/{id}` and `/topic/calls/{id}` perform explicit STOMP channel authorization checks.

---

## 3. RAG AI Pre-Generation Security Model

Raw client browser requests **never** interface directly with the AI Service vector store or LLM.

```
[Browser Request]
       │ (Sends JWT + Project ID + Question)
       ▼
[Spring Boot Backend]
       │ 1. Validate JWT & User Status
       │ 2. Check Project Membership for User
       │ 3. Compute Allowed Visibility Levels:
       │    - CLIENT -> ['CLIENT_SHARED']
       │    - EMPLOYEE/MANAGER -> ['INTERNAL_ONLY', 'PROJECT_MEMBERS', 'CLIENT_SHARED']
       │ 4. Attach Service-to-Service Secret Header (X-Internal-Service-Key)
       ▼
[FastAPI AI Service]
       │ 1. Validate X-Internal-Service-Key
       │ 2. Execute pgvector Cosine Distance Search:
       │    WHERE project_id = :projectId AND visibility IN (:allowedVisibilities)
       │ 3. Build Prompt Context ONLY from Authorized Chunks
       ▼
[Ollama / OpenAI LLM]
       │ Generate Answer
       ▼
[Response to User]
```

### Why Pre-Generation Filtering Matters
Post-generation filtering (asking the LLM to ignore secret documents or filtering LLM output) is susceptible to prompt injection attacks. By restricting vector database retrieval before building context, unauthorized data **never enters the LLM prompt context window**.
