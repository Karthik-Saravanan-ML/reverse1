package com.crm.communication.websocket;

import com.crm.communication.dto.SendMessageRequest;
import com.crm.communication.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload SendMessageRequest request, Principal principal) {
        log.debug("Received chat.send via WS");
        UUID senderId = UUID.fromString(principal.getName());
        messageService.sendMessage(request, senderId);
    }

    @MessageMapping("/chat.typing")
    public void typingSignal(@Payload Map<String, String> payload, Principal principal) {
        String conversationId = payload.get("conversationId");
        String userId = principal.getName();
        
        messagingTemplate.convertAndSend(
                "/topic/conversations/" + conversationId + "/typing",
                Map.of("userId", userId, "conversationId", conversationId)
        );
    }

    @MessageMapping("/call.signal")
    public void relaySignal(@Payload Map<String, Object> payload, Principal principal) {
        String sessionId = (String) payload.get("sessionId");
        payload.put("fromUser", principal.getName());
        messagingTemplate.convertAndSend("/topic/calls/" + sessionId + "/signal", payload);
    }

    @MessageMapping("/call.join")
    public void callJoin(@Payload Map<String, String> payload, Principal principal) {
        String sessionId = payload.get("sessionId");
        messagingTemplate.convertAndSend(
                "/topic/calls/" + sessionId,
                Map.of("event", "JOIN", "userId", principal.getName())
        );
    }

    @MessageMapping("/call.leave")
    public void callLeave(@Payload Map<String, String> payload, Principal principal) {
        String sessionId = payload.get("sessionId");
        messagingTemplate.convertAndSend(
                "/topic/calls/" + sessionId,
                Map.of("event", "LEAVE", "userId", principal.getName())
        );
    }
}
