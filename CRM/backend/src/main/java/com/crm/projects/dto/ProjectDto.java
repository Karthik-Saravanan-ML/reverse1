package com.crm.projects.dto;

import com.crm.common.enums.ProjectStatus;
import com.crm.common.enums.Priority;
import lombok.Data;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
public class ProjectDto {
    private UUID id;
    private String title;
    private String description;
    private String type;
    private ProjectStatus status;
    private UUID managerId;
    private UUID organizationId;
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;
    private ZonedDateTime targetDate;
    private BigDecimal budget;
    private Priority priority;
    private Integer progressPercentage;
    private boolean isActive;
}
