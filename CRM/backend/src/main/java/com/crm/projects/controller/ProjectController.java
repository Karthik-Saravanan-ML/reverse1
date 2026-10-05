package com.crm.projects.controller;

import com.crm.common.enums.UserRole;
import com.crm.projects.dto.*;
import com.crm.projects.service.ProjectService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping("/")
    public Page<ProjectDto> getProjectsForUser(@AuthenticationPrincipal UUID userId, @AuthenticationPrincipal UserRole role, Pageable pageable) {
        return projectService.getProjectsForUser(userId, role, pageable);
    }

    @GetMapping("/{id}")
    public ProjectDto getProjectById(@PathVariable UUID id, @AuthenticationPrincipal UUID userId) {
        return projectService.getProjectById(id, userId);
    }

    @PostMapping("/")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ProjectDto createProject(@RequestBody CreateProjectRequest req, @AuthenticationPrincipal UUID managerId) {
        return projectService.createProject(req, managerId);
    }

    @PutMapping("/{id}")
    public ProjectDto updateProject(@PathVariable UUID id, @RequestBody CreateProjectRequest req, @AuthenticationPrincipal UUID updaterId) {
        return projectService.updateProject(id, req, updaterId);
    }

    @GetMapping("/{id}/team")
    public List<ProjectMemberDto> getProjectTeam(@PathVariable UUID id) {
        return projectService.getProjectTeam(id);
    }

    @PostMapping("/{id}/team")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public void addTeamMember(@PathVariable UUID id, @RequestBody AddTeamMemberRequest req, @AuthenticationPrincipal UUID addedBy) {
        projectService.addTeamMember(id, req.getUserId(), addedBy);
    }

    @DeleteMapping("/{id}/team/{userId}")
    public void removeTeamMember(@PathVariable UUID id, @PathVariable UUID userId, @AuthenticationPrincipal UUID removedBy) {
        projectService.removeTeamMember(id, userId, removedBy);
    }

    @PostMapping("/{id}/team-lead")
    public void assignTeamLead(@PathVariable UUID id, @RequestBody AssignTeamLeadRequest req, @AuthenticationPrincipal UUID assignedBy) {
        projectService.assignTeamLead(id, req.getUserId(), assignedBy);
    }

    @GetMapping("/workload")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public List<EmployeeWorkloadDto> getEmployeeWorkload() {
        return projectService.getEmployeeWorkload();
    }
}

class AddTeamMemberRequest {
    private UUID userId;
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
}

class AssignTeamLeadRequest {
    private UUID userId;
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
}
