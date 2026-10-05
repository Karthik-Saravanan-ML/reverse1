package com.crm.documents.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="document_processing_jobs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentProcessingJob {
    @Id
    @GeneratedValue
    private UUID id;
    
    private UUID documentId;
    
    @Builder.Default
    private String status = "PENDING";
    
    private Instant startedAt;
    private Instant completedAt;
    private String errorMessage;
}
