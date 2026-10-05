package com.crm.documents.service;

import com.crm.common.enums.VisibilityLevel;
import com.crm.documents.dto.DocumentDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@Transactional
public class DocumentService {

    public DocumentDto uploadDocument(UUID projectId, MultipartFile file, VisibilityLevel visibility, UUID uploaderId) {
        return null;
    }

    public Page<DocumentDto> getDocuments(UUID projectId, UUID requesterId, Pageable pageable) {
        return Page.empty();
    }

    public String getDownloadUrl(UUID projectId, UUID docId, UUID requesterId) {
        return "";
    }

    public void deleteDocument(UUID docId, UUID requesterId) {
    }
}
