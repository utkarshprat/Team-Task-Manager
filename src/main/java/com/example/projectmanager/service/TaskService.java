package com.example.projectmanager.service;

import com.example.projectmanager.entity.Project;
import com.example.projectmanager.entity.Task;
import com.example.projectmanager.entity.User;
import com.example.projectmanager.repository.ProjectRepository;
import com.example.projectmanager.repository.TaskRepository;
import com.example.projectmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public List<Task> getTasksByUserId(Long userId) {
        return taskRepository.findByAssigneeId(userId);
    }

    public Task createTask(Task task, Long projectId, Long assigneeId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        task.setProject(project);

        if (assigneeId != null) {
            User user = userRepository.findById(assigneeId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            task.setAssignee(user);
        }

        return taskRepository.save(task);
    }

    public Task updateTaskStatus(Long taskId, String status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(status);
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
