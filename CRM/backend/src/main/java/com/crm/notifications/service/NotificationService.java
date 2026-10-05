package com.crm.notifications.service;

import com.crm.notifications.dto.NotificationDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class NotificationService {

    public NotificationDto createNotification(UUID recipientId, String title, String message, String type, String entityType, UUID entityId) {
        return null;
    }

    public void markAsRead(UUID notificationId, UUID userId) {
    }

    public void markAllAsRead(UUID userId) {
    }

    public Page<NotificationDto> getNotifications(UUID userId, Pageable pageable) {
        return Page.empty();
    }

    public long getUnreadCount(UUID userId) {
        return 0;
    }

    public void logActivity(UUID projectId, UUID userId, String eventType, String entityType, UUID entityId, String description) {
    }
}
