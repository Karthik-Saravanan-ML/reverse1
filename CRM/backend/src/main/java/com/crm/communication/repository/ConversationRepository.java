package com.crm.communication.repository;

import com.crm.communication.entity.Conversation;
import com.crm.communication.entity.ConversationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    
    @Query("SELECT DISTINCT c FROM Conversation c JOIN ConversationMember cm ON c.id = cm.conversationId WHERE cm.userId = :userId AND cm.isActive = true AND c.isActive = true")
    List<Conversation> findByMemberId(@Param("userId") UUID userId);
    
    Optional<Conversation> findByProjectIdAndType(UUID projectId, ConversationType type);
}
