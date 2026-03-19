package com.taskmanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.taskmanager.model.Project;
import com.taskmanager.model.User;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.security.services.UserDetailsImpl;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    @Autowired ProjectRepository projectRepository;
    @Autowired UserRepository userRepository;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow();
    }

    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findByUserId(getCurrentUser().getId());
    }

    @PostMapping
    public Project createProject(@RequestBody Project projectReq) {
        Project project = new Project();
        project.setName(projectReq.getName());
        project.setDescription(projectReq.getDescription());
        project.setUser(getCurrentUser());
        return projectRepository.save(project);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
            .filter(p -> p.getUser().getId().equals(getCurrentUser().getId()))
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        return projectRepository.findById(id)
            .filter(p -> p.getUser().getId().equals(getCurrentUser().getId()))
            .map(p -> {
                projectRepository.delete(p);
                return ResponseEntity.ok().build();
            }).orElse(ResponseEntity.notFound().build());
    }
}
