package com.crm.meetings.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeetingDto {
    private UUID id;
    private String title;
    private String description;
    private UUID projectId;
    private UUID responsiblePersonId;
    private UUID projectManagerId;
    private Instant scheduledStartAt;
    private Instant scheduledEndAt;
    private String status;
    private List<UUID> participantIds;
    private Instant createdAt;
}
