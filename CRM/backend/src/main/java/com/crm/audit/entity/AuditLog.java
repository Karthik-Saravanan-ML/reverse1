package com.crm.audit.entity;

import com.crm.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name="audit_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper=true)
public class AuditLog extends BaseEntity {
    private UUID actorId;
    private String actorEmail;
    private String action;
    private String entityType;
    private UUID entityId;
    private UUID projectId;
    private String ipAddress;
    private String userAgent;
    private String requestPath;
    private String requestMethod;
    
    @Column(columnDefinition="TEXT")
    private String requestBody;
    
    private int responseStatus;
    private Long duration;
}
