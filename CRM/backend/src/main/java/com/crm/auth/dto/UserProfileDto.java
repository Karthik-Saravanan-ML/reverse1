package com.crm.auth.dto;

import com.crm.common.enums.UserRole;
import com.crm.common.enums.UserStatus;
import lombok.Data;

import java.util.UUID;

@Data
public class UserProfileDto {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String profilePhotoUrl;
    private UserRole role;
    private UserStatus status;
}
