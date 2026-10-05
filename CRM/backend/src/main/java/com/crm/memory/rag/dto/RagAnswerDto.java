package com.crm.memory.rag.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RagAnswerDto {
    private String answer;
    private List<SourceDto> sources;
    private UUID projectId;
    private String question;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SourceDto {
        private String sourceReference;
        private String documentTitle;
        private String chunkContent;
        private Double score;
    }
}
