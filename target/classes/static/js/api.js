const API_URL = 'http://localhost:8080/api';

function getToken() {
    return localStorage.getItem('token');
}

function authHeader() {
    const token = getToken();
    if (token) {
        return { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };
    } else {
        return { 'Content-Type': 'application/json' };
    }
}

async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: authHeader(),
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/index.html';
            throw new Error("Unauthorized");
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'API request failed');
        }

        // Return empty object for empty responses
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

// Auth API
const AuthService = {
    login: (username, password) => apiCall('/auth/signin', 'POST', { username, password }),
    signup: (username, email, password, role) => apiCall('/auth/signup', 'POST', { username, email, password, role })
};

// Project API
const ProjectService = {
    getAll: () => apiCall('/projects'),
    create: (name, description) => apiCall('/projects', 'POST', { name, description }),
    delete: (id) => apiCall(`/projects/${id}`, 'DELETE')
};

// Task API
const TaskService = {
    getAll: () => apiCall('/tasks'),
    getByProject: (projectId) => apiCall(`/tasks/project/${projectId}`),
    getByUser: (userId) => apiCall(`/tasks/user/${userId}`),
    create: (title, description, dueDate, projectId, assigneeId) => 
        apiCall('/tasks', 'POST', { title, description, dueDate, projectId, assigneeId }),
    updateStatus: (id, status) => apiCall(`/tasks/${id}/status`, 'PUT', { status }),
    delete: (id) => apiCall(`/tasks/${id}`, 'DELETE')
};
