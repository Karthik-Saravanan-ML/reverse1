package com.crm.documents.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name="document_chunks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentChunk {
    @Id
    @GeneratedValue
    private UUID id;
    
    private UUID documentId;
    private UUID projectId;
    private int chunkIndex;
    
    @Column(columnDefinition="TEXT")
    private String content;
    
    @Column(columnDefinition="TEXT")
    private String metadata;
}
