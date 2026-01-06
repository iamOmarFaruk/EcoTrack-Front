import axios from 'axios'
import { apiConfig } from '../config/env.js'

const TOKEN_KEY = 'eco-admin-token'
let adminToken = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null

export function setAdminToken(token) {
  adminToken = token
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  }
}

const adminClient = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
})

adminClient.interceptors.request.use((config) => {
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`
  }
  return config
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
  me: () => adminClient.get('/admin/me'),
  dashboard: () => adminClient.get('/admin/dashboard'),
  getContent: () => adminClient.get('/admin/content'),
  updateContent: (payload) => adminClient.put('/admin/content', payload),
  getUsers: (params = {}) => adminClient.get('/admin/users', { params }),
  updateUser: (id, payload) => adminClient.patch(`/admin/users/${id}`, payload),
  getChallenges: (params = {}) => adminClient.get('/admin/challenges', { params }),
  updateChallengeStatus: (id, payload) => adminClient.patch(`/admin/challenges/${id}/status`, payload),
  getEvents: (params = {}) => adminClient.get('/admin/events', { params }),
  updateEventStatus: (id, payload) => adminClient.patch(`/admin/events/${id}/status`, payload),
  getTips: (params = {}) => adminClient.get('/admin/tips', { params }),
  updateTipStatus: (id, payload) => adminClient.patch(`/admin/tips/${id}/status`, payload),
  getActivity: (params = {}) => adminClient.get('/admin/activity', { params })
}
