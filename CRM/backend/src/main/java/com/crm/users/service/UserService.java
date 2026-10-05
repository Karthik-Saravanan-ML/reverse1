package com.crm.users.service;

import com.crm.auth.dto.UserProfileDto;
import com.crm.auth.dto.UserSummaryDto;
import com.crm.auth.entity.User;
import com.crm.auth.repository.UserRepository;
import com.crm.auth.service.AuthService;
import com.crm.common.enums.UserStatus;
import com.crm.common.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AuthService authService;

    public UserProfileDto getCurrentUserProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhone(user.getPhone());
        dto.setProfilePhotoUrl(user.getProfilePhotoUrl());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        return dto;
    }

    @Transactional
    public UserProfileDto updateProfile(UUID userId, UserProfileDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        userRepository.save(user);
        return getCurrentUserProfile(userId);
    }

    @Transactional
    public String uploadProfilePhoto(UUID userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        // Simplified minio upload logic simulation
        String photoUrl = "http://minio/bucket/photo_" + userId + ".jpg";
        user.setProfilePhotoUrl(photoUrl);
        userRepository.save(user);
        return photoUrl;
    }

    @Transactional
    public void updateUserStatus(UUID targetId, UserStatus newStatus, UUID adminId) {
        User user = userRepository.findById(targetId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", targetId));
        user.setStatus(newStatus);
        userRepository.save(user);
        if (newStatus == UserStatus.TERMINATED || newStatus == UserStatus.SUSPENDED) {
            authService.revokeAllUserSessions(user.getId());
        }
    }

    public Page<UserSummaryDto> getUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(user -> {
            UserSummaryDto dto = new UserSummaryDto();
            dto.setId(user.getId());
            dto.setEmail(user.getEmail());
            dto.setFirstName(user.getFirstName());
            dto.setLastName(user.getLastName());
            dto.setRole(user.getRole());
            dto.setStatus(user.getStatus());
            dto.setProfilePhotoUrl(user.getProfilePhotoUrl());
            return dto;
        });
    }
}
