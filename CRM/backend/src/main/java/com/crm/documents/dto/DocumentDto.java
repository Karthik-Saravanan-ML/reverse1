package com.crm.documents.dto;

import com.crm.common.enums.VisibilityLevel;
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
public class DocumentDto {
    private UUID id;
    private UUID projectId;
    private UUID uploaderId;
    private String originalFileName;
    private String fileType;
    private String mimeType;
    private String fileSize;
    private VisibilityLevel visibility;
    private String processingStatus;
    private Instant createdAt;
}
