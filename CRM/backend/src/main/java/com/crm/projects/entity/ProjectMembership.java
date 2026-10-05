package com.crm.projects.entity;

import com.crm.common.entity.BaseEntity;
import com.crm.common.enums.UserRole;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"projectId", "userId"}))
public class ProjectMembership extends BaseEntity {
    private UUID projectId;
    private UUID userId;
    
    @Enumerated(EnumType.STRING)
    private UserRole memberRole;
    
    private boolean isActive;
    private boolean isTeamLead;
    
    private ZonedDateTime joinedAt;
    private ZonedDateTime removedAt;
    private UUID removedBy;
    private String removalReason;
}
