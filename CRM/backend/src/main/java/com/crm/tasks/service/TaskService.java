package com.crm.tasks.service;

import com.crm.tasks.dto.*;
import com.crm.tasks.entity.Task;
import com.crm.tasks.entity.TaskHistory;
import com.crm.tasks.enums.TaskStatus;
import com.crm.tasks.repository.TaskHistoryRepository;
import com.crm.tasks.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskHistoryRepository taskHistoryRepository;
    
    private TaskDto mapToDto(Task task) {
        return TaskDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .projectId(task.getProjectId())
                .assigneeId(task.getAssigneeId())
                .assignerId(task.getAssignerId())
                .priority(task.getPriority())
                .status(task.getStatus())
                .startDate(task.getStartDate())
                .dueDate(task.getDueDate())
                .completionDate(task.getCompletionDate())
                .progressPercentage(task.getProgressPercentage())
                .progressNotes(task.getProgressNotes())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    public TaskDto createTask(CreateTaskRequest req, UUID creatorId) {
        Task task = Task.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .projectId(req.getProjectId())
                .assigneeId(req.getAssigneeId())
                .assignerId(creatorId)
                .priority(req.getPriority())
                .startDate(req.getStartDate())
                .dueDate(req.getDueDate())
                .status(TaskStatus.TODO)
                .build();
                
        task.setCreatedBy(creatorId);
        task.setCreatedAt(Instant.now());
        
        return mapToDto(taskRepository.save(task));
    }

    public Page<TaskDto> getTasksForProject(UUID projectId, UUID requesterId, Pageable p) {
        return taskRepository.findByProjectId(projectId, p).map(this::mapToDto);
    }

    public Page<TaskDto> getMyTasks(UUID userId, Pageable p) {
        return taskRepository.findByAssigneeId(userId, p).map(this::mapToDto);
    }

    public TaskDto updateTask(UUID taskId, CreateTaskRequest req, UUID updaterId) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        task.setAssigneeId(req.getAssigneeId());
        task.setPriority(req.getPriority());
        task.setStartDate(req.getStartDate());
        task.setDueDate(req.getDueDate());
        task.setUpdatedBy(updaterId);
        task.setUpdatedAt(Instant.now());
        return mapToDto(taskRepository.save(task));
    }

    public TaskDto updateStatus(UUID projectId, UUID taskId, TaskStatusUpdateRequest req, UUID userId) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));
        
        String oldStatus = task.getStatus().name();
        
        task.setStatus(req.getStatus());
        task.setProgressPercentage(req.getProgressPercentage());
        task.setProgressNotes(req.getProgressNotes());
        
        if (req.getStatus() == TaskStatus.COMPLETED) {
            task.setCompletionDate(LocalDate.now());
        }
        
        task.setUpdatedBy(userId);
        task.setUpdatedAt(Instant.now());
        
        Task savedTask = taskRepository.save(task);
        
        TaskHistory history = TaskHistory.builder()
                .taskId(taskId)
                .changedBy(userId)
                .fieldChanged("status")
                .oldValue(oldStatus)
                .newValue(req.getStatus().name())
                .changedAt(Instant.now())
                .build();
        taskHistoryRepository.save(history);
        
        return mapToDto(savedTask);
    }

    public void deleteTask(UUID taskId, UUID requesterId) {
        taskRepository.deleteById(taskId);
    }
}
