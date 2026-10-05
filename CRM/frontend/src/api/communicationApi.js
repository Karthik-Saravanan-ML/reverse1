import apiClient from './client';

export const communicationApi = {
  // Conversations
  getConversations: () => apiClient.get('/conversations').then(r => r.data),
  getProjectConversation: (projectId) => apiClient.get(`/conversations/project/${projectId}`).then(r => r.data),
  createDirectConversation: (data) => apiClient.post('/conversations/direct', data).then(r => r.data),
  
  // Messages
  getMessages: (conversationId, params) => 
    apiClient.get(`/conversations/${conversationId}/messages`, { params }).then(r => r.data),
  sendMessage: (data) => apiClient.post('/conversations/messages', data).then(r => r.data),
  
  // Calls
  initiateCall: (data) => apiClient.post('/calls', data).then(r => r.data),
  joinCall: (sessionId) => apiClient.post(`/calls/${sessionId}/join`).then(r => r.data),
  endCall: (sessionId) => apiClient.post(`/calls/${sessionId}/end`).then(r => r.data),
  getProjectCalls: (projectId) => apiClient.get(`/projects/${projectId}/calls`).then(r => r.data),
};

export const callsApi = communicationApi;
