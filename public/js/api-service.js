// api-service.js
/**
 * Utility service for making API requests to the server
 */
const ApiService = {
    /**
     * Base URL for API endpoints
     */
    baseUrl: 'http://localhost:3000',
    
    /**
     * Get the authentication token from storage
     * @returns {string|null} The JWT token or null if not found
     */
    getToken() {
      return localStorage.getItem('token') || sessionStorage.getItem('token') || null;
    },
    
    /**
     * Creates default headers for API requests
     * @param {boolean} includeAuth - Whether to include the Authorization header
     * @returns {Object} Headers object with appropriate content type and auth token
     */
    createHeaders(includeAuth = true) {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (includeAuth) {
        const token = this.getToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
      
      return headers;
    },
    
    /**
     * Makes a request to the API
     * @param {string} endpoint - API endpoint (without base URL)
     * @param {Object} options - Request options
     * @param {string} options.method - HTTP method (GET, POST, etc.)
     * @param {Object} options.body - Request body (will be stringified)
     * @param {boolean} options.auth - Whether authentication is required
     * @returns {Promise} Promise resolving to the response data
     */
    async request(endpoint, options = {}) {
      const { method = 'GET', body = null, auth = true } = options;
      
      const url = `${this.baseUrl}${endpoint}`;
      const headers = this.createHeaders(auth);
      
      const requestOptions = {
        method,
        headers,
        credentials: 'same-origin',
      };
      
      if (body && method !== 'GET') {
        requestOptions.body = JSON.stringify(body);
      }
      
      try {
        const response = await fetch(url, requestOptions);
        
        // Handle 401 Unauthorized - redirect to login
        if (response.status === 401) {
          this.handleUnauthorized();
          throw new Error('Authentication required');
        }
        
        // Parse JSON response
        const data = await response.json();
        
        // If the response wasn't successful, throw an error
        if (!response.ok) {
          throw new Error(data.message || 'API request failed');
        }
        
        return data;
      } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
      }
    },
    
    /**
     * Handles unauthorized access by clearing tokens and redirecting to login
     */
    handleUnauthorized() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/public/index.html';
    },
    
    /**
     * Convenience method for GET requests
     * @param {string} endpoint - API endpoint
     * @param {boolean} auth - Whether authentication is required
     * @returns {Promise} Promise resolving to the response data
     */
    get(endpoint, auth = true) {
      return this.request(endpoint, { method: 'GET', auth });
    },
    
    /**
     * Convenience method for POST requests
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body
     * @param {boolean} auth - Whether authentication is required
     * @returns {Promise} Promise resolving to the response data
     */
    post(endpoint, data, auth = true) {
      return this.request(endpoint, { method: 'POST', body: data, auth });
    },
    
    /**
     * Convenience method for PUT requests
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body
     * @param {boolean} auth - Whether authentication is required
     * @returns {Promise} Promise resolving to the response data
     */
    put(endpoint, data, auth = true) {
      return this.request(endpoint, { method: 'PUT', body: data, auth });
    },
    
    /**
     * Convenience method for DELETE requests
     * @param {string} endpoint - API endpoint
     * @param {boolean} auth - Whether authentication is required
     * @returns {Promise} Promise resolving to the response data
     */
    delete(endpoint, auth = true) {
      return this.request(endpoint, { method: 'DELETE', auth });
    },
    
    /**
     * Login user and store token
     * @param {string} username - User's username
     * @param {string} password - User's password
     * @param {boolean} remember - Whether to remember the user
     * @returns {Promise} Promise resolving to the login response
     */
    async login(username, password, remember = false) {
      const data = await this.post('/login', { username, password }, false);
      
      if (data.token) {
        if (remember) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('user', JSON.stringify(data.user));
        }
      }
      
      return data;
    },
    
    /**
     * Logout user by removing tokens from storage
     */
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    },
    
    /**
     * Get current user information
     * @returns {Promise} Promise resolving to the user data
     */
    getCurrentUser() {
      return this.get('/user');
    }
  };
  
  // Make ApiService available globally
  window.ApiService = ApiService;