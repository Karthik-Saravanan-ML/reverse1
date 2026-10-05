package com.crm.notifications.controller;

import com.crm.notifications.dto.NotificationDto;
import com.crm.notifications.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/")
    public Page<NotificationDto> getNotifications(Pageable pageable) {
        return notificationService.getNotifications(null, pageable);
    }

    @GetMapping("/unread-count")
    public long getUnreadCount() {
        return notificationService.getUnreadCount(null);
    }

    @PostMapping("/{id}/read")
    public void markAsRead(@PathVariable UUID id) {
        notificationService.markAsRead(id, null);
    }

    @PostMapping("/read-all")
    public void markAllAsRead() {
        notificationService.markAllAsRead(null);
    }
}
