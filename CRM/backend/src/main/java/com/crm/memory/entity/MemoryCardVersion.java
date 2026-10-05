package com.crm.memory.entity;

import jakarta.persistence.Column;
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
@Table(name="memory_card_versions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemoryCardVersion {
    @Id
    @GeneratedValue
    private UUID id;
    
    private UUID cardId;
    private int versionNumber;
    
    @Column(columnDefinition="TEXT")
    private String content;
    
    private String title;
    private UUID editedBy;
    private Instant editedAt;
    private String editReason;
}
