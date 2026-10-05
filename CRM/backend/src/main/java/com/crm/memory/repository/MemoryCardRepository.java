package com.crm.memory.repository;

import com.crm.memory.entity.MemoryCard;
import com.crm.common.enums.MemoryCardType;
import com.crm.common.enums.ReviewStatus;
import com.crm.common.enums.VisibilityLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MemoryCardRepository extends JpaRepository<MemoryCard, UUID> {
    Page<MemoryCard> findByProjectId(UUID projectId, Pageable pageable);
    Page<MemoryCard> findByProjectIdAndReviewStatus(UUID projectId, ReviewStatus reviewStatus, Pageable pageable);
    Page<MemoryCard> findByProjectIdAndType(UUID projectId, MemoryCardType type, Pageable pageable);
    Page<MemoryCard> findByProjectIdAndVisibilityIn(UUID projectId, List<VisibilityLevel> visibilities, Pageable pageable);
    Page<MemoryCard> findByProjectIdAndReviewStatusAndVisibilityIn(UUID projectId, ReviewStatus status, List<VisibilityLevel> visibilities, Pageable pageable);
}
