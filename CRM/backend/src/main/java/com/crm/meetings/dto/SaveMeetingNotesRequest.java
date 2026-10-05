package com.crm.meetings.dto;

import lombok.Data;

@Data
public class SaveMeetingNotesRequest {
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
}
