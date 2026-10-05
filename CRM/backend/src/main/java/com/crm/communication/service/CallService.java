package com.crm.communication.service;

import com.crm.communication.dto.CallSessionDto;
import com.crm.communication.entity.CallParticipant;
import com.crm.communication.entity.CallSession;
import com.crm.communication.repository.CallParticipantRepository;
import com.crm.communication.repository.CallSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CallService {

    private final CallSessionRepository callSessionRepository;
    private final CallParticipantRepository callParticipantRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public CallSessionDto initiateCall(UUID projectId, UUID initiatorId, String callType) {
        CallSession session = CallSession.builder()
                .projectId(projectId)
                .initiatorId(initiatorId)
                .type(callType)
                .status("ACTIVE")
                .startedAt(Instant.now())
                .build();
        session = callSessionRepository.save(session);

        CallParticipant participant = CallParticipant.builder()
                .sessionId(session.getId())
                .userId(initiatorId)
                .joinedAt(Instant.now())
                .build();
        callParticipantRepository.save(participant);

        CallSessionDto dto = toDto(session);
        messagingTemplate.convertAndSend("/topic/projects/" + projectId + "/calls", dto);
        return dto;
    }

    public CallSessionDto joinCall(UUID sessionId, UUID userId) {
        CallSession session = callSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
                
        if ("ENDED".equals(session.getStatus())) {
            throw new RuntimeException("Cannot join an ended call");
        }

        CallParticipant participant = CallParticipant.builder()
                .sessionId(sessionId)
                .userId(userId)
                .joinedAt(Instant.now())
                .build();
        callParticipantRepository.save(participant);

        CallSessionDto dto = toDto(session);
        messagingTemplate.convertAndSend("/topic/calls/" + sessionId, dto);
        return dto;
    }

    public void endCall(UUID sessionId, UUID userId) {
        CallSession session = callSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
                
        // Simplified authorization: normally check if user can end it
        session.setStatus("ENDED");
        session.setEndedAt(Instant.now());
        callSessionRepository.save(session);

        messagingTemplate.convertAndSend("/topic/calls/" + sessionId, toDto(session));
    }

    private CallSessionDto toDto(CallSession c) {
        return CallSessionDto.builder()
                .id(c.getId())
                .projectId(c.getProjectId())
                .initiatorId(c.getInitiatorId())
                .type(c.getType())
                .status(c.getStatus())
                .build();
    }
}
