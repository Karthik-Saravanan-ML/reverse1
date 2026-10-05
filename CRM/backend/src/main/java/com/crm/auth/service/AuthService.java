package com.crm.auth.service;

import com.crm.auth.dto.*;
import com.crm.auth.entity.*;
import com.crm.auth.repository.*;
import com.crm.common.dto.ApiResponse;
import com.crm.common.enums.InvitationStatus;
import com.crm.common.enums.RequestStatus;
import com.crm.common.enums.UserRole;
import com.crm.common.enums.UserStatus;
import com.crm.common.exception.AppException;
import com.crm.common.exception.ResourceNotFoundException;
import com.crm.config.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RegistrationRequestRepository registrationRequestRepository;

    @Autowired
    private InvitationRepository invitationRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = (User) authentication.getPrincipal();

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new AppException("Account is " + user.getStatus(), HttpStatus.UNAUTHORIZED);
        }

        user.setLastLoginAt(ZonedDateTime.now());
        userRepository.save(user);

        String jwt = tokenProvider.generateToken(user);
        
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setUserId(user.getId());
        refreshToken.setExpiresAt(ZonedDateTime.now().plusDays(7));
        refreshToken.setRevoked(false);
        refreshTokenRepository.save(refreshToken);

        UserSummaryDto userSummary = UserSummaryDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .status(user.getStatus())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .build();

        return LoginResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(86400)
                .user(userSummary)
                .build();
    }

    @Transactional
    public ApiResponse<Void> register(RegisterManagerRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException("Email already exists", HttpStatus.CONFLICT);
        }
        RegistrationRequest regReq = RegistrationRequest.builder()
                .requestType(UserRole.PROJECT_MANAGER)
                .status(RequestStatus.PENDING)
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .department(request.getDepartment())
                .jobTitle(request.getJobTitle())
                .experienceLevel(request.getExperienceLevel())
                .requestReason(request.getRequestReason())
                .build();
        registrationRequestRepository.save(regReq);
        emailService.sendRegistrationPendingEmail(regReq);
        return new ApiResponse<>(true, "Registration request submitted successfully", null);
    }

    @Transactional
    public ApiResponse<Void> register(RegisterEmployeeRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException("Email already exists", HttpStatus.CONFLICT);
        }
        RegistrationRequest regReq = RegistrationRequest.builder()
                .requestType(UserRole.EMPLOYEE)
                .status(RequestStatus.PENDING)
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .position(request.getPosition())
                .skills(request.getSkills())
                .joiningDate(request.getJoiningDate())
                .requestReason(request.getRequestReason())
                .build();
        registrationRequestRepository.save(regReq);
        emailService.sendRegistrationPendingEmail(regReq);
        return new ApiResponse<>(true, "Registration request submitted successfully", null);
    }

    @Transactional
    public ApiResponse<Void> register(RegisterClientRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException("Email already exists", HttpStatus.CONFLICT);
        }
        RegistrationRequest regReq = RegistrationRequest.builder()
                .requestType(UserRole.CLIENT)
                .status(RequestStatus.PENDING)
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .organizationName(request.getOrganizationName())
                .industry(request.getIndustry())
                .website(request.getWebsite())
                .address(request.getAddress())
                .projectRequirement(request.getProjectRequirement())
                .build();
        registrationRequestRepository.save(regReq);
        emailService.sendRegistrationPendingEmail(regReq);
        return new ApiResponse<>(true, "Registration request submitted successfully", null);
    }

    @Transactional
    public LoginResponse acceptInvitation(InvitationAcceptRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new AppException("Passwords do not match", HttpStatus.BAD_REQUEST);
        }

        Invitation invitation = invitationRepository.findByTokenAndStatus(request.getToken(), InvitationStatus.PENDING)
                .orElseThrow(() -> new AppException("Invalid or expired invitation token", HttpStatus.BAD_REQUEST));

        if (invitation.getExpiresAt().isBefore(ZonedDateTime.now())) {
            invitation.setStatus(InvitationStatus.EXPIRED);
            invitationRepository.save(invitation);
            throw new AppException("Invitation has expired", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setEmail(invitation.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(invitation.getRole());
        user.setStatus(UserStatus.ACTIVE);
        user.setEmailVerified(true);
        userRepository.save(user);

        invitation.setStatus(InvitationStatus.ACCEPTED);
        invitation.setAcceptedAt(ZonedDateTime.now());
        invitationRepository.save(invitation);

        emailService.sendWelcomeEmail(user);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(user.getEmail());
        loginRequest.setPassword(request.getPassword());
        return login(loginRequest);
    }

    @Transactional
    public ApiResponse<Void> requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            PasswordResetToken token = new PasswordResetToken();
            token.setToken(UUID.randomUUID().toString());
            token.setUserId(user.getId());
            token.setExpiresAt(ZonedDateTime.now().plusHours(24));
            token.setUsed(false);
            passwordResetTokenRepository.save(token);
            emailService.sendPasswordResetEmail(email, token.getToken());
        }
        return new ApiResponse<>(true, "If an account exists, a reset link has been sent.", null);
    }

    @Transactional
    public ApiResponse<Void> resetPassword(PasswordResetConfirmRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new AppException("Passwords do not match", HttpStatus.BAD_REQUEST);
        }
        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenAndUsedFalseAndExpiresAtAfter(request.getToken(), ZonedDateTime.now())
                .orElseThrow(() -> new AppException("Invalid or expired reset token", HttpStatus.BAD_REQUEST));

        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", resetToken.getUserId()));

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        revokeAllUserSessions(user.getId());

        return new ApiResponse<>(true, "Password has been successfully reset", null);
    }

    @Transactional
    public LoginResponse refreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByTokenAndRevokedFalse(token)
                .orElseThrow(() -> new AppException("Invalid refresh token", HttpStatus.UNAUTHORIZED));

        if (refreshToken.getExpiresAt().isBefore(ZonedDateTime.now())) {
            throw new AppException("Refresh token expired", HttpStatus.UNAUTHORIZED);
        }

        User user = userRepository.findById(refreshToken.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", refreshToken.getUserId()));

        String jwt = tokenProvider.generateToken(user);
        
        UserSummaryDto userSummary = UserSummaryDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .status(user.getStatus())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .build();

        return LoginResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(86400)
                .user(userSummary)
                .build();
    }

    @Transactional
    public void logout(String token, UUID userId) {
        refreshTokenRepository.findByTokenAndRevokedFalse(token).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

    @Transactional
    public void revokeAllUserSessions(UUID userId) {
        List<RefreshToken> tokens = refreshTokenRepository.findByUserId(userId);
        for (RefreshToken token : tokens) {
            token.setRevoked(true);
        }
        refreshTokenRepository.saveAll(tokens);
    }
}
