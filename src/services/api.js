// API Service Layer for EcoTrack Frontend
import { apiConfig } from '../config/env.js'

const API_BASE_URL = apiConfig.baseUrl

class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// Helper function to get auth token from Firebase
async function getAuthToken() {
  const { auth } = await import('../config/firebase.js')
  if (auth.currentUser) {
    return await auth.currentUser.getIdToken()
  }
  return null
}

// Helper function to make authenticated requests
async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const token = await getAuthToken()
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  }

  try {
    console.log('=== API REQUEST DEBUG ===')
    console.log('Method:', config.method || 'GET')
    console.log('URL:', url)
    console.log('Request body:', config.body)
    
    const response = await fetch(url, config)
    
    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
        console.log('Error response body:', errorData)
      } catch {
        errorData = { message: `HTTP ${response.status}` }
        console.log('No JSON error response body')
      }
      throw new ApiError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData
      )
    }

    // For successful responses
    try {
      const responseText = await response.text()
      console.log('Raw response text:', responseText)
      
      if (!responseText) {
        console.log('Empty response - treating as success')
        return { success: true }
      }
      
      const data = JSON.parse(responseText)
      console.log('Parsed response data:', data)
      return data
    } catch (parseError) {
      console.log('JSON parse error:', parseError)
      console.log('Treating as successful empty response')
      return { success: true }
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    
    // Check if it's a network error (backend not running)
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new ApiError('Backend server not available', 503, { 
        original: error,
        isNetworkError: true 
      })
    }
    
    throw new ApiError('Network error occurred', 0, { original: error })
  }
}

// Authentication API calls
export const authApi = {
  // Register a new user
  async register(userData) {
    return makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  },

  // Login user
  async login(credentials) {
    return makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
  },

  // Logout user
  async logout() {
    return makeRequest('/auth/logout', {
      method: 'POST'
    })
  },

  // Get current user profile
  async getProfile() {
    return makeRequest('/auth/profile')
  },

  // Update user profile
  async updateProfile(profileData) {
    return makeRequest('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData)
    })
  }
}

// Challenge API calls
export const challengeApi = {
  // Get all challenges with optional filtering
  async getAll(filters = {}) {
    const queryString = new URLSearchParams(filters).toString()
    const endpoint = `/challenges${queryString ? `?${queryString}` : ''}`
    return makeRequest(endpoint)
  },

  // Get specific challenge by ID
  async getById(id) {
    return makeRequest(`/challenges/${id}`)
  },

  // Create new challenge
  async create(challengeData) {
    return makeRequest('/challenges', {
      method: 'POST',
      body: JSON.stringify(challengeData)
    })
  },

  // Update challenge (user can only update their own)
  async update(id, challengeData) {
    return makeRequest(`/challenges/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(challengeData)
    })
  },

  // Delete challenge (user can only delete their own)
  async delete(id) {
    return makeRequest(`/challenges/${id}`, {
      method: 'DELETE'
    })
  },

  // Join a challenge
  async join(id) {
    return makeRequest(`/challenges/join/${id}`, {
      method: 'POST'
    })
  },

  // Leave a challenge
  async leave(id) {
    return makeRequest(`/challenges/leave/${id}`, {
      method: 'POST'
    })
  },

  // Get challenge participants
  async getParticipants(id) {
    return makeRequest(`/challenges/${id}/participants`)
  },

  // Update progress on a challenge
  async updateProgress(id, progressData) {
    return makeRequest(`/challenges/${id}/progress`, {
      method: 'PATCH',
      body: JSON.stringify(progressData)
    })
  },

  // Mark challenge as complete
  async markComplete(id) {
    return makeRequest(`/challenges/${id}/complete`, {
      method: 'POST'
    })
  },

  // Get user's own challenges (created by them)
  async getUserChallenges() {
    return makeRequest('/challenges/my-challenges')
  },

  // Get user's joined challenges
  async getJoinedChallenges() {
    return makeRequest('/challenges/joined')
  }
}

// User API calls
export const userApi = {
  // Get user's activity summary
  async getActivities() {
    return makeRequest('/user/activities')
  },

  // Get user's stats
  async getStats() {
    return makeRequest('/user/stats')
  },

  // Update user preferences/settings
  async updateSettings(settings) {
    return makeRequest('/user/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings)
    })
  }
}

// Tips API calls
export const tipsApi = {
  // Get all tips with optional filtering
  async getAll(filters = {}) {
    const queryString = new URLSearchParams(filters).toString()
    const endpoint = `/tips${queryString ? `?${queryString}` : ''}`
    return makeRequest(endpoint)
  },

  // Get specific tip by ID
  async getById(id) {
    return makeRequest(`/tips/${id}`)
  },

  // Create new tip
  async create(tipData) {
    return makeRequest('/tips', {
      method: 'POST',
      body: JSON.stringify(tipData)
    })
  },

  // Update tip (user can only update their own)
  async update(id, tipData) {
    return makeRequest(`/tips/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(tipData)
    })
  },

  // Delete tip (user can only delete their own)
  async delete(id) {
    return makeRequest(`/tips/${id}`, {
      method: 'DELETE'
    })
  },

  // Upvote a tip (unlimited voting)
  async upvote(id) {
    return makeRequest(`/tips/${id}/upvote`, {
      method: 'POST'
    })
  }
}

// Community API calls
export const communityApi = {
  // Get community stats
  async getStats() {
    return makeRequest('/community/stats')
  },

  // Get leaderboard
  async getLeaderboard(filters = {}) {
    const queryString = new URLSearchParams(filters).toString()
    const endpoint = `/community/leaderboard${queryString ? `?${queryString}` : ''}`
    return makeRequest(endpoint)
  }
}

// Export the ApiError for error handling
export { ApiError }

// Default export for convenience
export default {
  auth: authApi,
  challenges: challengeApi,
  user: userApi,
  community: communityApi,
  tips: tipsApi
}