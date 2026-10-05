package com.crm.tasks.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="task_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    private UUID taskId;
    
    private UUID changedBy;
    
    private String fieldChanged;
    
    private String oldValue;
    
    private String newValue;
    
    @Builder.Default
    private Instant changedAt = Instant.now();
}
