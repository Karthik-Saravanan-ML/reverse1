package com.crm.documents.controller;

import com.crm.common.enums.VisibilityLevel;
import com.crm.documents.dto.DocumentDto;
import com.crm.documents.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/projects/{projectId}/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping("/")
    public Page<DocumentDto> getDocuments(@PathVariable UUID projectId, Pageable pageable) {
        return documentService.getDocuments(projectId, null, pageable);
    }

    @PostMapping("/")
    public DocumentDto uploadDocument(@PathVariable UUID projectId,
                                      @RequestParam MultipartFile file,
                                      @RequestParam VisibilityLevel visibility) {
        return documentService.uploadDocument(projectId, file, visibility, null);
    }

    @GetMapping("/{docId}/download-url")
    public String getDownloadUrl(@PathVariable UUID projectId, @PathVariable UUID docId) {
        return documentService.getDownloadUrl(projectId, docId, null);
    }

    @DeleteMapping("/{docId}")
    public void deleteDocument(@PathVariable UUID projectId, @PathVariable UUID docId) {
        documentService.deleteDocument(docId, null);
    }
}
