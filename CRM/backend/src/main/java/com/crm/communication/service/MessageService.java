package com.crm.communication.service;

import com.crm.communication.dto.MessageDto;
import com.crm.communication.dto.SendMessageRequest;
import com.crm.communication.entity.Message;
import com.crm.communication.repository.MessageRepository;
import com.crm.communication.repository.ConversationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final ConversationService conversationService;
    private final SimpMessagingTemplate messagingTemplate;

    public Page<MessageDto> getMessages(UUID conversationId, UUID requesterId, Pageable p) {
        if (!conversationService.isConversationMember(conversationId, requesterId)) {
            throw new RuntimeException("User is not a member of this conversation.");
        }
        return messageRepository.findByConversationIdOrderByCreatedAtDesc(conversationId, p)
                .map(this::toDto);
    }

    public MessageDto sendMessage(SendMessageRequest req, UUID senderId) {
        if (!conversationService.isConversationMember(req.getConversationId(), senderId)) {
            throw new RuntimeException("Sender is not a member of the conversation.");
        }

        Message message = Message.builder()
                .conversationId(req.getConversationId())
                .senderId(senderId)
                .content(req.getContent())
                .build();
        message = messageRepository.save(message);

        MessageDto dto = toDto(message);
        
        log.info("Broadcasting message to conversation: {}", req.getConversationId());
        messagingTemplate.convertAndSend("/topic/conversations/" + req.getConversationId(), dto);
        
        return dto;
    }

    public void deleteMessage(UUID messageId, UUID requesterId) {
        Message msg = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        if (!msg.getSenderId().equals(requesterId)) {
            throw new RuntimeException("Not authorized to delete this message");
        }
        
        messageRepository.delete(msg);
    }

    private MessageDto toDto(Message m) {
        return MessageDto.builder()
                .id(m.getId())
                .conversationId(m.getConversationId())
                .senderId(m.getSenderId())
                .content(m.getContent())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
