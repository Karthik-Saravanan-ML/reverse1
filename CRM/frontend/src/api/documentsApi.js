import apiClient from './client';

export const documentsApi = {
  getDocuments: (projectId, params) => apiClient.get(`/projects/${projectId}/documents`, { params }).then(r => r.data),
  upload: (projectId, formData) => apiClient.post(`/projects/${projectId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data),
  getDownloadUrl: (projectId, docId) => apiClient.get(`/projects/${projectId}/documents/${docId}/download-url`).then(r => r.data),
  deleteDocument: (projectId, docId) => apiClient.delete(`/projects/${projectId}/documents/${docId}`).then(r => r.data),
};
