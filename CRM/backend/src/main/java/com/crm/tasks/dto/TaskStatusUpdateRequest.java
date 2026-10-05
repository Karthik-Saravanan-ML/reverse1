package com.crm.tasks.dto;

import com.crm.tasks.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TaskStatusUpdateRequest {
    @NotNull
    private TaskStatus status;
    
    private int progressPercentage;
    
    private String progressNotes;
}
