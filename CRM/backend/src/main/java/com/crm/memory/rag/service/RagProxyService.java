package com.crm.memory.rag.service;

import com.crm.common.enums.UserRole;
import com.crm.memory.rag.dto.AskQuestionRequest;
import com.crm.memory.rag.dto.RagAnswerDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RagProxyService {

    private final RestTemplate restTemplate;

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    @Value("${ai.service.internal-key}")
    private String internalKey;

    public RagAnswerDto askQuestion(AskQuestionRequest req, UUID userId, UserRole role) {
        return null;
    }
}
