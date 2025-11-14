// HTTP Client with Axios and Interceptors
import axios from 'axios'
import { apiConfig } from '../config/env.js'

// Custom API Error class
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// Create axios instance with default config
const httpClient = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000 // 15 seconds timeout
})

// Request Interceptor - Auto-inject auth token
httpClient.interceptors.request.use(
  async (config) => {
    try {
      // Dynamically import Firebase auth to get token
      const { auth } = await import('../config/firebase.js')
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken()
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('Error getting auth token:', error)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor - Handle errors globally
httpClient.interceptors.response.use(
  (response) => {
    // Return the data directly for successful responses
    return response.data
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      const message = data?.message || `HTTP ${status}`
      throw new ApiError(message, status, data)
    } else if (error.request) {
      // Request made but no response (backend not running)
      throw new ApiError('Backend server not available', 503, {
        isNetworkError: true,
        original: error
      })
    } else {
      // Something else happened
      throw new ApiError('Network error occurred', 0, {
        original: error
      })
    }
  }
)

export default httpClient
