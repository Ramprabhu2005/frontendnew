import axios from "axios";

// Create axios instance with base URL
const authApiClient = axios.create({
  baseURL: 'http://localhost:8081/api/auth',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor to add auth token to requests
authApiClient.interceptors.request.use(
  (config) => {
    const token = getBasicAuth();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 Unauthorized
authApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Auto logout if 401 response returned from api
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const registerApi = async (user) => {
  try {
    const response = await authApiClient.post('/register', user);
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginApi = async (username, password) => {
  try {
    // Clear any existing auth data first
    logout();
    
    const response = await authApiClient.post('/login', { username, password });
    
    if (response.status === 200 && response.data) {
      const { id, username: responseUsername, role } = response.data;
      if (id && responseUsername && role) {
        // Save user data in session storage
        saveLoggedUser(id, responseUsername, role);
        
        // Store basic auth for subsequent requests
        const basicAuth = 'Basic ' + btoa(username + ':' + password);
        storeBasicAuth(basicAuth);
        
        // Set default auth header for future requests
        authApiClient.defaults.headers.common['Authorization'] = basicAuth;
      }
    }
    return response;
  } catch (error) {
    console.error('Login error:', error);
    // Clear any partial auth data on error
    logout();
    throw error;
  }
};

export const saveLoggedUser = (userId, username, role) => {
  sessionStorage.setItem('activeUserId', userId);
  sessionStorage.setItem('authenticatedUser', username);
  sessionStorage.setItem('role', role);
};

export const storeBasicAuth = (basicAuth) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('basicAuth', basicAuth);
  }
};

export const getBasicAuth = () => sessionStorage.getItem('basicAuth');

export const isUserLoggedIn = () => {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem('activeUserId') !== null && 
         sessionStorage.getItem('basicAuth') !== null;
};

export const getLoggedInUserId = () => sessionStorage.getItem('activeUserId');
export const getLoggedInUser = () => sessionStorage.getItem('authenticatedUser');

export const logout = () => {
  if (typeof window === 'undefined') return;
  
  // Clear session storage
  sessionStorage.removeItem('activeUserId');
  sessionStorage.removeItem('authenticatedUser');
  sessionStorage.removeItem('role');
  sessionStorage.removeItem('basicAuth');
  
  // Clear auth header
  if (authApiClient && authApiClient.defaults) {
    delete authApiClient.defaults.headers.common['Authorization'];
  }
  
  // Clear any cookies by setting an expired cookie
  document.cookie = 'JSESSIONID=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = 'XSRF-TOKEN=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  
  // Clear any remaining session data
  sessionStorage.clear();
  
  // Redirect to login page
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

export const isAdminUser = () => sessionStorage.getItem('role') === 'ROLE_ADMIN'; // Strict comparison for role check
