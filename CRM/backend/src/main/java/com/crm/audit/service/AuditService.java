package com.crm.audit.service;

import com.crm.audit.entity.AuditLog;
import com.crm.audit.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Async
    public void log(UUID actorId, String actorEmail, String action, String entityType, UUID entityId, UUID projectId, String ipAddress) {
        AuditLog auditLog = AuditLog.builder()
                .actorId(actorId)
                .actorEmail(actorEmail)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .projectId(projectId)
                .ipAddress(ipAddress)
                .build();
        auditLogRepository.save(auditLog);
    }

    public Page<AuditLog> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public Page<AuditLog> getAuditLogsForProject(UUID projectId, Pageable pageable) {
        return auditLogRepository.findByProjectIdOrderByCreatedAtDesc(projectId, pageable);
    }
}
