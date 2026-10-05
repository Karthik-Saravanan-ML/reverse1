package com.crm.projects.entity;

import com.crm.common.entity.BaseEntity;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class TeamLeadAssignment extends BaseEntity {
    private UUID projectId;
    private UUID employeeId;
    private UUID assignedBy;
    private ZonedDateTime assignedAt;
    private boolean isActive;
    private ZonedDateTime revokedAt;
    private UUID revokedBy;
}
