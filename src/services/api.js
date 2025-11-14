// API Service Layer for EcoTrack Frontend
import httpClient, { ApiError } from './httpClient.js'

// Authentication API calls
export const authApi = {
  // Register a new user
  register: (userData) => httpClient.post('/auth/register', userData),

  // Login user
  login: (credentials) => httpClient.post('/auth/login', credentials),

  // Logout user
  logout: () => httpClient.post('/auth/logout'),

  // Get current user profile
  getProfile: () => httpClient.get('/auth/profile'),

  // Update user profile
  updateProfile: (profileData) => httpClient.patch('/auth/profile', profileData)
}

// Challenge API calls
export const challengeApi = {
  // Get all challenges with optional filtering
  getAll: (filters = {}) => httpClient.get('/challenges', { params: filters }),

  // Get specific challenge by ID
  getById: (id) => httpClient.get(`/challenges/${id}`),

  // Create new challenge
  create: (challengeData) => httpClient.post('/challenges', challengeData),

  // Update challenge (user can only update their own)
  update: (id, challengeData) => httpClient.patch(`/challenges/${id}`, challengeData),

  // Delete challenge (user can only delete their own)
  delete: (id) => httpClient.delete(`/challenges/${id}`),

  // Join a challenge
  join: (id) => httpClient.post(`/challenges/join/${id}`),

  // Leave a challenge
  leave: (id) => httpClient.post(`/challenges/leave/${id}`),

  // Get challenge participants
  getParticipants: (id) => httpClient.get(`/challenges/${id}/participants`),

  // Update progress on a challenge
  updateProgress: (id, progressData) => httpClient.patch(`/challenges/${id}/progress`, progressData),

  // Mark challenge as complete
  markComplete: (id) => httpClient.post(`/challenges/${id}/complete`),

  // Get user's own challenges (created by them)
  getUserChallenges: () => httpClient.get('/challenges/my-challenges'),

  // Get user's joined challenges
  getJoinedChallenges: () => httpClient.get('/challenges/joined')
}

// User API calls
export const userApi = {
  // Get user by ID
  getById: (id) => httpClient.get(`/users/${id}`),

  // Get user's activity summary
  getActivities: () => httpClient.get('/user/activities'),

  // Get user's stats
  getStats: () => httpClient.get('/user/stats'),

  // Update user preferences/settings
  updateSettings: (settings) => httpClient.patch('/user/settings', settings)
}

// Tips API calls
export const tipsApi = {
  // Get all tips with optional filtering
  getAll: (filters = {}) => httpClient.get('/tips', { params: filters }),

  // Get specific tip by ID
  getById: (id) => httpClient.get(`/tips/${id}`),

  // Create new tip
  create: (tipData) => httpClient.post('/tips', tipData),

  // Update tip (user can only update their own)
  update: (id, tipData) => httpClient.patch(`/tips/${id}`, tipData),

  // Delete tip (user can only delete their own)
  delete: (id) => httpClient.delete(`/tips/${id}`),

  // Upvote a tip (unlimited voting)
  upvote: (id) => httpClient.post(`/tips/${id}/upvote`)
}

// Community API calls
export const communityApi = {
  // Get community stats
  getStats: () => httpClient.get('/community/stats'),

  // Get leaderboard
  getLeaderboard: (filters = {}) => httpClient.get('/community/leaderboard', { params: filters })
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