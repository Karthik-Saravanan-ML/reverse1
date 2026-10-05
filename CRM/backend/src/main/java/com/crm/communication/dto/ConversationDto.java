package com.crm.communication.dto;

import com.crm.communication.entity.ConversationType;
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
public class ConversationDto {
    private UUID id;
    private ConversationType type;
    private UUID projectId;
    private String name;
    private String lastMessageContent;
    private Instant lastMessageAt;
    private int memberCount;
}
