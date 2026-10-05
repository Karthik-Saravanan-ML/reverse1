package com.crm.communication.repository;

import com.crm.communication.entity.CallSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CallSessionRepository extends JpaRepository<CallSession, UUID> {
    List<CallSession> findByProjectIdOrderByStartedAtDesc(UUID projectId);
    Optional<CallSession> findByIdAndStatus(UUID id, String status);
}
