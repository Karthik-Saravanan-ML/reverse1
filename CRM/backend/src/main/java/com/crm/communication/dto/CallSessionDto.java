package com.crm.communication.dto;

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
public class CallSessionDto {
    private UUID id;
    private UUID projectId;
    private UUID initiatorId;
    private String callType;
    private String status;
    private Instant startedAt;
    private Instant endedAt;
}
