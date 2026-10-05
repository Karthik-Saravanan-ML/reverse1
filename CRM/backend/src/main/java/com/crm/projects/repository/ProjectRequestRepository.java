package com.crm.projects.repository;

import com.crm.common.enums.RequestStatus;
import com.crm.projects.entity.ProjectRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProjectRequestRepository extends JpaRepository<ProjectRequest, UUID> {
    Page<ProjectRequest> findByRequesterId(UUID requesterId, Pageable pageable);
    Page<ProjectRequest> findByOrganizationId(UUID organizationId, Pageable pageable);
    Page<ProjectRequest> findByStatus(RequestStatus status, Pageable pageable);
}
