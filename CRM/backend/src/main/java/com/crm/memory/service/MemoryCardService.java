package com.crm.memory.service;

import com.crm.common.enums.MemoryCardType;
import com.crm.common.enums.ReviewStatus;
import com.crm.memory.dto.CreateMemoryCardRequest;
import com.crm.memory.dto.MemoryCardDto;
import com.crm.memory.dto.ReviewCardRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class MemoryCardService {

    public MemoryCardDto createCard(CreateMemoryCardRequest req, UUID creatorId) {
        return null;
    }

    public Page<MemoryCardDto> getCards(UUID projectId, UUID requesterId, ReviewStatus status, MemoryCardType type, Pageable p) {
        return Page.empty();
    }

    public Page<MemoryCardDto> getReviewQueue(UUID projectId, UUID requesterId, Pageable p) {
        return Page.empty();
    }

    public MemoryCardDto reviewCard(UUID cardId, ReviewCardRequest req, UUID reviewerId) {
        return null;
    }

    public MemoryCardDto getCardById(UUID cardId, UUID requesterId) {
        return null;
    }
}
