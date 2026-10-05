package com.crm.memory.entity;

import com.crm.common.entity.BaseEntity;
import com.crm.common.enums.ExtractionMethod;
import com.crm.common.enums.MemoryCardType;
import com.crm.common.enums.ReviewStatus;
import com.crm.common.enums.VisibilityLevel;
import jakarta.persistence.Column;
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
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name="memory_cards")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper=true)
public class MemoryCard extends BaseEntity {
    private UUID projectId;
    
    @Enumerated(EnumType.STRING)
    private MemoryCardType type;
    
    private String title;
    
    @Column(columnDefinition="TEXT")
    private String content;
    
    private UUID sourceRecordId;
    private String sourceReference;
    private LocalDate eventDate;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ExtractionMethod extractionMethod = ExtractionMethod.MANUAL;
    
    @Builder.Default
    private Double confidence = 1.0;
    
    @Enumerated(EnumType.STRING)
    private ReviewStatus reviewStatus;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VisibilityLevel visibility = VisibilityLevel.PROJECT_MEMBERS;
    
    private UUID reviewedBy;
    private Instant reviewedAt;
    private String reviewNotes;
}
