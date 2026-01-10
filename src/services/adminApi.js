import axios from 'axios'
import { apiConfig } from '../config/env.js'

// No token management needed - cookies are automatic!
const adminClient = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true, // CRITICAL: Send httpOnly cookies with requests
  timeout: 15000
})

adminClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      const message = data?.error?.message || data?.message || `HTTP ${status}`
      const err = new Error(message)
      err.status = status
      throw err
    }
    const err = new Error('Network error')
    err.status = 0
    throw err
  }
)

export const adminApi = {
  login: (credentials) => adminClient.post('/admin/login', credentials),
  logout: () => adminClient.post('/admin/logout'),
  me: () => adminClient.get('/admin/me'),
  dashboard: () => adminClient.get('/admin/dashboard'),
  getContent: () => adminClient.get('/admin/content'),
  updateContent: (payload) => adminClient.put('/admin/content', payload),
  getUsers: (params = {}) => adminClient.get('/admin/users', { params }),
  updateUser: (id, payload) => adminClient.patch(`/admin/users/${id}`, payload),
  getChallenges: (params = {}) => adminClient.get('/admin/challenges', { params }),
  getChallenge: (id) => adminClient.get(`/admin/challenges/${id}`),
  updateChallenge: (id, payload) => adminClient.put(`/admin/challenges/${id}`, payload),
  updateChallengeStatus: (id, payload) => adminClient.patch(`/admin/challenges/${id}/status`, payload),
  deleteChallenge: (id) => adminClient.delete(`/admin/challenges/${id}`),
  getEvents: (params = {}) => adminClient.get('/admin/events', { params }),
  getEvent: (id) => adminClient.get(`/admin/events/${id}`),
  updateEvent: (id, payload) => adminClient.put(`/admin/events/${id}`, payload),
  updateEventStatus: (id, payload) => adminClient.patch(`/admin/events/${id}/status`, payload),
  deleteEvent: (id) => adminClient.delete(`/admin/events/${id}`),
  getTips: (params = {}) => adminClient.get('/admin/tips', { params }),
  updateTip: (id, payload) => adminClient.patch(`/admin/tips/${id}/status`, payload),
  updateTipStatus: (id, payload) => adminClient.patch(`/admin/tips/${id}/status`, payload),
  getActivity: (params = {}) => adminClient.get('/admin/activity', { params }),
  clearActivity: () => adminClient.delete('/admin/activity'),
  deleteActivity: (id) => adminClient.delete(`/admin/activity/${id}`),

  // Demo Reset
  getResetStatus: () => adminClient.get('/admin/reset/status'),
  executeReset: () => adminClient.post('/admin/reset/execute'),
  createSnapshot: () => adminClient.post('/admin/reset/snapshot'),
  cancelResetTimer: () => adminClient.delete('/admin/reset/timer')
}
