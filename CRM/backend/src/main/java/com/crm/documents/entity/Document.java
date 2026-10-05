package com.crm.documents.entity;

import com.crm.common.entity.BaseEntity;
import com.crm.common.enums.VisibilityLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name="documents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper=true)
public class Document extends BaseEntity {
    private UUID projectId;
    private UUID uploaderId;
    private String originalFileName;
    private String storageBucket;
    private String storageKey;
    private String fileSize;
    private String fileType;
    private String mimeType;
    private String checksum;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VisibilityLevel visibility = VisibilityLevel.PROJECT_MEMBERS;
    
    @Builder.Default
    private String processingStatus = "PENDING";
}
