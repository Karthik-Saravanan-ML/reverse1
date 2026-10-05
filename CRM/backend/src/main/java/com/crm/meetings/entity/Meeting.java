package com.crm.meetings.entity;

import com.crm.common.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="meetings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper=true)
public class Meeting extends BaseEntity {
    private String title;
    private String description;
    private UUID projectId;
    private UUID responsiblePersonId;
    private UUID projectManagerId;
    private Instant scheduledStartAt;
    private Instant scheduledEndAt;
    
    @Builder.Default
    private String status = "SCHEDULED";
}
