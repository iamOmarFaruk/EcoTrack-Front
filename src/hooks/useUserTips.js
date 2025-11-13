import { useLocalStorage } from './useLocalStorage.js'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * Custom hook for managing user-created tips in localStorage
 */
export function useUserTips() {
  const { user } = useAuth()
  const [userTips, setUserTips] = useLocalStorage('eco_user_tips', [])

  // Get all user tips
  const getUserTips = () => {
    // Return all user tips from localStorage, regardless of current login status
    // This allows viewing tips even when not logged in
    return userTips || []
  }

  // Add a new tip
  const addTip = (tipData) => {
    if (!user) {
      throw new Error('User must be logged in to add tips')
    }

    const newTip = {
      ...tipData,
      id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
      authorId: user.uid,
      authorName: user.name,
      authorAvatar: user.avatarUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: 0,
      isUserCreated: true
    }

    setUserTips(prevTips => [newTip, ...prevTips])
    return newTip
  }

  // Update an existing tip
  const updateTip = (tipId, updates) => {
    if (!user) {
      throw new Error('User must be logged in to update tips')
    }

    setUserTips(prevTips => 
      prevTips.map(tip => {
        if (tip.id === tipId && tip.authorId === user.uid) {
          return {
            ...tip,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
        return tip
      })
    )
  }

  // Delete a tip
  const deleteTip = (tipId) => {
    if (!user) {
      throw new Error('User must be logged in to delete tips')
    }

    setUserTips(prevTips => 
      prevTips.filter(tip => !(tip.id === tipId && tip.authorId === user.uid))
    )
  }

  // Check if user can edit/delete a tip
  const canModifyTip = (tip) => {
    return user && tip.isUserCreated && tip.authorId === user.uid
  }

  // Get all tips (mock + user created) for display
  const getAllTipsForDisplay = (mockTips = []) => {
    const userCreatedTips = getUserTips()
    
    // Always combine and show all tips, regardless of login status
    const allTips = [...userCreatedTips, ...mockTips]
    return allTips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  // Update tip upvotes (for both user and mock tips)
  const updateTipUpvotes = (tipId, newUpvotes) => {
    // Only update if it's a user-created tip
    const tip = userTips.find(t => t.id === tipId)
    if (tip && tip.authorId === user?.uid) {
      updateTip(tipId, { upvotes: newUpvotes })
    }
  }

  return {
    userTips: getUserTips(),
    allUserTips: userTips, // All tips in localStorage (for debugging)
    addTip,
    updateTip,
    deleteTip,
    canModifyTip,
    getAllTipsForDisplay,
    updateTipUpvotes
  }
}