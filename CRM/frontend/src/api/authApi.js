import apiClient from './client';

export const authApi = {
  login: (data) => apiClient.post('/auth/login', data).then(r => r.data),
  
  registerManager: (data) => apiClient.post('/auth/register/manager', data).then(r => r.data),
  registerEmployee: (data) => apiClient.post('/auth/register/employee', data).then(r => r.data),
  registerClient: (data) => apiClient.post('/auth/register/client', data).then(r => r.data),
  
  validateInvitation: (token) => apiClient.get(`/auth/invitation/${token}`).then(r => r.data),
  acceptInvitation: (data) => apiClient.post('/auth/invitation/accept', data).then(r => r.data),
  
  forgotPassword: (data) => apiClient.post('/auth/forgot-password', data).then(r => r.data),
  resetPassword: (data) => apiClient.post('/auth/reset-password', data).then(r => r.data),
  
  refreshToken: (data) => apiClient.post('/auth/refresh', data).then(r => r.data),
  logout: () => apiClient.post('/auth/logout').then(r => r.data),
  
  getMe: () => apiClient.get('/auth/me').then(r => r.data),
};

export default authApi;
