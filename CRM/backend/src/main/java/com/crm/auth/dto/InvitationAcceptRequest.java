package com.crm.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class InvitationAcceptRequest {
    @NotBlank
    private String token;

    @NotBlank
    private String password;

    @NotBlank
    private String confirmPassword;
}
