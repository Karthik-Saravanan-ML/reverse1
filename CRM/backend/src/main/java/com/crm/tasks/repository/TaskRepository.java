package com.crm.tasks.repository;

import com.crm.tasks.entity.Task;
import com.crm.tasks.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    Page<Task> findByProjectId(UUID projectId, Pageable pageable);
    Page<Task> findByAssigneeId(UUID assigneeId, Pageable pageable);
    List<Task> findByProjectIdAndStatus(UUID projectId, TaskStatus status);
    long countByProjectId(UUID projectId);
}
