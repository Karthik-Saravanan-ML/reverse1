package com.crm.projects.service;

import com.crm.common.enums.UserRole;
import com.crm.projects.dto.*;
import com.crm.projects.entity.*;
import com.crm.projects.repository.*;
import com.crm.users.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepo;
    private final ProjectMembershipRepository membershipRepo;
    private final TeamLeadAssignmentRepository teamLeadRepo;
    private final UserRepository userRepo;

    public Page<ProjectDto> getProjectsForUser(UUID userId, UserRole role, Pageable pageable) {
        if (role == UserRole.ADMIN) {
            return projectRepo.findAll(pageable).map(this::toDto);
        } else if (role == UserRole.PROJECT_MANAGER) {
            return projectRepo.findByManagerId(userId, pageable).map(this::toDto);
        } else {
            return projectRepo.findByMemberId(userId, pageable).map(this::toDto);
        }
    }

    public ProjectDto getProjectById(UUID projectId, UUID userId) {
        checkProjectAccess(projectId, userId);
        return projectRepo.findById(projectId)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public ProjectDto createProject(CreateProjectRequest req, UUID managerId) {
        Project project = new Project();
        project.setName(req.getName());
        project = projectRepo.save(project);
        
        ProjectMembership membership = new ProjectMembership();
        membership.setProjectId(project.getId());
        membership.setUserId(managerId);
        membership.setRole(UserRole.PROJECT_MANAGER);
        membershipRepo.save(membership);
        
        return toDto(project);
    }

    public ProjectDto updateProject(UUID id, CreateProjectRequest req, UUID updaterId) {
        Project project = projectRepo.findById(id).orElseThrow();
        project.setName(req.getName());
        return toDto(projectRepo.save(project));
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void addTeamMember(UUID projectId, UUID userId, UUID addedBy) {
        long activeCount = membershipRepo.countByUserIdAndIsActiveTrue(userId);
        if (activeCount >= 3) {
            throw new RuntimeException("BusinessRuleException: Employee already has 3 active projects");
        }
        ProjectMembership membership = new ProjectMembership();
        membership.setProjectId(projectId);
        membership.setUserId(userId);
        membership.setIsActive(true);
        membershipRepo.save(membership);
    }

    public void removeTeamMember(UUID projectId, UUID userId, UUID removedBy) {
        ProjectMembership membership = membershipRepo.findByProjectIdAndUserId(projectId, userId)
                .orElseThrow();
        membership.setIsActive(false);
        membershipRepo.save(membership);
    }

    public void assignTeamLead(UUID projectId, UUID userId, UUID assignedBy) {
        TeamLeadAssignment assignment = new TeamLeadAssignment();
        assignment.setProjectId(projectId);
        assignment.setUserId(userId);
        teamLeadRepo.save(assignment);
    }

    public List<ProjectMemberDto> getProjectTeam(UUID projectId) {
        return membershipRepo.findByProjectId(projectId).stream()
                .map(m -> new ProjectMemberDto(m.getUserId(), m.getRole()))
                .toList();
    }

    public List<EmployeeWorkloadDto> getEmployeeWorkload() {
        return membershipRepo.getEmployeeWorkload();
    }

    private void checkProjectAccess(UUID projectId, UUID userId) {
        // Implementation for checking if user has access to project
    }

    private ProjectDto toDto(Project p) {
        ProjectDto dto = new ProjectDto();
        dto.setId(p.getId());
        // set other properties
        return dto;
    }
}
