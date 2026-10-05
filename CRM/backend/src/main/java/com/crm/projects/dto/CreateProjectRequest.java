package com.crm.projects.dto;

import com.crm.common.enums.Priority;
import lombok.Data;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
public class CreateProjectRequest {
    private String title;
    private String description;
    private String type;
    private UUID managerId;
    private UUID organizationId;
    private ZonedDateTime targetDate;
    private BigDecimal budget;
    private Priority priority;
}
