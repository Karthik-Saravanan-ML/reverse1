package com.crm.admin.controller;

import com.crm.auth.entity.User;
import com.crm.common.enums.UserStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminRegistrationController {

    @GetMapping("/registration-requests")
    public ResponseEntity<?> getRegistrationRequests() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/registration-requests/{id}")
    public ResponseEntity<?> getRegistrationRequest(@PathVariable UUID id) {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/registration-requests/{id}/approve")
    public ResponseEntity<?> approveRegistration(@PathVariable UUID id) {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/registration-requests/{id}/reject")
    public ResponseEntity<?> rejectRegistration(@PathVariable UUID id) {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/invite-admin")
    public ResponseEntity<?> inviteAdmin() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> changeUserStatus(@PathVariable UUID id, @RequestParam UserStatus status) {
        return ResponseEntity.ok().build();
    }
}
