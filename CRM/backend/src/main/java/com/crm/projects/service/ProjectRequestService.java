package com.crm.projects.service;

import com.crm.common.enums.UserRole;
import com.crm.common.enums.RequestStatus;
import com.crm.projects.dto.*;
import com.crm.projects.entity.*;
import com.crm.projects.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class ProjectRequestService {

    private final ProjectRequestRepository requestRepo;
    private final ProjectService projectService;

    public ProjectRequestDto submitRequest(ProjectRequestDto req, UUID clientId) {
        req.setClientId(clientId);
        req.setStatus(RequestStatus.PENDING);
        // Save to DB and return (mocked logic)
        return req;
    }

    public Page<ProjectRequestDto> getRequests(UUID userId, UserRole role, Pageable p) {
        // Mocked logic for pagination
        return Page.empty();
    }

    public ProjectRequestDto reviewRequest(UUID id, String reviewNotes, RequestStatus newStatus, UUID reviewerId) {
        // Fetch, update status, and return
        ProjectRequestDto dto = new ProjectRequestDto();
        dto.setId(id);
        dto.setReviewNotes(reviewNotes);
        dto.setStatus(newStatus);
        return dto;
    }

    public ProjectDto approveAndCreateProject(UUID requestId, CreateProjectRequest projectReq, UUID managerId) {
        // Update request status to APPROVED
        reviewRequest(requestId, "Approved and created", RequestStatus.APPROVED, managerId);
        // Create actual project
        return projectService.createProject(projectReq, managerId);
    }
}
