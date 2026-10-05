package com.crm.memory.dto;

import com.crm.common.enums.ExtractionMethod;
import com.crm.common.enums.MemoryCardType;
import com.crm.common.enums.ReviewStatus;
import com.crm.common.enums.VisibilityLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemoryCardDto {
    private UUID id;
    private UUID projectId;
    private MemoryCardType type;
    private String title;
    private String content;
    private String sourceReference;
    private LocalDate eventDate;
    private ExtractionMethod extractionMethod;
    private Double confidence;
    private ReviewStatus reviewStatus;
    private VisibilityLevel visibility;
    private UUID reviewedBy;
    private String reviewNotes;
    private Instant createdAt;
    private Instant updatedAt;
}
