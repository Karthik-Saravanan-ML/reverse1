package com.crm.projects.repository;

import com.crm.common.enums.ProjectStatus;
import com.crm.projects.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    Page<Project> findByManagerId(UUID managerId, Pageable pageable);
    Page<Project> findByOrganizationId(UUID organizationId, Pageable pageable);
    Page<Project> findByStatus(ProjectStatus status, Pageable pageable);
    
    @Query("SELECT p FROM Project p JOIN ProjectMembership pm ON p.id = pm.projectId WHERE pm.userId = :userId AND pm.isActive = true")
    Page<Project> findByMemberUserId(UUID userId, Pageable pageable);
}
