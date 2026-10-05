package com.crm.communication.repository;
import com.crm.communication.entity.CallParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
public interface CallParticipantRepository extends JpaRepository<CallParticipant, UUID> {
    List<CallParticipant> findBySessionId(UUID sessionId);
}
