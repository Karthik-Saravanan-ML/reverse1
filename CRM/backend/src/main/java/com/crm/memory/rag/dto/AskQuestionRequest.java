package com.crm.memory.rag.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class AskQuestionRequest {
    @NotBlank
    private String question;
    
    @NotNull
    private UUID projectId;
    
    private Integer topK = 5;
}
