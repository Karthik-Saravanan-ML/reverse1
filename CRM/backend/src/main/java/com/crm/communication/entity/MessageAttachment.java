package com.crm.communication.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "message_attachments")
public class MessageAttachment {

    @Id
    private UUID id;
    
    private UUID messageId;
    
    private String fileName;
    
    private Long fileSize;
    
    private String mimeType;
    
    private String storageKey;
}
