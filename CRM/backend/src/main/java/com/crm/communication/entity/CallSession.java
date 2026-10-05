package com.crm.communication.entity;

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

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "call_sessions")
public class CallSession extends BaseEntity {

    private UUID projectId;
    
    private UUID initiatorId;
    
    private String callType;
    
    @Builder.Default
    private String status = "INITIATED";
    
    private Instant startedAt;
    
    private Instant endedAt;
}
