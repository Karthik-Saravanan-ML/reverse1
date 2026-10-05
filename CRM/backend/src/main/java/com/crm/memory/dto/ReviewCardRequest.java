package com.crm.memory.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReviewCardRequest {
    @NotBlank
    private String action; // APPROVE, EDIT, REJECT
    
    private String editedTitle;
    private String editedContent;
    private String reviewNotes;
}
