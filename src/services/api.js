// API Service Layer for EcoTrack Frontend
import httpClient, { ApiError } from './httpClient.js'

// Authentication API calls
export const authApi = {
  // Register a new user (Firebase user auto-creates in backend)
  register: (userData) => httpClient.post('/auth/register', userData),

  // Get complete user data (profile, stats, preferences, badges, rank)
  // This is the RECOMMENDED endpoint - auto-creates profile if doesn't exist
  getMe: () => httpClient.get('/auth/me'),

  // Get current user profile (database only, may return 404)
  getProfile: () => httpClient.get('/auth/profile'),

  // Verify Firebase token
  verifyToken: (idToken) => httpClient.post('/auth/verify-token', { idToken }),

  // Get Firebase user info
  getUser: () => httpClient.get('/auth/user')
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
  // Get current user profile (auto-creates if doesn't exist)
  getProfile: () => httpClient.get('/users/profile'),

  // Update current user profile
  updateProfile: (profileData) => httpClient.patch('/users/profile', profileData),

  // Get public user profile by Firebase UID or MongoDB ID
  getById: (id) => httpClient.get(`/users/${id}`),

  // Get user statistics
  getStats: (id) => httpClient.get(`/users/${id}/stats`),

  // Get user's challenges
  getChallenges: (id, status) => httpClient.get(`/users/${id}/challenges`, { params: { status } }),

  // Get current user's joined challenges (my activities)
  getMyActivities: (params = {}) => httpClient.get('/users/my-activities', { params }),

  // Get public user's activities
  getActivities: (id, params = {}) => httpClient.get(`/users/${id}/activities`, { params })
}

// Tips API calls
export const tipsApi = {
  // Get all tips with pagination, search, and sorting (Public)
  // Query params: page, limit, sortBy (createdAt/upvoteCount), order (asc/desc), search, authorId
  getAll: (filters = {}) => httpClient.get('/tips', { params: filters }),

  // Get trending tips (most upvoted in recent days) (Public)
  // Query params: days (default: 7, max: 30), limit (default: 10, max: 50)
  getTrending: (params = {}) => httpClient.get('/tips/trending', { params }),

  // Get tips created by logged-in user (Authenticated)
  // Query params: page, limit, sortBy, order
  getMyTips: (params = {}) => httpClient.get('/tips/my-tips', { params }),

  // Get specific tip by ID (Public)
  getById: (id) => httpClient.get(`/tips/${id}`),

  // Create new tip (Authenticated)
  // Body: { title: string (5-100 chars), content: string (20-500 chars) }
  // Author info auto-populated from Firebase token
  create: (tipData) => httpClient.post('/tips', tipData),

  // Update tip - full update (Authenticated, author only)
  // Body: { title?: string, content?: string }
  update: (id, tipData) => httpClient.put(`/tips/${id}`, tipData),

  // Partially update tip (Authenticated, author only)
  // Body: { title?: string, content?: string }
  partialUpdate: (id, tipData) => httpClient.patch(`/tips/${id}`, tipData),

  // Delete tip permanently (Authenticated, author only)
  delete: (id) => httpClient.delete(`/tips/${id}`),

  // Upvote a tip (Authenticated)
  // Users can upvote multiple times (max 100 per user per tip)
  // Cannot upvote own tips
  upvote: (id) => httpClient.post(`/tips/${id}/upvote`)
}

// Event API calls
export const eventApi = {
  // Get all events with pagination and search (Public)
  getAll: (filters = {}) => httpClient.get('/events', { params: filters }),

  // Get specific event by ID (Public, optional auth for isJoined/isCreator)
  getById: (id) => httpClient.get(`/events/${id}`),

  // Create new event (Authenticated)
  create: (eventData) => httpClient.post('/events', eventData),

  // Update event - creator only (Authenticated)
  update: (id, eventData) => httpClient.put(`/events/${id}`, eventData),

  // Delete event - creator only (Authenticated)
  delete: (id) => httpClient.delete(`/events/${id}`),

  // Join an event (Authenticated)
  join: (id) => httpClient.post(`/events/${id}/join`),

  // Leave an event (Authenticated)
  leave: (id) => httpClient.post(`/events/${id}/leave`),

  // Get events created by logged-in user (Authenticated)
  getMyEvents: () => httpClient.get('/events/my-events'),

  // Get events joined by logged-in user (Authenticated)
  getMyJoined: (status = 'upcoming') => httpClient.get('/events/my-joined', { params: { status } }),

  // Get participant list for an event (Public)
  getParticipants: (id) => httpClient.get(`/events/${id}/participants`)
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
  tips: tipsApi,
  events: eventApi
}