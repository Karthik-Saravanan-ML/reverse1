package com.crm.memory.dto;

import com.crm.common.enums.MemoryCardType;
import com.crm.common.enums.VisibilityLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class CreateMemoryCardRequest {
    @NotNull
    private UUID projectId;
    
    @NotNull
    private MemoryCardType type;
    
    @NotBlank
    private String title;
    
    @NotBlank
    private String content;
    
    private String sourceReference;
    private LocalDate eventDate;
    
    private VisibilityLevel visibility = VisibilityLevel.PROJECT_MEMBERS;
    private Double confidence = 1.0;
}
