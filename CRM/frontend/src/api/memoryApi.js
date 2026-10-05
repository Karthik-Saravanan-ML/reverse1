import apiClient from './client';

export const memoryApi = {
  getCards: (projectId, params) => apiClient.get(`/projects/${projectId}/memory`, { params }).then(r => r.data),
  getCard: (projectId, cardId) => apiClient.get(`/projects/${projectId}/memory/${cardId}`).then(r => r.data),
  createCard: (projectId, data) => apiClient.post(`/projects/${projectId}/memory`, data).then(r => r.data),
  reviewCard: (projectId, cardId, data) => apiClient.post(`/projects/${projectId}/memory/${cardId}/review`, data).then(r => r.data),
  getReviewQueue: (projectId, params) => apiClient.get(`/projects/${projectId}/memory/review-queue`, { params }).then(r => r.data),
};
