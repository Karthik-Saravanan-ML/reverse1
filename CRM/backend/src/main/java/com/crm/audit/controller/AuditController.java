package com.crm.audit.controller;

import com.crm.audit.entity.AuditLog;
import com.crm.audit.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/audit")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @GetMapping("/")
    public Page<AuditLog> getAuditLogs(Pageable pageable) {
        return auditService.getAuditLogs(pageable);
    }

    @GetMapping("/project/{projectId}")
    public Page<AuditLog> getAuditLogsForProject(@PathVariable UUID projectId, Pageable pageable) {
        return auditService.getAuditLogsForProject(projectId, pageable);
    }
}
