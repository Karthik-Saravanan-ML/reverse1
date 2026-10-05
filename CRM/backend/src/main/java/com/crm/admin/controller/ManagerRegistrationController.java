package com.crm.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/manager/admin")
@PreAuthorize("hasRole('PROJECT_MANAGER')")
public class ManagerRegistrationController {

    @GetMapping("/registration-requests")
    public ResponseEntity<?> getRegistrationRequests() {
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
}
