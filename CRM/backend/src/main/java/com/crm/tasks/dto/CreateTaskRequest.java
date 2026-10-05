package com.crm.tasks.dto;

import com.crm.tasks.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTaskRequest {
    @NotBlank
    private String title;
    
    private String description;
    
    @NotNull
    private UUID projectId;
    
    private UUID assigneeId;
    
    @Builder.Default
    private Priority priority = Priority.MEDIUM;
    
    private LocalDate startDate;
    
    private LocalDate dueDate;
}
