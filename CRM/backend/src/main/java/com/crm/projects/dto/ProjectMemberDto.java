package com.crm.projects.dto;

import com.crm.common.enums.UserRole;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
public class ProjectMemberDto {
    private UUID id;
    private UUID projectId;
    private UUID userId;
    private UserRole memberRole;
    private boolean isActive;
    private boolean isTeamLead;
    private ZonedDateTime joinedAt;
}
