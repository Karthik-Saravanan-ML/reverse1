package com.crm.projects.entity;

import com.crm.common.entity.BaseEntity;
import com.crm.common.enums.Priority;
import com.crm.common.enums.RequestStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class ProjectRequest extends BaseEntity {
    private UUID projectId;
    private UUID requesterId;
    private UUID organizationId;
    private String title;
    private String businessProblem;
    private String initialRequirements;
    private String expectedFeatures;
    private ZonedDateTime desiredStartDate;
    private ZonedDateTime desiredEndDate;
    private BigDecimal budget;
    
    @Enumerated(EnumType.STRING)
    private Priority priority;
    
    private String notes;
    
    @Enumerated(EnumType.STRING)
    private RequestStatus status;
    
    private UUID reviewedBy;
    private ZonedDateTime reviewedAt;
    private String rejectionReason;
}
