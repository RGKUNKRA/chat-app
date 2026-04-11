import axios from 'axios';

// Determine API URL based on environment
const getAPIUrl = () => {
  // If explicitly set via environment variable, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // In production, use same origin with /api path (app and api on same server)
  if (process.env.NODE_ENV === 'production') {
    return `${window.location.origin}/api`;
  }
  
  // In development, use localhost
  return 'http://localhost:5000/api';
};

const API_URL = getAPIUrl();

console.log('API URL:', API_URL, 'Environment:', process.env.NODE_ENV);

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
      url: error.config?.url,
      data: error.response?.data
    });
    
    // Handle network errors
    if (!error.response) {
      console.error('Network Error - No response received. Check if server is running and CORS is configured correctly.');
    }
    
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
