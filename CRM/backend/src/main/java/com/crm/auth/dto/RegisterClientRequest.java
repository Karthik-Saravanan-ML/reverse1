package com.crm.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterClientRequest {
    @NotBlank
    private String name;
    
    @NotBlank
    @Email
    private String email;
    
    private String phone;
    private String organizationName;
    private String industry;
    private String website;
    private String address;
    private String projectRequirement;
}
