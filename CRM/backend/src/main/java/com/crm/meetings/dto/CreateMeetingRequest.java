package com.crm.meetings.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
public class CreateMeetingRequest {
    @NotBlank
    private String title;
    
    private String description;
    
    @NotNull
    private UUID projectId;
    
    @NotNull
    private UUID responsiblePersonId;
    
    private UUID projectManagerId;
    private Instant scheduledStartAt;
    private Instant scheduledEndAt;
    private List<UUID> participantIds;
}
