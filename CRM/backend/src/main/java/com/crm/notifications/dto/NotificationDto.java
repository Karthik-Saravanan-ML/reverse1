package com.crm.notifications.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private UUID id;
    private UUID recipientId;
    private String title;
    private String message;
    private String notificationType;
    private String entityType;
    private UUID entityId;
    private boolean isRead;
    private Instant readAt;
    private Instant createdAt;
}
