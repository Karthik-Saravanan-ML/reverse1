import apiClient from './client';

export const notificationsApi = {
  getNotifications: (params) => apiClient.get('/notifications', { params }).then(r => r.data),
  getUnreadCount: () => apiClient.get('/notifications/unread-count').then(r => r.data),
  markAsRead: (id) => apiClient.post(`/notifications/${id}/read`).then(r => r.data),
  markAllAsRead: () => apiClient.post('/notifications/read-all').then(r => r.data),
};
