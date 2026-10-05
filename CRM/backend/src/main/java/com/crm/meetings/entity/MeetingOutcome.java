package com.crm.meetings.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name="meeting_outcomes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeetingOutcome {
    @Id
    @GeneratedValue
    private UUID id;
    
    private UUID meetingId;
    private UUID memoryCardId;
    private String outcomeType;
    private String description;
}
