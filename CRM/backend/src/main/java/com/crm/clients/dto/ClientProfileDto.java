package com.crm.clients.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class ClientProfileDto {
    private UUID id;
    private UUID userId;
    private UUID organizationId;
    private String jobTitle;
    private boolean isPrimary;
}
