import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { tipsApi } from '../services/api.js'
import { showSuccess, showError } from '../utils/toast.jsx'

/**
 * Custom hook for managing tips using the backend API
 */
export function useUserTips() {
  const { user } = useAuth()
  const [tips, setTips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState(null)

  // Fetch all tips from the API
  const fetchTips = async (filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await tipsApi.getAll(filters)
      // Handle different API response structures
      let tipsData = response.data
      let paginationData = null
      
      if (response.data?.tips) {
        tipsData = response.data.tips
        paginationData = response.data.pagination
      } else if (response.data?.data?.tips) {
        tipsData = response.data.data.tips
        paginationData = response.data.data.pagination
      } else if (response.data?.data) {
        tipsData = response.data.data
      }
      
      // Ensure we have an array
      const tipsArray = Array.isArray(tipsData) ? tipsData : Object.values(tipsData || {})
      
      // Enhance each tip with proper data structure
      const enhancedTips = tipsArray.map(tip => {
        // Verify we're using custom id, not MongoDB _id
        if (!tip.id && tip._id) {
          console.warn('⚠️ Tip is missing custom "id" field, falling back to MongoDB "_id":', tip._id)
        }
        
        return {
          ...tip,
          id: tip.id || tip._id,
          title: tip.title || '',
          content: tip.content || '',
          // Prefer backend's upvoteCount, fallback to upvotes, then 0
          upvotes: Number.isFinite(Number(tip.upvoteCount))
            ? Number(tip.upvoteCount)
            : (Number.isFinite(Number(tip.upvotes)) ? Number(tip.upvotes) : 0),
          createdAt: tip.createdAt || new Date().toISOString(),
          updatedAt: tip.updatedAt || tip.createdAt || new Date().toISOString(),
          authorName: tip.authorName || tip.author?.name || 'Anonymous',
          authorImage: tip.authorImage || tip.authorAvatar || tip.author?.avatarUrl || tip.author?.imageUrl,
          // Handle case where tip.author is a string (Firebase UID) or an object
          authorId: tip.authorId || (typeof tip.author === 'string' ? tip.author : tip.author?.uid || tip.author?.id),
          firebaseId: tip.firebaseId || (typeof tip.author === 'string' ? tip.author : tip.author?.firebaseId)
        }
      })
      
      setTips(enhancedTips)
      setPagination(paginationData)
      return enhancedTips
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }

  // Fetch trending tips (most upvoted in recent days)
  const fetchTrendingTips = async (days = 7, limit = 10) => {
    setLoading(true)
    setError(null)
    try {
      const response = await tipsApi.getTrending({ days, limit })
      
      // Handle different API response structures
      let tipsData = response.data
      if (response.data?.tips) {
        tipsData = response.data.tips
      } else if (response.data?.data?.tips) {
        tipsData = response.data.data.tips
      } else if (response.data?.data) {
        tipsData = response.data.data
      }
      
      // Ensure we have an array
      const tipsArray = Array.isArray(tipsData) ? tipsData : Object.values(tipsData || {})
      
      // Enhance each tip with proper data structure
      const enhancedTips = tipsArray.map(tip => {
        return {
          ...tip,
          id: tip.id || tip._id,
        title: tip.title || '',
        content: tip.content || '',
        upvotes: Number.isFinite(Number(tip.upvoteCount))
          ? Number(tip.upvoteCount)
          : (Number.isFinite(Number(tip.upvotes)) ? Number(tip.upvotes) : 0),
        createdAt: tip.createdAt || new Date().toISOString(),
        updatedAt: tip.updatedAt || tip.createdAt || new Date().toISOString(),
        authorName: tip.authorName || tip.author?.name || 'Anonymous',
        authorImage: tip.authorImage || tip.authorAvatar || tip.author?.avatarUrl || tip.author?.imageUrl,
        authorId: tip.authorId || (typeof tip.author === 'string' ? tip.author : tip.author?.uid || tip.author?.id),
        firebaseId: tip.firebaseId || (typeof tip.author === 'string' ? tip.author : tip.author?.firebaseId)
        }
      })
      
      return enhancedTips
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }

  // Get a specific tip by ID
  const getTipById = async (tipId) => {
    try {
      const response = await tipsApi.getById(tipId)
      
      // Handle different API response structures
      let tipData = response.data
      if (response.data?.tip) {
        tipData = response.data.tip
      } else if (response.data?.data) {
        tipData = response.data.data
      }
      
      // Enhance tip data
      const enhancedTip = {
        ...tipData,
        id: tipData.id || tipData._id,
        title: tipData.title || '',
        content: tipData.content || '',
        // Prefer backend's upvoteCount, fallback to upvotes, then 0
        upvotes: Number.isFinite(Number(tipData.upvoteCount))
          ? Number(tipData.upvoteCount)
          : (Number.isFinite(Number(tipData.upvotes)) ? Number(tipData.upvotes) : 0),
        createdAt: tipData.createdAt || new Date().toISOString(),
        updatedAt: tipData.updatedAt || tipData.createdAt || new Date().toISOString(),
        authorName: tipData.authorName || tipData.author?.name || 'Anonymous',
        authorImage: tipData.authorImage || tipData.authorAvatar || tipData.author?.avatarUrl || tipData.author?.imageUrl,
        // Handle case where tipData.author is a string (Firebase UID) or an object
        authorId: tipData.authorId || (typeof tipData.author === 'string' ? tipData.author : tipData.author?.uid || tipData.author?.id),
        firebaseId: tipData.firebaseId || (typeof tipData.author === 'string' ? tipData.author : tipData.author?.firebaseId)
      }
      
      return enhancedTip
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Add a new tip
  const addTip = async (tipData) => {
    if (!user) {
      throw new Error('User must be logged in to add tips')
    }

    try {
      setError(null)
      
      // Include author information from Firebase user
      const tipWithAuthor = {
        ...tipData,
        authorName: user.name || user.displayName || 'Anonymous',
        authorImage: user.avatarUrl || user.photoURL || null,
        // Also include additional image fields for backend compatibility
        authorAvatar: user.avatarUrl || user.photoURL || null,
        imageUrl: user.avatarUrl || user.photoURL || null
      }
      
      const response = await tipsApi.create(tipWithAuthor)
      
      // Handle different API response structures
      let newTip = response.data
      if (response.data?.tip) {
        newTip = response.data.tip
      } else if (response.data?.data) {
        newTip = response.data.data
      }
      
      // Ensure the new tip has all required fields
      const enhancedTip = {
        // Start with the original tip data from form
        ...tipData,
        // Then add/override with API response data
        ...newTip,
        // Ensure essential fields are always present
        id: newTip.id || newTip._id || Date.now(),
        title: newTip.title || tipData.title || '',
        content: newTip.content || tipData.content || '',
        authorId: newTip.authorId || user.uid,
        authorName: newTip.authorName || user.name || user.displayName || 'Anonymous',
        authorImage: newTip.authorImage || newTip.authorAvatar || newTip.imageUrl || user.avatarUrl || user.photoURL || null,
        // Add firebaseId to ensure our isOwnTip logic works
        firebaseId: newTip.firebaseId || user.uid,
        upvotes: Number.isFinite(Number(newTip.upvotes)) ? Number(newTip.upvotes) : 0,
        createdAt: newTip.createdAt || new Date().toISOString(),
        updatedAt: newTip.updatedAt || newTip.createdAt || new Date().toISOString()
      }
      
      // Add to local state
      setTips(prevTips => [enhancedTip, ...prevTips])
      
      // Show success message
      showSuccess('Tip shared successfully!')
      
      return enhancedTip
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Update an existing tip
  const updateTip = async (tipId, updates) => {
    if (!user) {
      throw new Error('User must be logged in to update tips')
    }

    try {
      setError(null)
      
      // Don't modify author information when updating
      const updateData = { ...updates }
      // Remove author fields from updates to prevent overriding
      delete updateData.authorName
      delete updateData.authorImage
      delete updateData.authorAvatar
      
      const response = await tipsApi.update(tipId, updateData)
      
      // Handle different API response structures
      let updatedTip = response.data
      if (response.data?.tip) {
        updatedTip = response.data.tip
      } else if (response.data?.data?.tip) {
        updatedTip = response.data.data.tip
      } else if (response.data?.data) {
        updatedTip = response.data.data
      }

      // Find the original tip in local state to preserve data
      const originalTip = tips.find(tip => tip.id === tipId)
      
      // If backend didn't return tip data, use original tip with updates
      if (!updatedTip) {
        updatedTip = {}
      }
      
      // Ensure the updated tip retains proper identification and data
      const enhancedTip = {
        // Start with original tip data
        ...originalTip,
        // Apply the updates
        ...updates,
        // Then add/override with API response data
        ...updatedTip,
        // Ensure essential fields are preserved
        id: tipId,
        authorId: updatedTip?.authorId || originalTip?.authorId || user.uid,
        authorName: updatedTip?.authorName || originalTip?.authorName || user.name || user.displayName || 'Anonymous',
        authorImage: updatedTip?.authorImage || originalTip?.authorImage || user.avatarUrl || user.photoURL || null,
        firebaseId: updatedTip?.firebaseId || originalTip?.firebaseId || user.uid,
        upvotes: Number.isFinite(Number(updatedTip?.upvoteCount)) 
          ? Number(updatedTip.upvoteCount) 
          : (Number.isFinite(Number(updatedTip?.upvotes)) ? Number(updatedTip.upvotes) : (originalTip?.upvotes || 0)),
        updatedAt: updatedTip?.updatedAt || new Date().toISOString()
      }

      // Update local state
      setTips(prevTips => 
        prevTips.map(tip => tip.id === tipId ? enhancedTip : tip)
      )
      
      // Show success message
      showSuccess('Tip updated successfully!')
      
      return enhancedTip
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Delete a tip
  const deleteTip = async (tipId) => {
    if (!user) {
      throw new Error('User must be logged in to delete tips')
    }

    try {
      setError(null)
      await tipsApi.delete(tipId)
      
      // Remove from local state
      setTips(prevTips => prevTips.filter(tip => tip.id !== tipId))
      
      // Show success message
      showSuccess('Tip deleted successfully')
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Upvote a tip with optimistic UI update and server sync
  const upvoteTip = async (tipId) => {
    // Find the original tip before any updates
    const originalTip = tips.find(tip => tip.id === tipId)
    if (!originalTip) {
      throw new Error('Tip not found')
    }

    // Store original upvote count for rollback
    const originalUpvotes = originalTip.upvotes

    try {
      setError(null)
      
      // OPTIMISTIC UPDATE: Immediately increment the upvote count in the UI
      setTips(prevTips => 
        prevTips.map(tip => 
          tip.id === tipId 
            ? { ...tip, upvotes: tip.upvotes + 1 } 
            : tip
        )
      )
      
      // SYNC WITH SERVER: Send upvote to backend database
      await tipsApi.upvote(tipId)
      
      // The optimistic update already incremented the count
      // Don't update state again here since it would reset to 0
      // The optimistic update (originalUpvotes + 1) is already applied above
      
      // Return the optimistically updated tip
      return tips.find(tip => tip.id === tipId)
    } catch (err) {
      // ROLLBACK: Restore original upvote count on error
      setTips(prevTips => 
        prevTips.map(tip => 
          tip.id === tipId 
            ? { ...tip, upvotes: originalUpvotes } 
            : tip
        )
      )
      
      setError('Failed to upvote tip. Please try again.')
      showError('Failed to upvote tip. Please try again.')
      throw err
    }
  }

  // Check if user can edit/delete a tip
  const canModifyTip = (tip) => {
    if (!user) return false
    
    // Only use Firebase UID for ownership verification - never use display names for security
    return (
      tip.authorId === user.uid || 
      tip.author?.uid === user.uid || 
      tip.author?.id === user.uid ||
      tip.author?.firebaseId === user.uid ||
      // Sometimes the backend stores the Firebase UID directly in the author field as a string
      tip.author === user.uid ||
      // Sometimes the backend stores the Firebase UID directly
      tip.firebaseId === user.uid
    )
  }

  // Get all tips for display
  const getAllTipsForDisplay = () => {
    // Ensure tips is always an array
    // Don't re-sort here - tips are already sorted by the API
    // Re-sorting causes upvoted tips to jump around
    const tipsArray = Array.isArray(tips) ? tips : []
    return tipsArray
  }

  // Fetch tips on component mount
  useEffect(() => {
    fetchTips()
  }, [])

  return {
    tips: getAllTipsForDisplay(),
    loading,
    error,
    pagination,
    fetchTips,
    fetchTrendingTips,
    getTipById,
    addTip,
    updateTip,
    deleteTip,
    upvoteTip,
    canModifyTip,
    getAllTipsForDisplay
  }
}