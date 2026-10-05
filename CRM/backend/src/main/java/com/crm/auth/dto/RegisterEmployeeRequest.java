package com.crm.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterEmployeeRequest {
    @NotBlank
    private String name;
    
    @NotBlank
    @Email
    private String email;
    
    private String phone;
    private String position;
    private String skills;
    private String joiningDate;
    private String requestReason;
}
