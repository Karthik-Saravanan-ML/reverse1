package com.crm.communication.controller;

import com.crm.communication.dto.ConversationDto;
import com.crm.communication.dto.MessageDto;
import com.crm.communication.dto.SendMessageRequest;
import com.crm.communication.service.ConversationService;
import com.crm.communication.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;
    private final MessageService messageService;

    private UUID extractUserId(Principal principal) {
        // Mock implementation. Replace with actual principal extraction.
        return UUID.fromString(principal.getName());
    }

    @GetMapping
    public ResponseEntity<List<ConversationDto>> getUserConversations(Principal principal) {
        return ResponseEntity.ok(conversationService.getUserConversations(extractUserId(principal)));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<ConversationDto> getOrCreateProjectConversation(@PathVariable UUID projectId) {
        return ResponseEntity.ok(conversationService.getOrCreateProjectConversation(projectId));
    }

    @PostMapping("/direct")
    public ResponseEntity<ConversationDto> createDirectConversation(
            @RequestParam UUID targetUserId, 
            Principal principal) {
        return ResponseEntity.ok(conversationService.createDirectConversation(extractUserId(principal), targetUserId));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<Page<MessageDto>> getMessages(
            @PathVariable UUID id, 
            Pageable pageable, 
            Principal principal) {
        return ResponseEntity.ok(messageService.getMessages(id, extractUserId(principal), pageable));
    }

    @PostMapping("/messages")
    public ResponseEntity<MessageDto> sendMessage(@RequestBody SendMessageRequest request, Principal principal) {
        return ResponseEntity.ok(messageService.sendMessage(request, extractUserId(principal)));
    }
}
