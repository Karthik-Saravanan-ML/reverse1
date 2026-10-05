package com.crm.communication.entity;

import com.crm.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "messages")
public class Message extends BaseEntity {

    private UUID conversationId;
    
    private UUID senderId;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Builder.Default
    private boolean isEdited = false;
    
    private Instant editedAt;
    
    @Builder.Default
    private boolean isDeleted = false;
}
