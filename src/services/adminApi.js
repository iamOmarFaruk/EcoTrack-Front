import httpClient from './httpClient.js'

export const adminApi = {
  me: () => httpClient.get('/admin/me'),
  dashboard: () => httpClient.get('/admin/dashboard'),
  getContent: () => httpClient.get('/admin/content'),
  updateContent: (payload) => httpClient.put('/admin/content', payload),
  getUsers: (params = {}) => httpClient.get('/admin/users', { params }),
  updateUser: (id, payload) => httpClient.patch(`/admin/users/${id}`, payload),
  getChallenges: (params = {}) => httpClient.get('/admin/challenges', { params }),
  getChallenge: (id) => httpClient.get(`/admin/challenges/${id}`),
  updateChallenge: (id, payload) => httpClient.put(`/admin/challenges/${id}`, payload),
  updateChallengeStatus: (id, payload) => httpClient.patch(`/admin/challenges/${id}/status`, payload),
  deleteChallenge: (id) => httpClient.delete(`/admin/challenges/${id}`),
  getEvents: (params = {}) => httpClient.get('/admin/events', { params }),
  getEvent: (id) => httpClient.get(`/admin/events/${id}`),
  updateEvent: (id, payload) => httpClient.put(`/admin/events/${id}`, payload),
  updateEventStatus: (id, payload) => httpClient.patch(`/admin/events/${id}/status`, payload),
  deleteEvent: (id) => httpClient.delete(`/admin/events/${id}`),
  getTips: (params = {}) => httpClient.get('/admin/tips', { params }),
  updateTip: (id, payload) => httpClient.patch(`/admin/tips/${id}/status`, payload),
  updateTipStatus: (id, payload) => httpClient.patch(`/admin/tips/${id}/status`, payload),
  getActivity: (params = {}) => httpClient.get('/admin/activity', { params }),
  clearActivity: () => httpClient.delete('/admin/activity'),
  deleteActivity: (id) => httpClient.delete(`/admin/activity/${id}`),

  // Demo Reset
  getResetStatus: () => httpClient.get('/admin/reset/status'),
  executeReset: () => httpClient.post('/admin/reset/execute'),
  createSnapshot: () => httpClient.post('/admin/reset/snapshot'),
  cancelResetTimer: () => httpClient.delete('/admin/reset/timer')
}
