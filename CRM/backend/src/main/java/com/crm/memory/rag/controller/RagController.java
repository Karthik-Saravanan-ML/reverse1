package com.crm.memory.rag.controller;

import com.crm.memory.rag.dto.AskQuestionRequest;
import com.crm.memory.rag.dto.RagAnswerDto;
import com.crm.memory.rag.service.RagProxyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rag")
@RequiredArgsConstructor
public class RagController {

    private final RagProxyService ragProxyService;

    @PostMapping("/ask")
    public ResponseEntity<RagAnswerDto> askQuestion(@RequestBody AskQuestionRequest req) {
        return ResponseEntity.ok(ragProxyService.askQuestion(req, null, null));
    }
}
