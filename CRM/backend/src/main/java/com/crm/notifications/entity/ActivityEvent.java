package com.crm.notifications.entity;

import com.crm.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name="activity_events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper=true)
public class ActivityEvent extends BaseEntity {
    private UUID projectId;
    private UUID userId;
    private String eventType;
    private String entityType;
    private UUID entityId;
    private String description;
    
    @Column(columnDefinition="TEXT")
    private String metadata;
}
