import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { showError, showSuccess } from '../utils/toast.jsx'
import { userApi } from '../services/api.js'
import { StaggerContainer, StaggerItem } from '../components/ui/Stagger.jsx'

export default function Settings() {
  const { deleteAccount, user, updateUserProfile } = useAuth()
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [editName, setEditName] = useState(user?.name || '')
  const [editPhotoUrl, setEditPhotoUrl] = useState(user?.avatarUrl || '')
  const [imagePreviewError, setImagePreviewError] = useState(false)

  const handleEditProfile = () => {
    setEditName(user?.name || '')
    setEditPhotoUrl(user?.avatarUrl || '')
    setImagePreviewError(false)
    setIsEditingProfile(true)
  }

  const handleCancelEdit = () => {
    setIsEditingProfile(false)
    setEditName(user?.name || '')
    setEditPhotoUrl(user?.avatarUrl || '')
    setImagePreviewError(false)
  }

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      showError('Name cannot be empty')
      return
    }

    setIsSavingProfile(true)
    try {
      // Update Firebase Auth profile
      await updateUserProfile({
        displayName: editName.trim(),
        photoURL: editPhotoUrl.trim() || null
      })

      // Update backend profile
      try {
        await userApi.updateProfile({
          displayName: editName.trim(),
          photoURL: editPhotoUrl.trim() || null
        })
      } catch (backendError) {
        console.error('Backend profile update failed:', backendError)
        // Don't fail if backend update fails - Firebase is source of truth
      }

      showSuccess('Profile updated successfully!')
      setIsEditingProfile(false)
    } catch (error) {
      console.error('Profile update error:', error)
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
      console.error('Delete account error:', error)
      // Error already shown by deleteAccount function
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <SectionHeading
        badge="Preferences"
        title="Settings"
        subtitle="Manage your account"
      />

      <StaggerContainer>
        {/* Account Settings */}
        <StaggerItem className="bg-surface rounded-xl border border-border shadow-sm mb-6">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-heading">Account Information</h3>
              <p className="text-sm text-text/80 mt-1">Your current account details</p>
            </div>
            {!isEditingProfile && (
              <button
                onClick={handleEditProfile}
                className="px-4 py-2 bg-primary hover:bg-primary text-surface rounded-lg font-medium transition-colors text-sm"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-text">Email</label>
              <p className="mt-1 text-heading">{user?.email}</p>
              <p className="text-xs text-text/70 mt-1">Email cannot be changed</p>
            </div>

            {!isEditingProfile ? (
              <>
                <div>
                  <label className="text-sm font-medium text-text">Name</label>
                  <p className="mt-1 text-heading">{user?.name}</p>
                </div>
                {user?.avatarUrl && (
                  <div>
                    <label className="text-sm font-medium text-text">Profile Picture</label>
                    <div className="mt-2 flex items-center gap-3">
                      <img
                        src={user.avatarUrl}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover border-2 border-border"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <span className="text-xs text-text/70">Current profile picture</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium text-text mb-2 block">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your name"
                    disabled={isSavingProfile}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-text mb-2 block">Profile Picture URL (Optional)</label>

                  {/* Image Preview */}
                  {editPhotoUrl && (
                    <div className="mb-3 flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
                        {!imagePreviewError ? (
                          <img
                            src={editPhotoUrl}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                            onError={() => setImagePreviewError(true)}
                          />
                        ) : (
                          <div className="text-text/60 text-center">
                            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-text/80">Profile Picture Preview</p>
                        {imagePreviewError && (
                          <p className="text-xs text-secondary mt-1">Unable to load image</p>
                        )}
                      </div>
                    </div>
                  )}

                  <input
                    type="url"
                    value={editPhotoUrl}
                    onChange={(e) => {
                      setEditPhotoUrl(e.target.value)
                      setImagePreviewError(false)
                    }}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://example.com/photo.jpg"
                    disabled={isSavingProfile}
                  />
                  <p className="text-xs text-text/70 mt-1">Enter a URL to an image (leave empty to remove)</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSavingProfile}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-light transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile || !editName.trim()}
                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary text-surface rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </>
            )}
          </div>
        </StaggerItem>

        {/* Danger Zone */}
        <StaggerItem className="bg-surface rounded-xl border border-danger shadow-sm">
          <div className="p-6 border-b border-danger bg-danger/10">
            <h3 className="text-lg font-semibold text-danger">Danger Zone</h3>
            <p className="text-sm text-danger mt-1">Irreversible actions</p>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-base font-semibold text-heading mb-1">Delete Account</h4>
                <p className="text-sm text-text/80 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <ul className="text-sm text-text/80 space-y-1 mb-4">
                  <li className="flex items-start">
                    <span className="text-danger mr-2">•</span>
                    All your challenges and events will be removed
                  </li>
                  <li className="flex items-start">
                    <span className="text-danger mr-2">•</span>
                    Your tips and contributions will be deleted
                  </li>
                  <li className="flex items-start">
                    <span className="text-danger mr-2">•</span>
                    Your profile and statistics will be permanently lost
                  </li>
                </ul>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-danger hover:bg-danger text-surface rounded-lg font-medium transition-colors"
            >
              Delete Account
            </button>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-danger/15 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-heading">Delete Account</h3>
            </div>

            <p className="text-text/80 mb-4">
              This action is permanent and cannot be undone. All your data will be deleted.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-text mb-2">
                Type <span className="font-bold text-danger">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-4 py-2 border border-danger rounded-lg focus:ring-2 focus:ring-danger focus:border-danger focus:outline-none"
                placeholder="Type DELETE"
                disabled={isDeleting}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmText('')
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-light transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmText !== 'DELETE'}
                className="flex-1 px-4 py-2 bg-danger hover:bg-danger text-surface rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
