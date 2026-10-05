package com.crm.meetings.entity;

import com.crm.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="meeting_notes")
@Data
@EqualsAndHashCode(callSuper=true)
public class MeetingNotes extends BaseEntity {
    private UUID meetingId;
    
    @Column(columnDefinition="TEXT")
    private String agenda;
    
    @Column(columnDefinition="TEXT")
    private String summary;
    
    @Column(columnDefinition="TEXT")
    private String requirements;
    
    @Column(columnDefinition="TEXT")
    private String decisions;
    
    @Column(columnDefinition="TEXT")
    private String approvals;
    
    @Column(columnDefinition="TEXT")
    private String questions;
    
    @Column(columnDefinition="TEXT")
    private String actions;
    
    @Column(columnDefinition="TEXT")
    private String risks;
    
    @Column(columnDefinition="TEXT")
    private String issues;
    
    @Column(columnDefinition="TEXT")
    private String followUp;
    
    private boolean submittedForMemory = false;
    private Instant submittedAt;
}
