package com.crm.projects.repository;

import com.crm.projects.entity.TeamLeadAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeamLeadAssignmentRepository extends JpaRepository<TeamLeadAssignment, UUID> {
    List<TeamLeadAssignment> findByProjectIdAndIsActiveTrue(UUID projectId);
    Optional<TeamLeadAssignment> findByProjectIdAndEmployeeIdAndIsActiveTrue(UUID projectId, UUID employeeId);
}
