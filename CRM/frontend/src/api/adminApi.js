import apiClient from './client';

export const adminApi = {
  // Registration requests
  getRegistrationRequests: (params) => apiClient.get('/admin/registrations', { params }).then(r => r.data),
  approveRequest: (id) => apiClient.post(`/admin/registrations/${id}/approve`).then(r => r.data),
  rejectRequest: (id, data) => apiClient.post(`/admin/registrations/${id}/reject`, data).then(r => r.data),
  
  // Users
  getUsers: (params) => apiClient.get('/admin/users', { params }).then(r => r.data),
  getUser: (id) => apiClient.get(`/admin/users/${id}`).then(r => r.data),
  updateUserStatus: (id, data) => apiClient.patch(`/admin/users/${id}/status`, data).then(r => r.data),
  inviteAdmin: (data) => apiClient.post('/admin/invite', data).then(r => r.data),
  
  // Audit
  getAuditLogs: (params) => apiClient.get('/audit', { params }).then(r => r.data),
  getProjectAuditLogs: (projectId, params) => apiClient.get(`/audit/project/${projectId}`, { params }).then(r => r.data),
  
  // System stats
  getSystemStats: () => apiClient.get('/admin/stats').then(r => r.data),
};

export default adminApi;
