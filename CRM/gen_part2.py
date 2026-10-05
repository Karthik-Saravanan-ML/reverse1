import os

base_dir = r"C:\Users\Karthik\Downloads\CRM\backend\src\main\java\com\crm"

files = {
    "tasks/entity/Task.java": """
package com.crm.tasks.entity;
import com.crm.common.entity.BaseEntity;
import com.crm.common.enums.Priority;
import com.crm.common.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
@Entity @Data public class Task extends BaseEntity {
    private UUID projectId; private String title; private String description;
    private UUID assigneeId; private UUID assignerId;
    @Enumerated(EnumType.STRING) private Priority priority;
    @Enumerated(EnumType.STRING) private TaskStatus status;
    private ZonedDateTime startDate; private ZonedDateTime dueDate; private ZonedDateTime completionDate;
    private Integer progressPercentage; private BigDecimal estimatedHours;
    private UUID createdBy;
}
""",
    "tasks/repository/TaskRepository.java": """
package com.crm.tasks.repository;
import com.crm.tasks.entity.Task;
import com.crm.common.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;
public interface TaskRepository extends JpaRepository<Task, UUID> {
    Page<Task> findByProjectId(UUID projectId, Pageable pageable);
    Page<Task> findByAssigneeId(UUID assigneeId, Pageable pageable);
}
""",
    "tasks/service/TaskService.java": """
package com.crm.tasks.service;
import com.crm.tasks.entity.*;
import com.crm.tasks.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
@Service @Transactional
public class TaskService {
    private final TaskRepository repo;
    public TaskService(TaskRepository repo) { this.repo = repo; }
    public Task createTask(Task t) { return repo.save(t); }
    public Page<Task> getTasksByProject(UUID projId, Pageable p) { return repo.findByProjectId(projId, p); }
}
""",
    "communication/entity/Message.java": """
package com.crm.communication.entity;
import com.crm.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
@Entity @Data public class Message extends BaseEntity {
    private UUID conversationId; private UUID senderId; private String content; private String messageType;
    private UUID replyToId; private boolean isEdited; private boolean isDeleted;
}
""",
    "communication/controller/ChatWebSocketController.java": """
package com.crm.communication.controller;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
@Controller
public class ChatWebSocketController {
    @MessageMapping("/chat.send")
    @SendTo("/topic/conversation/{id}")
    public String sendMessage(String message) { return message; }
}
""",
    "meetings/entity/Meeting.java": """
package com.crm.meetings.entity;
import com.crm.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import java.time.ZonedDateTime;
@Entity @Data public class Meeting extends BaseEntity {
    private UUID projectId; private String title; private String description;
    private UUID organizerUserId; private UUID projectManagerId;
    private ZonedDateTime scheduledStartAt; private ZonedDateTime scheduledEndAt;
    private String meetingType; private String status; private String meetingLink;
    private boolean isRecurring;
}
""",
    "documents/entity/Document.java": """
package com.crm.documents.entity;
import com.crm.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
@Entity @Data public class Document extends BaseEntity {
    private UUID projectId; private UUID uploadedBy; private String fileName; private String originalFileName;
    private String fileType; private String mimeType; private Long fileSize; private String checksum;
    private String storageKey; private String storageUrl; private String processingStatus;
    private boolean isActive;
}
""",
    "memory/entity/MemoryCard.java": """
package com.crm.memory.entity;
import com.crm.common.entity.BaseEntity;
import com.crm.common.enums.MemoryCardType;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
@Entity @Data public class MemoryCard extends BaseEntity {
    private UUID projectId; @Enumerated(EnumType.STRING) private MemoryCardType type;
    private String title; private String content; private UUID sourceRecordId;
    private String extractionMethod; private String reviewStatus; private boolean isActive;
}
""",
    "notifications/entity/Notification.java": """
package com.crm.notifications.entity;
import com.crm.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
@Entity @Data public class Notification extends BaseEntity {
    private UUID recipientId; private String type; private String title; private String message;
    private String entityType; private UUID entityId; private UUID projectId;
    private boolean isRead;
}
""",
    "audit/entity/AuditLog.java": """
package com.crm.audit.entity;
import com.crm.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
@Entity @Data public class AuditLog extends BaseEntity {
    private UUID userId; private String action; private String entityType; private UUID entityId;
    private UUID projectId; private String ipAddress; private String userAgent; private boolean success;
}
""",
    "memory/rag/controller/RagController.java": """
package com.crm.memory.rag.controller;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
@RestController @RequestMapping("/api/projects/{projectId}/ai")
public class RagController {
    @PostMapping("/ask")
    public String ask(@PathVariable UUID projectId, @RequestBody String question) { return "RAG Response stub"; }
}
"""
}

for path, content in files.items():
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip())
print("Part 2 generated")
