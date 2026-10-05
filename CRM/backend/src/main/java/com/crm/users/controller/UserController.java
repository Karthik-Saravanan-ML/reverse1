package com.crm.users.controller;

import com.crm.auth.dto.UserProfileDto;
import com.crm.auth.dto.UserSummaryDto;
import com.crm.auth.entity.User;
import com.crm.common.enums.UserStatus;
import com.crm.users.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me/profile")
    public ResponseEntity<UserProfileDto> getMyProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getCurrentUserProfile(user.getId()));
    }

    @PutMapping("/me/profile")
    public ResponseEntity<UserProfileDto> updateMyProfile(@AuthenticationPrincipal User user, @RequestBody UserProfileDto profileDto) {
        return ResponseEntity.ok(userService.updateProfile(user.getId(), profileDto));
    }

    @PostMapping("/me/profile-photo")
    public ResponseEntity<String> uploadProfilePhoto(@AuthenticationPrincipal User user, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(userService.uploadProfilePhoto(user.getId(), file));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<UserProfileDto> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getCurrentUserProfile(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateUserStatus(@PathVariable UUID id, @RequestParam UserStatus status, @AuthenticationPrincipal User admin) {
        userService.updateUserStatus(id, status, admin.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserSummaryDto>> getAllUsers(Pageable pageable) {
        return ResponseEntity.ok(userService.getUsers(pageable));
    }
}
