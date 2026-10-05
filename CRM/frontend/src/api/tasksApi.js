import apiClient from './client';

export const tasksApi = {
  getTasks: (projectId, params) => apiClient.get(`/projects/${projectId}/tasks`, { params }).then(r => r.data),
  getMyTasks: (params) => apiClient.get('/tasks/my', { params }).then(r => r.data),
  createTask: (projectId, data) => apiClient.post(`/projects/${projectId}/tasks`, data).then(r => r.data),
  updateTask: (projectId, taskId, data) => apiClient.put(`/projects/${projectId}/tasks/${taskId}`, data).then(r => r.data),
  updateStatus: (projectId, taskId, data) => apiClient.patch(`/projects/${projectId}/tasks/${taskId}/status`, data).then(r => r.data),
  deleteTask: (projectId, taskId) => apiClient.delete(`/projects/${projectId}/tasks/${taskId}`).then(r => r.data),
};

export default tasksApi;
