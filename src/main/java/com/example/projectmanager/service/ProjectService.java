package com.example.projectmanager.service;

import com.example.projectmanager.entity.Project;
import com.example.projectmanager.entity.Task;
import com.example.projectmanager.repository.ProjectRepository;
import com.example.projectmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        List<Task> tasks = taskRepository.findByProjectId(id);
        taskRepository.deleteAll(tasks);
        projectRepository.deleteById(id);
    }
}
