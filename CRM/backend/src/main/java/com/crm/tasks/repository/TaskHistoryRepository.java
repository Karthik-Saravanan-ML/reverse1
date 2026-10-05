package com.crm.tasks.repository;

import com.crm.tasks.entity.TaskHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface TaskHistoryRepository extends JpaRepository<TaskHistory, UUID> {
}
