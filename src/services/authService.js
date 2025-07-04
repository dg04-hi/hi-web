import { authApi } from './api';

export const authService = {
  login: async (username, password) => {
    const response = await authApi.post('/api/auth/login', {
      username,
      password
    });
    return response.data;
  },

  logout: async () => {
    const response = await authApi.post('/api/auth/logout', {
      refreshToken: localStorage.getItem('refreshToken')
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await authApi.post('/api/members/register', userData);
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await authApi.post('/api/auth/refresh', null, {
      params: { refreshToken }
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await authApi.get('/api/members/profile');
    return response.data;
  }
};