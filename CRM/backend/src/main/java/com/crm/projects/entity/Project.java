package com.crm.projects.entity;

import com.crm.common.entity.BaseEntity;
import com.crm.common.enums.ProjectStatus;
import com.crm.common.enums.Priority;
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
public class Project extends BaseEntity {
    private String title;
    private String description;
    private String type;
    
    @Enumerated(EnumType.STRING)
    private ProjectStatus status;
    
    private UUID managerId;
    private UUID organizationId;
    
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;
    private ZonedDateTime targetDate;
    
    private BigDecimal budget;
    
    @Enumerated(EnumType.STRING)
    private Priority priority;
    
    private Integer progressPercentage;
    private boolean isActive;
    
    private UUID createdBy;
    private UUID updatedBy;
}
