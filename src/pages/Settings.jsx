import { useState, useEffect } from 'react'
import SectionHeading from '../components/SectionHeading.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { authApi, userApi } from '../services/api.js'
import toast from 'react-hot-toast'

export default function Settings() {
  const { auth } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    photoURL: '',
    preferences: {
      privacy: 'public',
      notifications: {
        email: true,
        push: true,
        challenges: true,
        tips: true,
        events: true
      }
    }
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const response = await authApi.getMe()
      const data = response?.data || response
      setUserData(data)
      
      // Populate form with existing data
      setFormData({
        displayName: data.displayName || '',
        bio: data.bio || '',
        location: data.location || '',
        photoURL: data.photoURL || '',
        preferences: data.preferences || formData.preferences
      })
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }))
    } else if (name.startsWith('notifications.')) {
      const notifKey = name.replace('notifications.', '')
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          notifications: {
            ...prev.preferences.notifications,
            [notifKey]: checked
          }
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      await userApi.updateProfile(formData)
      toast.success('Settings updated successfully!')
      
      // Refresh user data
      await fetchUserData()
    } catch (error) {
      console.error('Failed to update settings:', error)
      toast.error('Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <SectionHeading title="Settings" subtitle="Customize your experience" />
        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <SectionHeading title="Settings" subtitle="Customize your experience" />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Information */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Tell us about yourself..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="City, Country"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo URL
              </label>
              <input
                type="url"
                name="photoURL"
                value={formData.photoURL}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Visibility
            </label>
            <select
              name="preferences.privacy"
              value={formData.preferences.privacy}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="public">Public - Anyone can view your profile</option>
              <option value="private">Private - Only you can view your full profile</option>
            </select>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="notifications.email"
                checked={formData.preferences.notifications.email}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="ml-3 text-sm text-gray-700">Email notifications</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                name="notifications.push"
                checked={formData.preferences.notifications.push}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="ml-3 text-sm text-gray-700">Push notifications</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                name="notifications.challenges"
                checked={formData.preferences.notifications.challenges}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="ml-3 text-sm text-gray-700">Challenge updates</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                name="notifications.tips"
                checked={formData.preferences.notifications.tips}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="ml-3 text-sm text-gray-700">New tips</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                name="notifications.events"
                checked={formData.preferences.notifications.events}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="ml-3 text-sm text-gray-700">Event reminders</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
