package com.crm.config.security;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service("projectSecurity")
public class ProjectSecurityService {

    public boolean isMember(UUID projectId, UUID userId) {
        // TODO: implement with actual DB check
        return true;
    }

    public boolean hasRole(UUID projectId, UUID userId, String role) {
        return true;
    }

    public boolean isTeamLead(UUID projectId, UUID userId) {
        return true;
    }

    public boolean canAccessDocument(UUID documentId, UUID userId) {
        return true;
    }
}
