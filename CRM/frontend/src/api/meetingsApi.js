import apiClient from './client';

export const meetingsApi = {
  getMeetings: (projectId) => apiClient.get(`/projects/${projectId}/meetings`).then(r => r.data),
  getMeeting: (projectId, meetingId) => apiClient.get(`/projects/${projectId}/meetings/${meetingId}`).then(r => r.data),
  createMeeting: (projectId, data) => apiClient.post(`/projects/${projectId}/meetings`, data).then(r => r.data),
  updateStatus: (projectId, meetingId, data) => apiClient.patch(`/projects/${projectId}/meetings/${meetingId}/status`, data).then(r => r.data),
  
  getNotes: (projectId, meetingId) => apiClient.get(`/projects/${projectId}/meetings/${meetingId}/notes`).then(r => r.data),
  saveNotes: (projectId, meetingId, data) => apiClient.put(`/projects/${projectId}/meetings/${meetingId}/notes`, data).then(r => r.data),
  submitToMemory: (projectId, meetingId) => apiClient.post(`/projects/${projectId}/meetings/${meetingId}/submit-to-memory`).then(r => r.data),
};
