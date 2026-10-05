package com.crm.projects.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Instant;
import java.util.UUID;
import com.crm.common.enums.RequestStatus;
import com.crm.common.enums.Priority;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRequestDto {
    private UUID id;
    private String title;
    private String description;
    private String projectType;
    private String businessProblem;
    private String initialRequirements;
    private String expectedFeatures;
    private Priority priority;
    private LocalDate desiredStartDate;
    private LocalDate desiredEndDate;
    private BigDecimal budget;
    private RequestStatus status;
    private UUID clientId;
    private String clientName;
    private String reviewNotes;
    private Instant createdAt;
    private Instant updatedAt;
}
