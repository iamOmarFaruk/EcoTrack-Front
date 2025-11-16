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
  // Get all challenges with pagination and filters (Public)
  // Query params: page, limit, search, status (active/completed/cancelled), 
  // category, featured (true/false), sortBy (startDate/endDate/participants/createdAt), order (asc/desc)
  getAll: (filters = {}) => httpClient.get('/challenges', { params: filters }),

  // Get specific challenge by ID (Public, shows additional fields if authenticated)
  // IMPORTANT: Use _id (MongoDB ID) for operations (join, leave, update, delete)
  getById: (id) => httpClient.get(`/challenges/${id}`),

  // Get specific challenge by slug (Public, shows additional fields if authenticated)
  // IMPORTANT: Use slug for SEO-friendly URLs and viewing
  getBySlug: (slug) => httpClient.get(`/challenges/slug/${slug}`),

  // Create new challenge (Authenticated)
  // Required fields: category, title, shortDescription, image, duration, communityImpact, startDate, endDate
  // Optional: detailedDescription, featured
  // Returns challenge with both _id and slug
  create: (challengeData) => httpClient.post('/challenges', challengeData),

  // Update challenge - creator only (Authenticated)
  // IMPORTANT: Must use _id (MongoDB ID), not slug
  // All fields optional, uses PUT method
  update: (id, challengeData) => httpClient.put(`/challenges/${id}`, challengeData),

  // Delete challenge - creator only (Authenticated)
  // IMPORTANT: Must use _id (MongoDB ID), not slug
  // Will be cancelled instead if has participants
  delete: (id) => httpClient.delete(`/challenges/${id}`),

  // Join a challenge (Authenticated)
  // IMPORTANT: Must use _id (MongoDB ID), not slug
  join: (id) => httpClient.post(`/challenges/${id}/join`),

  // Leave a challenge (Authenticated)
  // IMPORTANT: Must use _id (MongoDB ID), not slug
  leave: (id) => httpClient.post(`/challenges/${id}/leave`),

  // Get participant count (Public, full list if creator)
  // IMPORTANT: Must use _id (MongoDB ID), not slug
  getParticipants: (id) => httpClient.get(`/challenges/${id}/participants`),

  // Get challenges created by logged-in user (Authenticated)
  getMyCreated: () => httpClient.get('/challenges/my/created'),

  // Get challenges joined by logged-in user (Authenticated)
  // Query params: status (active/left), includeCompleted (boolean)
  getMyJoined: (filters = {}) => httpClient.get('/challenges/my/joined', { params: filters })
}

// User API calls
export const userApi = {
  // Get current user profile (auto-creates if doesn't exist)
  getProfile: () => httpClient.get('/users/profile'),

  // Update current user profile
  updateProfile: (profileData) => httpClient.patch('/users/profile', profileData),

  // Delete current user profile and all related data
  deleteProfile: () => httpClient.delete('/users/profile'),

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
  // Get all events with pagination and filters (Public)
  // Query params: page, limit, status, search, sortBy, order
  getAll: (filters = {}) => httpClient.get('/events', { params: filters }),

  // Get specific event by slug or _id (Public, shows isJoined/isCreator if authenticated)
  // Can use either slug (for display) or _id (for operations)
  getById: (id) => httpClient.get(`/events/${id}`),

  // Create new event (Authenticated)
  // Required: title, description, detailedDescription, date, location, organizer, capacity, duration, requirements, benefits
  // Optional: image
  create: (eventData) => httpClient.post('/events', eventData),

  // Update event - creator only (Authenticated)
  // MUST use _id (NOT slug) for update operations
  // All fields optional
  update: (id, eventData) => httpClient.put(`/events/${id}`, eventData),

  // Delete event - creator only (Authenticated)
  // MUST use _id (NOT slug) for delete operations
  // Will be cancelled instead if has participants
  delete: (id) => httpClient.delete(`/events/${id}`),

  // Join an event (Authenticated)
  // MUST use _id (NOT slug) for join operations
  // Users can rejoin after leaving
  join: (id) => httpClient.post(`/events/${id}/join`),

  // Leave an event (Authenticated)
  // MUST use _id (NOT slug) for leave operations
  leave: (id) => httpClient.post(`/events/${id}/leave`),

  // Get events created by logged-in user (Authenticated)
  getMyEvents: () => httpClient.get('/events/my-events'),

  // Get events joined by logged-in user (Authenticated)
  // Query params: status (upcoming/past)
  getMyJoined: (status = 'upcoming') => httpClient.get('/events/my-joined', { params: { status } }),

  // Get participant list for an event (Public/Creator)
  // MUST use _id (NOT slug)
  // Creators see full list, others see counts only
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