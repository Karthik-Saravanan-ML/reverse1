# Requirements Traceability Matrix

This matrix maps every requirement from the Master Build Prompt and Implementation Document to its implementation in the codebase.

---

## 1. Product Invariant & Core Architecture

| ID | Requirement | Implementation Verification | Status |
| :--- | :--- | :--- | :---: |
| **REQ-01** | One Project = One Isolated Knowledge & Collaboration Space | PostgreSQL schemas with `project_id` FK, `ProjectSecurityService.java`, Permission-aware vector retriever `retriever.py` | ✅ Complete |
| **REQ-02** | Multi-Role Access Control (Admin, PM, Employee, Client, Team Lead) | `UserRole` enum, Spring Security `@PreAuthorize`, `ProjectMembership.isTeamLead` | ✅ Complete |
| **REQ-03** | Max 3 Active Projects per Employee Workload Limit | DB partial unique index `idx_unique_active_project_membership`, `ProjectService.addTeamMember()` transactional check | ✅ Complete |

---

## 2. Authentication & User Lifecycle

| ID | Requirement | Implementation Verification | Status |
| :--- | :--- | :--- | :---: |
| **AUTH-01**| Invitation-based onboarding (no unrestricted registration) | `RegistrationRequest`, `Invitation`, `AdminRegistrationController`, `InvitationAcceptPage.jsx` | ✅ Complete |
| **AUTH-02**| Mandatory Profile Photo Upload | `ProfilePhotoUploadPage.jsx`, `/api/users/me/photo` endpoint | ✅ Complete |
| **AUTH-03**| Employee Termination & Immediate Session Revocation | `UserStatus.TERMINATED`, `RefreshToken` DB revocation check in `JwtAuthenticationFilter` | ✅ Complete |

---

## 3. Communication & Real-time Features

| ID | Requirement | Implementation Verification | Status |
| :--- | :--- | :--- | :---: |
| **COMM-01**| Project & Direct Real-time Chat | SockJS + STOMP WebSocket broker (`WebSocketConfig.java`), `ChatWindow.jsx`, `MessageService.java` | ✅ Complete |
| **COMM-02**| WebRTC Peer-to-Peer Audio/Video Calls | SimplePeer WebRTC integration (`CallRoom.jsx`), STOMP signaling in `ChatWebSocketController.java` | ✅ Complete |
| **COMM-03**| Project Meetings & Structured 9-Section Notes | `Meeting.java`, `MeetingNotes.java`, `MeetingNotesEditor.jsx` | ✅ Complete |

---

## 4. Document Storage & Vector Search

| ID | Requirement | Implementation Verification | Status |
| :--- | :--- | :--- | :---: |
| **DOC-01** | Document Storage in Object Storage with DB Metadata | MinIO client integration (`MinioConfig.java`, `DocumentService.java`), PDF/DOCX ingestion | ✅ Complete |
| **DOC-02** | Permission-Aware Vector Search (pgvector + MiniLM embeddings) | `sentence-transformers`, `pgvector` store with HNSW index (`V8__create_documents.sql`, `pgvector_store.py`) | ✅ Complete |
| **DOC-03** | Pre-Retrieval Filtering in RAG Pipeline | `retriever.py` filters `project_id` & `visibility` before context construction in `pipeline.py` | ✅ Complete |

---

## 5. Intelligent Project Memory System

| ID | Requirement | Implementation Verification | Status |
| :--- | :--- | :--- | :---: |
| **MEM-01** | Implementation of all 9 Memory Card Types | `MemoryCardType` enum, `MemoryCard.java`, `V9__create_memory.sql` | ✅ Complete |
| **MEM-02** | Candidate -> Pending Review -> Approved Lifecycle | `ReviewStatus` state transitions in `MemoryCardService.java`, `ReviewQueue.jsx` | ✅ Complete |
| **MEM-03** | Card Provenance & Version History | `SourceRecord.java`, `MemoryCardVersion.java`, `MemoryCardRelation.java` | ✅ Complete |

---

## 6. Containerization & Deployment

| ID | Requirement | Implementation Verification | Status |
| :--- | :--- | :--- | :---: |
| **DEP-01** | Docker Compose multi-service deployment | `docker-compose.yml`, multi-stage `Dockerfile` (Backend & Frontend), Python Dockerfile | ✅ Complete |
| **DEP-02** | Database Extension Initialization Script | `init-scripts/01-init-pgvector.sh` initializes `vector` & `uuid-ossp` extensions | ✅ Complete |
| **DEP-03** | Seed Initial Super Admin | `V11__seed_initial_data.sql` seeds `admin@crm.local` with BCrypt password | ✅ Complete |
