package com.crm.notifications.entity;

import com.crm.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper=true)
public class Notification extends BaseEntity {
    private UUID recipientId;
    private String title;
    
    @Column(columnDefinition="TEXT")
    private String message;
    
    private String notificationType;
    private String entityType;
    private UUID entityId;
    
    @Builder.Default
    private boolean isRead = false;
    
    private Instant readAt;
}
