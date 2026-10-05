package com.crm.meetings.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeetingNotesDto {
    private UUID id;
    private UUID meetingId;
    private String agenda;
    private String summary;
    private String requirements;
    private String decisions;
    private String approvals;
    private String questions;
    private String actions;
    private String risks;
    private String issues;
    private String followUp;
    private boolean submittedForMemory;
    private Instant submittedAt;
}
