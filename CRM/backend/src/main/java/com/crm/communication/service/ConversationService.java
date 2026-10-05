package com.crm.communication.service;

import com.crm.communication.entity.Conversation;
import com.crm.communication.entity.ConversationParticipant;
import com.crm.communication.entity.ConversationType;
import com.crm.communication.dto.ConversationDto;
import com.crm.communication.repository.ConversationRepository;
import com.crm.communication.repository.ConversationParticipantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository participantRepository;

    public ConversationDto getOrCreateProjectConversation(UUID projectId) {
        log.info("Fetching or creating project conversation for project: {}", projectId);
        Optional<Conversation> existing = conversationRepository.findByProjectIdAndType(projectId, ConversationType.PROJECT_GROUP);
        if (existing.isPresent()) {
            return toDto(existing.get());
        }

        Conversation newConv = Conversation.builder()
                .projectId(projectId)
                .type(ConversationType.PROJECT_GROUP)
                .title("Project Chat: " + projectId)
                .build();
        newConv = conversationRepository.save(newConv);
        return toDto(newConv);
    }

    public List<ConversationDto> getUserConversations(UUID userId) {
        log.debug("Getting conversations for user: {}", userId);
        return participantRepository.findByUserId(userId).stream()
                .map(ConversationParticipant::getConversation)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ConversationDto createDirectConversation(UUID userId1, UUID userId2) {
        // Simple logic for direct conv
        Conversation conv = Conversation.builder()
                .type(ConversationType.DIRECT)
                .title("Direct: " + userId1 + " - " + userId2)
                .build();
        conv = conversationRepository.save(conv);

        ConversationParticipant p1 = ConversationParticipant.builder().conversation(conv).userId(userId1).build();
        ConversationParticipant p2 = ConversationParticipant.builder().conversation(conv).userId(userId2).build();
        participantRepository.saveAll(List.of(p1, p2));

        return toDto(conv);
    }

    public boolean isConversationMember(UUID conversationId, UUID userId) {
        return participantRepository.existsByConversationIdAndUserId(conversationId, userId);
    }

    private ConversationDto toDto(Conversation c) {
        return ConversationDto.builder()
                .id(c.getId())
                .projectId(c.getProjectId())
                .type(c.getType().name())
                .title(c.getTitle())
                .build();
    }
}
