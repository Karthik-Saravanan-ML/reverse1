package com.crm.tasks.dto;

import com.crm.tasks.enums.Priority;
import com.crm.tasks.enums.TaskStatus;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDto {
    private UUID id;
    private String title;
    private String description;
    private UUID projectId;
    private UUID assigneeId;
    private UUID assignerId;
    private Priority priority;
    private TaskStatus status;
    private LocalDate startDate;
    private LocalDate dueDate;
    private LocalDate completionDate;
    private int progressPercentage;
    private String progressNotes;
    private String assigneeName;
    private Instant createdAt;
    private Instant updatedAt;
}
