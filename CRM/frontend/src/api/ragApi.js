import apiClient from './client';

export const ragApi = {
  askQuestion: (data) => apiClient.post('/rag/ask', data).then(r => r.data),
};
