package com.crm.tasks.controller;

import com.crm.tasks.dto.CreateTaskRequest;
import com.crm.tasks.dto.TaskDto;
import com.crm.tasks.dto.TaskStatusUpdateRequest;
import com.crm.tasks.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/projects/{projectId}/tasks")
    public Page<TaskDto> getTasksForProject(@PathVariable UUID projectId, Pageable pageable) {
        UUID requesterId = UUID.randomUUID(); // Dummy requester ID for now
        return taskService.getTasksForProject(projectId, requesterId, pageable);
    }

    @PostMapping("/projects/{projectId}/tasks")
    public TaskDto createTask(@PathVariable UUID projectId, @RequestBody CreateTaskRequest req) {
        req.setProjectId(projectId);
        UUID creatorId = UUID.randomUUID(); // Dummy creator ID for now
        return taskService.createTask(req, creatorId);
    }

    @PutMapping("/projects/{projectId}/tasks/{taskId}")
    public TaskDto updateTask(@PathVariable UUID projectId, @PathVariable UUID taskId, @RequestBody CreateTaskRequest req) {
        req.setProjectId(projectId);
        UUID updaterId = UUID.randomUUID(); // Dummy updater ID for now
        return taskService.updateTask(taskId, req, updaterId);
    }

    @PatchMapping("/projects/{projectId}/tasks/{taskId}/status")
    public TaskDto updateStatus(@PathVariable UUID projectId, @PathVariable UUID taskId, @RequestBody TaskStatusUpdateRequest req) {
        UUID userId = UUID.randomUUID(); // Dummy user ID for now
        return taskService.updateStatus(projectId, taskId, req, userId);
    }

    @DeleteMapping("/projects/{projectId}/tasks/{taskId}")
    public void deleteTask(@PathVariable UUID projectId, @PathVariable UUID taskId) {
        UUID requesterId = UUID.randomUUID(); // Dummy requester ID for now
        taskService.deleteTask(taskId, requesterId);
    }

    @GetMapping("/tasks/my")
    public Page<TaskDto> getMyTasks(Pageable pageable) {
        UUID userId = UUID.randomUUID(); // Dummy user ID for now
        return taskService.getMyTasks(userId, pageable);
    }
}
