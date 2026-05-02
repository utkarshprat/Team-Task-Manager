-- Database Schema and Sample Data
-- Note: Spring Boot (Hibernate) is configured with ddl-auto=update, so tables are created automatically. 
-- You only need to create the database initially:
CREATE DATABASE IF NOT EXISTS project_manager;
USE project_manager;

-- =======================================================
-- SCHEMA (For Reference)
-- =======================================================
/*
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20)
);

CREATE TABLE projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    due_date DATE,
    project_id BIGINT NOT NULL,
    assignee_id BIGINT,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (assignee_id) REFERENCES users(id)
);
*/

-- =======================================================
-- SAMPLE DATA
-- Run these inserts ONLY AFTER starting the application 
-- once so Hibernate creates the tables.
-- =======================================================

-- Passwords are encoded using BCrypt. Both passwords below are 'password123'
INSERT INTO users (username, email, password, role) VALUES 
('admin_user', 'admin@example.com', '$2a$10$wN2L0wDk8hMv0pBq.5W3H.H6k1G8oZ0o6.9U5lH8xX3u6j6x0oWjW', 'ROLE_ADMIN'),
('member_user', 'member@example.com', '$2a$10$wN2L0wDk8hMv0pBq.5W3H.H6k1G8oZ0o6.9U5lH8xX3u6j6x0oWjW', 'ROLE_MEMBER');

INSERT INTO projects (name, description, created_at) VALUES 
('Website Redesign', 'Complete overhaul of the company homepage', NOW()),
('Mobile App Launch', 'Develop and launch the Android application', NOW());

INSERT INTO tasks (title, description, status, due_date, project_id, assignee_id) VALUES 
('Design Mockups', 'Create Figma mockups for the homepage', 'COMPLETED', '2024-12-01', 1, 2),
('Frontend Integration', 'Convert mockups to HTML/CSS', 'IN_PROGRESS', '2024-12-15', 1, 2),
('Backend API', 'Create REST endpoints', 'PENDING', '2024-12-20', 1, 1),
('Setup CI/CD', 'Configure GitHub Actions', 'PENDING', '2024-12-10', 2, 1);
