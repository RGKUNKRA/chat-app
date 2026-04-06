import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authService = {
  register: (userData) => {
    return axios.post(`${API_URL}/auth/register`, userData);
  },

  login: (credentials) => {
    return axios.post(`${API_URL}/auth/login`, credentials);
  },

  getProfile: (token) => {
    return axios.get(`${API_URL}/chat/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

const chatService = {
  getUsers: (token) => {
    return axios.get(`${API_URL}/chat/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  getMessages: (userId, token) => {
    return axios.get(`${API_URL}/chat/messages/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  updateStatus: (status, token) => {
    return axios.put(`${API_URL}/chat/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

export { authService, chatService };
