import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Todo API functions
export const todoAPI = {
  // Get all todos with optional filters
  getAllTodos: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    const response = await api.get(`/todos?${params.toString()}`);
    return response;
  },

  // Get single todo by ID
  getTodoById: async (id) => {
    const response = await api.get(`/todos/${id}`);
    return response;
  },

  // Create new todo
  createTodo: async (todoData) => {
    const response = await api.post('/todos', todoData);
    return response;
  },

  // Update todo
  updateTodo: async (id, todoData) => {
    const response = await api.put(`/todos/${id}`, todoData);
    return response;
  },

  // Delete todo
  deleteTodo: async (id) => {
    const response = await api.delete(`/todos/${id}`);
    return response;
  },

  // Get dashboard data
  getDashboardData: async () => {
    const response = await api.get('/dashboard');
    return response;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response;
  },
};

export default api;
