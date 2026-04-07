import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || (
  process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:5000/api'
);

console.log('API URL:', API_URL);

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

const authService = {
  register: (userData) => {
    return apiClient.post('/auth/register', userData);
  },

  login: (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },

  getProfile: (token) => {
    return apiClient.get('/chat/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

const chatService = {
  getUsers: (token) => {
    return apiClient.get('/chat/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  getMessages: (userId, token) => {
    return apiClient.get(`/chat/messages/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  markMessagesAsRead: (userId, token) => {
    return apiClient.put(`/chat/messages/user/${userId}/read-all`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  updateStatus: (status, token) => {
    return apiClient.put('/chat/status', { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

const groupService = {
  getMyGroups: (token) => {
    return apiClient.get('/groups/my-groups', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

export { authService, chatService, groupService };
