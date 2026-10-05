package com.crm.tasks.entity;

import com.crm.common.entity.BaseEntity;
import com.crm.tasks.enums.Priority;
import com.crm.tasks.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name="tasks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Task extends BaseEntity {

    private String title;
    
    private String description;
    
    private UUID projectId;
    
    private UUID assigneeId;
    
    private UUID assignerId;
    
    @Enumerated(EnumType.STRING)
    private Priority priority;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TaskStatus status = TaskStatus.TODO;
    
    private LocalDate startDate;
    
    private LocalDate dueDate;
    
    private LocalDate completionDate;
    
    @Builder.Default
    private int progressPercentage = 0;
    
    private String progressNotes;
}
