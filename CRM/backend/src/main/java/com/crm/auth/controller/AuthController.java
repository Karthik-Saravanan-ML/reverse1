package com.crm.auth.controller;

import com.crm.auth.dto.*;
import com.crm.auth.service.AuthService;
import com.crm.common.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.crm.auth.entity.User;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register/manager")
    public ResponseEntity<ApiResponse<Void>> registerManager(@Valid @RequestBody RegisterManagerRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/register/employee")
    public ResponseEntity<ApiResponse<Void>> registerEmployee(@Valid @RequestBody RegisterEmployeeRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/register/client")
    public ResponseEntity<ApiResponse<Void>> registerClient(@Valid @RequestBody RegisterClientRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request.getRefreshToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@Valid @RequestBody RefreshTokenRequest request, @AuthenticationPrincipal User user) {
        authService.logout(request.getRefreshToken(), user.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Logged out successfully", null));
    }

    @PostMapping("/password-reset/request")
    public ResponseEntity<ApiResponse<Void>> requestPasswordReset(@Valid @RequestBody PasswordResetRequest request) {
        return ResponseEntity.ok(authService.requestPasswordReset(request.getEmail()));
    }

    @PostMapping("/password-reset/confirm")
    public ResponseEntity<ApiResponse<Void>> confirmPasswordReset(@Valid @RequestBody PasswordResetConfirmRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }

    @PostMapping("/invitation/accept")
    public ResponseEntity<LoginResponse> acceptInvitation(@Valid @RequestBody InvitationAcceptRequest request) {
        return ResponseEntity.ok(authService.acceptInvitation(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserSummaryDto> getMe(@AuthenticationPrincipal User user) {
        UserSummaryDto userSummary = UserSummaryDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .status(user.getStatus())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .build();
        return ResponseEntity.ok(userSummary);
    }
}
