package com.crm.projects.repository;

import com.crm.projects.entity.ProjectMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectMembershipRepository extends JpaRepository<ProjectMembership, UUID> {
    List<ProjectMembership> findByProjectIdAndIsActiveTrue(UUID projectId);
    List<ProjectMembership> findByUserIdAndIsActiveTrue(UUID userId);
    Optional<ProjectMembership> findByProjectIdAndUserIdAndIsActiveTrue(UUID projectId, UUID userId);
    long countByUserIdAndIsActiveTrue(UUID userId);
    boolean existsByProjectIdAndUserIdAndIsActiveTrue(UUID projectId, UUID userId);
}
