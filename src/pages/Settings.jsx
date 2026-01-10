import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  User,
  Lock,
  Trash2,
  Save,
  Image as ImageIcon,
  Camera,
  AlertTriangle,
  ChevronRight,
  ShieldAlert
} from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { showError, showSuccess } from '../utils/toast.jsx'
import { userApi } from '../services/api.js'

export default function Settings() {
  const { deleteAccount, user, updateUserProfile } = useAuth()
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const [activeSection, setActiveSection] = useState('profile')
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [editName, setEditName] = useState(user?.name || '')
  const [editPhotoUrl, setEditPhotoUrl] = useState(user?.avatarUrl || '')
  const [imagePreviewError, setImagePreviewError] = useState(false)

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      showError('Name cannot be empty')
      return
    }

    setIsSavingProfile(true)
    try {
      await updateUserProfile({
        displayName: editName.trim(),
        photoURL: editPhotoUrl.trim() || null
      })

      try {
        await userApi.updateProfile({
          displayName: editName.trim(),
          photoURL: editPhotoUrl.trim() || null
        })
      } catch (backendError) {
        showError(backendError.message || 'Profile updated, but failed to sync with server')
      }

      showSuccess('Profile updated successfully!')
    } catch (error) {
      showError(error.message || 'Failed to update profile')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      showError('Please type DELETE to confirm')
      return
    }
    setIsDeleting(true)
    try {
      await deleteAccount()
      navigate('/')
    } catch (error) {
      showError(error.message || 'Failed to delete account')
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold text-heading">Settings</h1>
        <p className="text-text/60">Manage your account and preferences</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Navigation Sidebar inside Settings */}
        <aside className="lg:col-span-1">
          <nav className="flex flex-col gap-1">
            {[
              { id: 'profile', label: 'Profile Info', icon: User },
              { id: 'security', label: 'Security', icon: Lock },
              { id: 'danger', label: 'Danger Zone', icon: Trash2, color: 'text-red-500' }
            ].map((section) => (
              <Button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                variant="ghost"
                size="sm"
                className={`justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${activeSection === section.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-text/60 hover:bg-light hover:text-text'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <section.icon size={18} className={section.color} />
                  {section.label}
                </div>
                <ChevronRight size={14} className={activeSection === section.id ? 'opacity-100' : 'opacity-0'} />
              </Button>
            ))}
          </nav>
        </aside>

        {/* Setting Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl border border-border bg-surface p-8 shadow-sm"
          >
            {activeSection === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-heading">Profile Information</h3>
                  <p className="text-sm text-text/60">Update your public profile details</p>
                </div>

                <div className="flex flex-col gap-8 md:flex-row md:items-start">
                  {/* Photo Preview */}
                  <div className="relative">
                    <div className="h-28 w-28 overflow-hidden rounded-3xl border-4 border-light bg-light">
                      {editPhotoUrl && !imagePreviewError ? (
                        <img
                          src={editPhotoUrl}
                          alt="Profile Preview"
                          className="h-full w-full object-cover"
                          onError={() => setImagePreviewError(true)}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-text/30">
                          <ImageIcon size={32} />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 rounded-xl bg-primary p-2 text-surface shadow-lg">
                      <Camera size={14} />
                    </div>
                  </div>

                  {/* Form */}
                  <div className="flex-1 space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-text/40">Full Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded-xl border border-border bg-light/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-text/40">Email Address</label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full cursor-not-allowed rounded-xl border border-border bg-light/50 px-4 py-3 text-sm text-text/50 outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-text/40">Avatar URL</label>
                      <input
                        type="url"
                        value={editPhotoUrl}
                        onChange={(e) => {
                          setEditPhotoUrl(e.target.value)
                          setImagePreviewError(false)
                        }}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full rounded-xl border border-border bg-light/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    variant="primary"
                    size="sm"
                    className="rounded-xl px-6 py-3 text-sm font-bold shadow-lg shadow-primary/20 active:scale-95"
                  >
                    <Save size={18} />
                    {isSavingProfile ? 'Saving Changes...' : 'Save Profile'}
                  </Button>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-heading">Security Settings</h3>
                  <p className="text-sm text-text/60">Keep your account safe and secure</p>
                </div>

                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-light text-primary">
                    <ShieldAlert size={40} />
                  </div>
                  <h4 className="text-lg font-bold text-heading">Social Login Enabled</h4>
                  <p className="mt-2 max-w-sm text-sm text-text/60">
                    You are currently using Google/Firebase authentication. Password management is handled through your social provider.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'danger' && (
              <div className="space-y-8">
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-red-500 p-3 text-surface">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-red-500">Delete Account</h3>
                      <p className="mt-1 text-sm text-red-500/70 leading-relaxed">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-medium text-heading">This will permanently delete:</p>
                  <ul className="grid gap-3 text-sm text-text/60 sm:grid-cols-2">
                    <li className="flex items-center gap-2">• All your eco-statistics</li>
                    <li className="flex items-center gap-2">• Challenges you created</li>
                    <li className="flex items-center gap-2">• Participation history</li>
                    <li className="flex items-center gap-2">• Earned badges & trophies</li>
                  </ul>
                </div>

                <Button
                  onClick={() => setShowDeleteModal(true)}
                  variant="ghost"
                  size="sm"
                  className="rounded-xl px-6 py-3 text-sm font-bold text-danger shadow-lg shadow-red-500/10 hover:bg-danger/10 active:scale-95"
                >
                  Delete My Account
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-dark/20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl bg-surface p-8 shadow-2xl border border-border"
          >
            <h3 className="text-xl font-bold text-heading">Are you absolutely sure?</h3>
            <p className="mt-4 text-sm text-text/60 leading-relaxed">
              To proceed, please type <span className="font-bold text-red-500 uppercase">DELETE</span> below. This action cannot be undone.
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="mt-6 w-full rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-500/20"
              placeholder="Type DELETE"
            />
            <div className="mt-8 flex gap-3">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl py-3 text-sm font-bold"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmText !== 'DELETE'}
                variant="ghost"
                size="sm"
                className="flex-1 rounded-xl py-3 text-sm font-bold text-danger shadow-lg shadow-red-500/10 hover:bg-danger/10"
              >
                {isDeleting ? 'Deleting...' : 'Delete Forever'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
