package com.crm.memory.controller;

import com.crm.common.enums.MemoryCardType;
import com.crm.common.enums.ReviewStatus;
import com.crm.memory.dto.CreateMemoryCardRequest;
import com.crm.memory.dto.MemoryCardDto;
import com.crm.memory.dto.ReviewCardRequest;
import com.crm.memory.service.MemoryCardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/projects/{projectId}/memory")
@RequiredArgsConstructor
public class MemoryController {

    private final MemoryCardService memoryCardService;

    @GetMapping("/")
    public Page<MemoryCardDto> getCards(@PathVariable UUID projectId,
                                        @RequestParam(required = false) ReviewStatus status,
                                        @RequestParam(required = false) MemoryCardType type,
                                        Pageable pageable) {
        return memoryCardService.getCards(projectId, null, status, type, pageable);
    }

    @PostMapping("/")
    public MemoryCardDto createCard(@PathVariable UUID projectId, @RequestBody CreateMemoryCardRequest req) {
        return memoryCardService.createCard(req, null);
    }

    @GetMapping("/review-queue")
    public Page<MemoryCardDto> getReviewQueue(@PathVariable UUID projectId, Pageable pageable) {
        return memoryCardService.getReviewQueue(projectId, null, pageable);
    }

    @PostMapping("/{cardId}/review")
    public MemoryCardDto reviewCard(@PathVariable UUID projectId, @PathVariable UUID cardId, @RequestBody ReviewCardRequest req) {
        return memoryCardService.reviewCard(cardId, req, null);
    }

    @GetMapping("/{cardId}")
    public MemoryCardDto getCardById(@PathVariable UUID projectId, @PathVariable UUID cardId) {
        return memoryCardService.getCardById(cardId, null);
    }
}
