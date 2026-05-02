document.addEventListener('DOMContentLoaded', async () => {
    // Check Auth
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        window.location.href = '/index.html';
        return;
    }

    const user = JSON.parse(userStr);
    const isAdmin = user.role === 'ROLE_ADMIN';
    let currentProjectId = null;

    // Setup UI Based on Role
    document.getElementById('welcome-msg').textContent = `Welcome, ${user.username}`;
    document.getElementById('user-role').textContent = isAdmin ? 'ADMIN' : 'MEMBER';
    document.getElementById('user-role').className = `badge ${isAdmin ? 'pending' : 'progress'}`;

    if (isAdmin) {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'inline-block');
    }

    // Logout Logic
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    });

    // Modals
    const projectModal = document.getElementById('project-modal');
    const taskModal = document.getElementById('task-modal');
    
    document.getElementById('new-project-btn')?.addEventListener('click', () => projectModal.classList.add('active'));
    document.getElementById('close-project-modal')?.addEventListener('click', () => projectModal.classList.remove('active'));
    
    document.getElementById('new-task-btn')?.addEventListener('click', () => {
        if (!currentProjectId) {
            alert('Please select a project first.');
            return;
        }
        taskModal.classList.add('active');
    });
    document.getElementById('close-task-modal')?.addEventListener('click', () => taskModal.classList.remove('active'));

    // Load Projects
    async function loadProjects() {
        try {
            const projects = await ProjectService.getAll();
            const list = document.getElementById('project-list');
            list.innerHTML = '';
            
            projects.forEach(p => {
                const li = document.createElement('li');
                li.className = 'project-item';
                li.style.position = 'relative';
                
                let deleteBtn = '';
                if (isAdmin) {
                    deleteBtn = `<button class="btn btn-sm" onclick="event.stopPropagation(); deleteProject(${p.id})" style="position: absolute; top: 10px; right: 10px; background: var(--danger); font-size: 0.7rem; padding: 4px 8px;">Delete</button>`;
                }
                
                li.innerHTML = `<h4>${p.name}</h4><p style="margin-right: 55px;">${p.description || 'No description'}</p>${deleteBtn}`;
                li.onclick = () => selectProject(p.id, p.name, li);
                list.appendChild(li);
            });
        } catch (e) {
            console.error('Error loading projects', e);
        }
    }

    // Select Project
    async function selectProject(id, name, element) {
        currentProjectId = id;
        document.getElementById('current-project-title').textContent = name;
        
        document.querySelectorAll('.project-item').forEach(el => el.classList.remove('active'));
        if (element) element.classList.add('active');

        loadTasks(id);
    }

    // Load Tasks
    async function loadTasks(projectId) {
        try {
            const tasks = await TaskService.getByProject(projectId);
            const container = document.getElementById('tasks-container');
            container.innerHTML = '';

            if (tasks.length === 0) {
                container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No tasks found.</p>';
                return;
            }

            tasks.forEach(task => {
                const badgeClass = task.status === 'PENDING' ? 'pending' : (task.status === 'IN_PROGRESS' ? 'progress' : 'completed');
                
                let actionsHTML = '';
                if (task.status !== 'COMPLETED') {
                    const nextStatus = task.status === 'PENDING' ? 'IN_PROGRESS' : 'COMPLETED';
                    actionsHTML = `<button class="btn btn-sm" style="background: var(--primary);" onclick="updateTaskStatus(${task.id}, '${nextStatus}')">Mark ${nextStatus}</button>`;
                }

                container.innerHTML += `
                    <div class="task-card">
                        <div class="task-info">
                            <h4>${task.title} <span class="badge ${badgeClass}">${task.status}</span></h4>
                            <p>${task.description || ''}</p>
                            <p style="margin-top: 8px; font-size: 0.8rem; color: var(--primary);">Due: ${task.dueDate || 'No date'}</p>
                        </div>
                        <div class="task-actions">
                            ${actionsHTML}
                            ${isAdmin ? `<button class="btn btn-sm" onclick="deleteTask(${task.id})" style="margin-left: 8px;">Delete</button>` : ''}
                        </div>
                    </div>
                `;
            });
        } catch (e) {
            console.error('Error loading tasks', e);
        }
    }

    // Global Handlers for inline onclick
    window.updateTaskStatus = async (id, status) => {
        try {
            await TaskService.updateStatus(id, status);
            loadTasks(currentProjectId);
        } catch (e) {
            alert('Failed to update task');
        }
    };

    window.deleteTask = async (id) => {
        if(confirm('Are you sure you want to delete this task?')) {
            try {
                await TaskService.delete(id);
                loadTasks(currentProjectId);
            } catch (e) {
                alert('Failed to delete task');
            }
        }
    };

    window.deleteProject = async (id) => {
        if(confirm('Are you sure you want to delete this project? All tasks inside it will also be deleted!')) {
            try {
                await ProjectService.delete(id);
                if (currentProjectId === id) {
                    currentProjectId = null;
                    document.getElementById('current-project-title').textContent = 'Select a Project';
                    document.getElementById('tasks-container').innerHTML = '<p style="color: var(--text-muted); text-align: center; margin-top: 40px;">Select a project to view tasks.</p>';
                }
                loadProjects();
            } catch (e) {
                alert('Failed to delete project');
            }
        }
    };

    // Form Submissions
    document.getElementById('project-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await ProjectService.create(
                document.getElementById('proj-name').value,
                document.getElementById('proj-desc').value
            );
            projectModal.classList.remove('active');
            document.getElementById('project-form').reset();
            loadProjects();
        } catch (e) {
            alert('Failed to create project');
        }
    });

    document.getElementById('task-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await TaskService.create(
                document.getElementById('task-title').value,
                document.getElementById('task-desc').value,
                document.getElementById('task-due').value,
                currentProjectId,
                null // Setting assignee null for simplicity in this demo
            );
            taskModal.classList.remove('active');
            document.getElementById('task-form').reset();
            loadTasks(currentProjectId);
        } catch (e) {
            alert('Failed to create task');
        }
    });

    // Initial Load
    loadProjects();
});
