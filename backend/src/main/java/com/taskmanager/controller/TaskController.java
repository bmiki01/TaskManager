package com.taskmanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.taskmanager.model.Project;
import com.taskmanager.model.Task;
import com.taskmanager.model.TaskStatus;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.security.services.UserDetailsImpl;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
public class TaskController {
    @Autowired TaskRepository taskRepository;
    @Autowired ProjectRepository projectRepository;

    private boolean isProjectOwner(Project project) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return project.getUser().getId().equals(userDetails.getId());
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(@PathVariable Long projectId) {
        return projectRepository.findById(projectId)
            .filter(this::isProjectOwner)
            .map(p -> ResponseEntity.ok(taskRepository.findByProjectId(projectId)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@PathVariable Long projectId, @RequestBody Task taskReq) {
        return projectRepository.findById(projectId)
            .filter(this::isProjectOwner)
            .map(project -> {
                Task task = new Task();
                task.setTitle(taskReq.getTitle());
                task.setDescription(taskReq.getDescription());
                task.setDueDate(taskReq.getDueDate());
                task.setStatus(taskReq.getStatus() != null ? taskReq.getStatus() : TaskStatus.TODO);
                task.setProject(project);
                return ResponseEntity.ok(taskRepository.save(task));
            }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable Long projectId, @PathVariable Long taskId, @RequestBody Task taskReq) {
        return projectRepository.findById(projectId)
            .filter(this::isProjectOwner)
            .flatMap(p -> taskRepository.findById(taskId))
            .filter(t -> t.getProject().getId().equals(projectId))
            .map(task -> {
                if (taskReq.getTitle() != null) task.setTitle(taskReq.getTitle());
                if (taskReq.getDescription() != null) task.setDescription(taskReq.getDescription());
                if (taskReq.getStatus() != null) task.setStatus(taskReq.getStatus());
                if (taskReq.getDueDate() != null) task.setDueDate(taskReq.getDueDate());
                return ResponseEntity.ok(taskRepository.save(task));
            }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long projectId, @PathVariable Long taskId) {
        return projectRepository.findById(projectId)
            .filter(this::isProjectOwner)
            .flatMap(p -> taskRepository.findById(taskId))
            .filter(t -> t.getProject().getId().equals(projectId))
            .map(task -> {
                taskRepository.delete(task);
                return ResponseEntity.ok().build();
            }).orElse(ResponseEntity.notFound().build());
    }
}
