package com.crm.memory.repository;

import com.crm.memory.entity.SourceRecord;
import com.crm.common.enums.SourceType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SourceRecordRepository extends JpaRepository<SourceRecord, UUID> {
    List<SourceRecord> findByProjectIdAndSourceType(UUID projectId, SourceType sourceType);
    Optional<SourceRecord> findByProjectIdAndEntityId(UUID projectId, UUID entityId);
}
