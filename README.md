# Project Manager Application

A modern, full-stack Project Management application built with **Java 8, Spring Boot 2.7**, and **Vanilla JavaScript**. This application provides a comprehensive solution for managing projects, assigning tasks, and tracking progress with role-based access control.

## 🚀 Features

*   **Secure Authentication:** JWT (JSON Web Token) based login and registration system.
*   **Role-Based Access Control (RBAC):**
    *   **Admin:** Can create projects, create tasks, assign tasks to members, and manage the workspace.
    *   **Member:** Can view assigned projects/tasks and update task statuses.
*   **Project Management:** Create and view detailed project workspaces.
*   **Task Management:** Create tasks, set due dates, assign them to specific projects, and track status (`PENDING`, `IN_PROGRESS`, `COMPLETED`).
*   **Responsive Dashboard:** A beautiful, dark-themed UI built with HTML5, CSS3, and JavaScript that interacts seamlessly with the REST API.

## 🛠️ Technology Stack

**Backend:**
*   Java 8
*   Spring Boot 2.7.18
*   Spring Web (MVC)
*   Spring Data JPA & Hibernate
*   Spring Security
*   JSON Web Tokens (io.jsonwebtoken)
*   Maven

**Database:**
*   MySQL 8.0+

**Frontend:**
*   HTML5
*   CSS3 (Vanilla CSS with CSS Variables for theming)
*   JavaScript (Fetch API for asynchronous requests)

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:
*   [Java Development Kit (JDK) 8](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html) or higher installed.
*   [MySQL Server](https://dev.mysql.com/downloads/mysql/) 8.0+ installed and running.
*   [Apache Maven](https://maven.apache.org/download.cgi) installed.

## ⚙️ Local Setup & Installation

**1. Create the Database**
Open MySQL Workbench or your MySQL terminal and run the following command to create the required database:
```sql
CREATE DATABASE project_manager;
```

**2. Configure Application Properties**
Navigate to `src/main/resources/application.properties` and update your MySQL username and password if they differ from the default:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/project_manager?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YourMySQLPassword
```

**3. Build and Run the Application**
Open your terminal in the root directory of the project and run:
```bash
mvn clean install
mvn spring-boot:run
```
*(Hibernate will automatically create all the necessary database tables on the first startup).*

**4. Access the Application**
Open your web browser and navigate to:
```
http://localhost:8080/index.html
```

## 🔐 Using the Application (Roles)

When you first start the application, the database will be empty. 
1. Click **Sign Up** to create a new account.
2. If you want to create projects and tasks, select the **Admin** role during registration.
3. If you just want to test task status updates, select the **Member** role.
4. Log in with your new credentials and use the dashboard to manage your workflow!

## 📡 Key API Endpoints

*   `POST /api/auth/signup` - Register a new user
*   `POST /api/auth/signin` - Authenticate a user and return a JWT
*   `GET /api/projects` - Retrieve all projects
*   `POST /api/projects` - Create a new project (Admin only)
*   `GET /api/tasks/project/{projectId}` - Get tasks for a specific project
*   `POST /api/tasks` - Create a new task (Admin only)
*   `PUT /api/tasks/{id}/status` - Update a task's status
