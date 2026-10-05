package com.crm.tasks.dto;

import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskHistoryDto {
    private UUID id;
    private UUID taskId;
    private UUID changedBy;
    private String fieldChanged;
    private String oldValue;
    private String newValue;
    private Instant changedAt;
}
