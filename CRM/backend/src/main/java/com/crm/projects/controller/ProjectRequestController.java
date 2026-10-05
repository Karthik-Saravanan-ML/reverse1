package com.crm.projects.controller;

import com.crm.common.enums.UserRole;
import com.crm.common.enums.RequestStatus;
import com.crm.projects.dto.*;
import com.crm.projects.service.ProjectRequestService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.UUID;

@RestController
@RequestMapping("/api/project-requests")
@RequiredArgsConstructor
public class ProjectRequestController {

    private final ProjectRequestService projectRequestService;

    @PostMapping("/")
    @PreAuthorize("hasRole('CLIENT')")
    public ProjectRequestDto submitRequest(@RequestBody ProjectRequestDto req, @AuthenticationPrincipal UUID clientId) {
        return projectRequestService.submitRequest(req, clientId);
    }

    @GetMapping("/")
    public Page<ProjectRequestDto> getRequests(@AuthenticationPrincipal UUID userId, @AuthenticationPrincipal UserRole role, Pageable p) {
        return projectRequestService.getRequests(userId, role, p);
    }

    @PostMapping("/{id}/review")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ProjectRequestDto reviewRequest(@PathVariable UUID id, @RequestBody ReviewRequestDto req, @AuthenticationPrincipal UUID reviewerId) {
        return projectRequestService.reviewRequest(id, req.getReviewNotes(), req.getNewStatus(), reviewerId);
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ProjectDto approveAndCreateProject(@PathVariable UUID id, @RequestBody CreateProjectRequest projectReq, @AuthenticationPrincipal UUID managerId) {
        return projectRequestService.approveAndCreateProject(id, projectReq, managerId);
    }
}

class ReviewRequestDto {
    private String reviewNotes;
    private RequestStatus newStatus;
    public String getReviewNotes() { return reviewNotes; }
    public void setReviewNotes(String reviewNotes) { this.reviewNotes = reviewNotes; }
    public RequestStatus getNewStatus() { return newStatus; }
    public void setNewStatus(RequestStatus newStatus) { this.newStatus = newStatus; }
}
