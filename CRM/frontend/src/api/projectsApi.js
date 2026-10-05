import apiClient from './client';

export const projectsApi = {
  // Projects
  getProjects: (params) => apiClient.get('/projects', { params }).then(r => r.data),
  getProject: (id) => apiClient.get(`/projects/${id}`).then(r => r.data),
  createProject: (data) => apiClient.post('/projects', data).then(r => r.data),
  updateProject: (id, data) => apiClient.put(`/projects/${id}`, data).then(r => r.data),
  
  // Team
  getProjectTeam: (projectId) => apiClient.get(`/projects/${projectId}/team`).then(r => r.data),
  addTeamMember: (projectId, data) => apiClient.post(`/projects/${projectId}/team`, data).then(r => r.data),
  removeTeamMember: (projectId, userId) => apiClient.delete(`/projects/${projectId}/team/${userId}`).then(r => r.data),
  assignTeamLead: (projectId, data) => apiClient.post(`/projects/${projectId}/team-lead`, data).then(r => r.data),
  
  // Workload
  getEmployeeWorkload: () => apiClient.get('/projects/workload').then(r => r.data),
  getAvailableEmployees: () => apiClient.get('/users/employees').then(r => r.data),
  
  // Project Requests
  getRequests: (params) => apiClient.get('/project-requests', { params }).then(r => r.data),
  submitRequest: (data) => apiClient.post('/project-requests', data).then(r => r.data),
  reviewRequest: (id, data) => apiClient.post(`/project-requests/${id}/review`, data).then(r => r.data),
  approveRequest: (id, data) => apiClient.post(`/project-requests/${id}/approve`, data).then(r => r.data),
  rejectRequest: (id, data) => apiClient.post(`/project-requests/${id}/review`, { ...data, newStatus: 'REJECTED' }).then(r => r.data),
};

export default projectsApi;
