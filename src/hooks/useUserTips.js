import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { tipsApi } from '../services/api.js'

/**
 * Custom hook for managing tips using the backend API
 */
export function useUserTips() {
  const { user } = useAuth()
  const [tips, setTips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all tips from the API
  const fetchTips = async (filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await tipsApi.getAll(filters)
      console.log('API response for fetching tips:', response)
      
      // Handle different API response structures
      let tipsData = response.data
      if (response.data?.tips) {
        tipsData = response.data.tips
      } else if (response.data?.data) {
        tipsData = response.data.data
      }
      
      // Ensure we have an array
      const tipsArray = Array.isArray(tipsData) ? tipsData : Object.values(tipsData || {})
      
      // Enhance each tip with proper data structure
      const enhancedTips = tipsArray.map(tip => ({
        ...tip,
        id: tip.id || tip._id,
        title: tip.title || '',
        content: tip.content || '',
        upvotes: Number.isFinite(Number(tip.upvotes)) ? Number(tip.upvotes) : 0,
        createdAt: tip.createdAt || new Date().toISOString(),
        authorName: tip.authorName || tip.author?.name || 'Anonymous',
        authorImage: tip.authorImage || tip.authorAvatar || tip.author?.avatarUrl || tip.author?.imageUrl,
        authorId: tip.authorId || tip.author?.uid || tip.author?.id,
        firebaseId: tip.firebaseId || tip.author?.firebaseId
      }))
      
      console.log('Enhanced tips for local state:', enhancedTips)
      
      setTips(enhancedTips)
      return enhancedTips
    } catch (err) {
      setError(err.message)
      console.error('Error fetching tips:', err)
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
      
      console.log('API response for single tip:', response)
      console.log('Parsed tip data:', tipData)
      
      // Enhance tip data
      const enhancedTip = {
        ...tipData,
        id: tipData.id || tipData._id,
        title: tipData.title || '',
        content: tipData.content || '',
        upvotes: Number.isFinite(Number(tipData.upvotes)) ? Number(tipData.upvotes) : 0,
        createdAt: tipData.createdAt || new Date().toISOString(),
        authorName: tipData.authorName || tipData.author?.name || 'Anonymous',
        authorImage: tipData.authorImage || tipData.authorAvatar || tipData.author?.avatarUrl || tipData.author?.imageUrl,
        authorId: tipData.authorId || tipData.author?.uid || tipData.author?.id,
        firebaseId: tipData.firebaseId || tipData.author?.firebaseId
      }
      
      return enhancedTip
    } catch (err) {
      setError(err.message)
      console.error('Error fetching tip:', err)
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
        authorImage: user.avatarUrl || user.photoURL || null
      }
      
      const response = await tipsApi.create(tipWithAuthor)
      
      // Handle different API response structures
      let newTip = response.data
      if (response.data?.tip) {
        newTip = response.data.tip
      } else if (response.data?.data) {
        newTip = response.data.data
      }
      
      console.log('API response for new tip:', response)
      console.log('Parsed new tip:', newTip)
      
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
        authorImage: newTip.authorImage || user.avatarUrl || user.photoURL || null,
        // Add firebaseId to ensure our isOwnTip logic works
        firebaseId: newTip.firebaseId || user.uid,
        upvotes: Number.isFinite(Number(newTip.upvotes)) ? Number(newTip.upvotes) : 0,
        createdAt: newTip.createdAt || new Date().toISOString()
      }
      
      console.log('Enhanced tip for local state:', enhancedTip)
      
      // Add to local state
      setTips(prevTips => [enhancedTip, ...prevTips])
      return enhancedTip
    } catch (err) {
      setError(err.message)
      console.error('Error adding tip:', err)
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
      } else if (response.data?.data) {
        updatedTip = response.data.data
      }

      console.log('API response for updated tip:', response)
      console.log('Parsed updated tip:', updatedTip)

      // Find the original tip in local state to preserve data
      const originalTip = tips.find(tip => tip.id === tipId)
      
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
        authorId: updatedTip.authorId || originalTip?.authorId || user.uid,
        authorName: originalTip?.authorName || user.name || user.displayName || 'Anonymous',
        authorImage: originalTip?.authorImage || user.avatarUrl || user.photoURL || null,
        firebaseId: updatedTip.firebaseId || originalTip?.firebaseId || user.uid,
        upvotes: Number.isFinite(Number(updatedTip.upvotes)) ? Number(updatedTip.upvotes) : (originalTip?.upvotes || 0)
      }

      console.log('Enhanced updated tip for local state:', enhancedTip)

      // Update local state
      setTips(prevTips => 
        prevTips.map(tip => tip.id === tipId ? enhancedTip : tip)
      )
      return enhancedTip
    } catch (err) {
      setError(err.message)
      console.error('Error updating tip:', err)
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
    } catch (err) {
      setError(err.message)
      console.error('Error deleting tip:', err)
      throw err
    }
  }

  // Upvote a tip
  const upvoteTip = async (tipId) => {
    try {
      setError(null)
      const response = await tipsApi.upvote(tipId)
      
      // Handle different API response structures
      let updatedTip = response.data
      if (response.data?.tip) {
        updatedTip = response.data.tip
      } else if (response.data?.data) {
        updatedTip = response.data.data
      }

      console.log('API response for upvoted tip:', response)
      console.log('Parsed upvoted tip:', updatedTip)

      // Find the original tip to preserve its data
      const originalTip = tips.find(tip => tip.id === tipId)
      
      // Create enhanced tip with preserved data
      const enhancedTip = {
        ...originalTip,
        ...updatedTip,
        // Ensure upvotes is properly handled
        upvotes: Number.isFinite(Number(updatedTip.upvotes)) ? Number(updatedTip.upvotes) : (originalTip?.upvotes || 0)
      }

      // Update local state with new vote count
      setTips(prevTips => 
        prevTips.map(tip => tip.id === tipId ? enhancedTip : tip)
      )
      return enhancedTip
    } catch (err) {
      setError(err.message)
      console.error('Error upvoting tip:', err)
      throw err
    }
  }

  // Check if user can edit/delete a tip
  const canModifyTip = (tip) => {
    if (!user) return false
    
    // Multiple ways the backend might identify the author
    return (
      tip.authorId === user.uid || 
      tip.author?.uid === user.uid || 
      tip.author?.id === user.uid ||
      tip.author?.firebaseId === user.uid ||
      // Sometimes the backend stores the Firebase UID directly
      tip.firebaseId === user.uid ||
      // Also check by author name as a fallback
      (tip.authorName && user.name && tip.authorName.toLowerCase() === user.name.toLowerCase()) ||
      (tip.authorName && user.displayName && tip.authorName.toLowerCase() === user.displayName.toLowerCase())
    )
  }

  // Get all tips for display
  const getAllTipsForDisplay = () => {
    // Ensure tips is always an array before sorting
    const tipsArray = Array.isArray(tips) ? tips : []
    return tipsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  // Fetch tips on component mount
  useEffect(() => {
    fetchTips()
  }, [])

  return {
    tips: getAllTipsForDisplay(),
    loading,
    error,
    fetchTips,
    getTipById,
    addTip,
    updateTip,
    deleteTip,
    upvoteTip,
    canModifyTip,
    getAllTipsForDisplay
  }
}