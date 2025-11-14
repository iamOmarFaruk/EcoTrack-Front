import React, { useState } from 'react'
import Button from './ui/Button.jsx'
import { Card, CardContent, CardHeader, CardFooter } from './ui/Card.jsx'
import { formatDate } from '../utils/formatDate.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function TipCard({ 
  tip, 
  showContent = true, 
  showActions = true, 
  onEdit, 
  onDelete, 
  onUpvote, 
  onLoginRequired, 
  canModify = false 
}) {
  const { user } = useAuth()
  const initialUpvotes = Number.isFinite(Number(tip?.upvotes)) ? Number(tip.upvotes) : 0
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [flyingThumbs, setFlyingThumbs] = useState([])
  const [isUpvoting, setIsUpvoting] = useState(false)

  const handleUpvote = async () => {
    if (isUpvoting) return
    
    setIsUpvoting(true)
    
    // Immediate visual feedback with flying animation
    const newThumb = {
      id: Date.now() + Math.random(),
      startX: Math.random() * 20 - 10, // Random horizontal offset
    }
    
    setFlyingThumbs((prev) => [...prev, newThumb])
    
    // Remove the thumb after animation completes
    setTimeout(() => {
      setFlyingThumbs((prev) => prev.filter((thumb) => thumb.id !== newThumb.id))
    }, 1000)
    
    try {
      if (onUpvote) {
        // The parent hook will handle optimistic update and server sync
        await onUpvote(tip.id)
      }
    } catch (error) {
      // Error is handled by parent component with toast
    } finally {
      setIsUpvoting(false)
    }
  }

  const handleEdit = () => {
    if (onEdit && canModify) {
      onEdit(tip)
    }
  }

  const handleDelete = () => {
    if (onDelete && canModify) {
      onDelete(tip.id)
    }
  }

  // Use the passed canModify prop instead of internal logic for consistency
  const isOwnTip = canModify

  // Get display name and avatar with proper fallbacks
  const getAuthorInfo = () => {
    // For own tips, prioritize current user data to ensure fresh info
    if (isOwnTip && user) {
      return {
        name: user.name || user.displayName || tip.authorName || 'You',
        avatar: user.avatarUrl || user.photoURL || tip.authorImage || tip.authorAvatar
      }
    }
    
    // For other users' tips, use tip data
    const authorName = tip.authorName || tip.author?.name || 'Anonymous'
    const authorAvatar = tip.authorImage || tip.authorAvatar || tip.author?.avatarUrl || tip.author?.imageUrl
    
    return {
      name: authorName,
      avatar: authorAvatar
    }
  }

  const authorInfo = getAuthorInfo()
  const isEdited = tip.updatedAt && tip.updatedAt !== tip.createdAt

  // Sync local upvotes state with tip prop changes (for optimistic updates)
  React.useEffect(() => {
    const newUpvotes = Number.isFinite(Number(tip?.upvotes)) ? Number(tip.upvotes) : 0
    setUpvotes(newUpvotes)
  }, [tip?.upvotes])

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <CardHeader className="flex items-center gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
          {authorInfo.avatar ? (
            <img src={authorInfo.avatar} alt={authorInfo.name} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            (authorInfo.name.charAt(0).toUpperCase())
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="truncate text-xs font-medium text-slate-900">{authorInfo.name}</div>
              <div className="truncate text-[11px] text-slate-500 flex items-center gap-1">
                <span>{formatDate(tip.createdAt)}</span>
                {isEdited && (
                  <span className="text-[11px] text-slate-400">
                    (edited)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <h3 className="text-base font-semibold text-slate-900">{tip.title}</h3>
        {showContent && (
          <p className="mt-2 line-clamp-3 text-sm text-slate-900">{tip.content}</p>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between mt-auto relative">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 relative overflow-visible">
          <svg className="h-3.5 w-3.5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          {upvotes}
          
          {/* Flying thumbs up animations */}
          {flyingThumbs.map((thumb) => (
            <svg
              key={thumb.id}
              className="absolute h-3.5 w-3.5 text-emerald-600 pointer-events-none"
              style={{
                left: `${thumb.startX}px`,
                animation: 'flyUp 1s ease-out forwards',
              }}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
          ))}
        </span>
        {user ? (
          isOwnTip ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                title="Edit tip"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                title="Delete tip"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          ) : (
            <Button 
              className="h-8 px-3 text-xs shadow-none" 
              type="button" 
              onClick={handleUpvote}
              disabled={isUpvoting}
            >
              {isUpvoting ? 'Upvoting...' : 'Upvote'}
            </Button>
          )
        ) : (
          <button
            onClick={onLoginRequired}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium underline-offset-2 hover:underline transition-colors"
          >
            Log in to upvote
          </button>
        )}
        
        <style>{`
          @keyframes flyUp {
            0% {
              transform: translateY(0) scale(1) rotate(0deg);
              opacity: 1;
            }
            50% {
              transform: translateY(-30px) scale(1.3) rotate(10deg);
              opacity: 0.8;
            }
            100% {
              transform: translateY(-60px) scale(0.5) rotate(20deg);
              opacity: 0;
            }
          }
        `}</style>
      </CardFooter>
    </Card>
  )
}


