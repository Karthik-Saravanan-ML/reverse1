package com.crm.communication.controller;

import com.crm.communication.dto.CallSessionDto;
import com.crm.communication.dto.InitiateCallRequest;
import com.crm.communication.service.CallService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/calls")
@RequiredArgsConstructor
public class CallController {

    private final CallService callService;

    private UUID getUserId(Principal principal) {
        return UUID.fromString(principal.getName());
    }

    @PostMapping
    public ResponseEntity<CallSessionDto> initiateCall(@RequestBody InitiateCallRequest request, Principal principal) {
        return ResponseEntity.ok(callService.initiateCall(request.getProjectId(), getUserId(principal), request.getCallType()));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<CallSessionDto> joinCall(@PathVariable UUID id, Principal principal) {
        return ResponseEntity.ok(callService.joinCall(id, getUserId(principal)));
    }

    @PostMapping("/{id}/end")
    public ResponseEntity<Void> endCall(@PathVariable UUID id, Principal principal) {
        callService.endCall(id, getUserId(principal));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<CallSessionDto>> getCallsForProject(@PathVariable UUID projectId) {
        // Minimal mock implementation
        return ResponseEntity.ok(new ArrayList<>());
    }
}
