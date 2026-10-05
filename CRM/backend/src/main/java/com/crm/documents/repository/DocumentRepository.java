package com.crm.documents.repository;

import com.crm.documents.entity.Document;
import com.crm.common.enums.VisibilityLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DocumentRepository extends JpaRepository<Document, UUID> {
    Page<Document> findByProjectId(UUID projectId, Pageable pageable);
    Page<Document> findByProjectIdAndVisibilityIn(UUID projectId, List<VisibilityLevel> visibilities, Pageable pageable);
    Optional<Document> findByIdAndProjectId(UUID id, UUID projectId);
}
