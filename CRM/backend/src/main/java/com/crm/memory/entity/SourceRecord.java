package com.crm.memory.entity;

import com.crm.common.entity.BaseEntity;
import com.crm.common.enums.SourceType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="source_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper=true)
public class SourceRecord extends BaseEntity {
    private UUID projectId;
    
    @Enumerated(EnumType.STRING)
    private SourceType sourceType;
    
    private UUID entityId;
    private String title;
    
    @Builder.Default
    private Instant extractedAt = Instant.now();
    
    @Builder.Default
    private boolean processedForMemory = false;
}
