import { useState } from 'react'
import clsx from 'clsx'

export default function ProfileAvatar({ 
  user, 
  size = 'md', 
  className = '',
  showName = false,
  fallbackToInitials = true 
}) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const userName = user?.name || user?.displayName || 'User'
  const userEmail = user?.email || ''
  const avatarUrl = user?.avatarUrl || user?.photoURL || ''

  // Generate initials from name
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  // Size variants
  const sizeClasses = {
    sm: {
      container: 'h-6 w-6',
      text: 'text-xs',
      nameText: 'text-xs'
    },
    md: {
      container: 'h-8 w-8',
      text: 'text-xs',
      nameText: 'text-sm'
    },
    lg: {
      container: 'h-10 w-10',
      text: 'text-sm',
      nameText: 'text-base'
    },
    xl: {
      container: 'h-16 w-16',
      text: 'text-lg',
      nameText: 'text-lg'
    },
    '2xl': {
      container: 'h-24 w-24',
      text: 'text-2xl',
      nameText: 'text-xl'
    }
  }

  const currentSize = sizeClasses[size] || sizeClasses.md

  // Handle image load success
  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  // Handle image load error
  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  // Determine what to show
  const shouldShowImage = avatarUrl && !imageError
  const shouldShowInitials = fallbackToInitials && (!avatarUrl || imageError)

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div className={clsx('relative flex-shrink-0', currentSize.container)}>
        {shouldShowImage ? (
          <>
            {imageLoading && (
              <div className={clsx(
                'absolute inset-0 flex items-center justify-center rounded-full bg-slate-200 animate-pulse',
                currentSize.container
              )}>
                <div className="h-4 w-4 rounded-full bg-slate-300" />
              </div>
            )}
            <img
              src={avatarUrl}
              alt={`${userName}'s profile`}
              className={clsx(
                'rounded-full object-cover ring-2 ring-white shadow-sm transition-opacity',
                currentSize.container,
                imageLoading ? 'opacity-0' : 'opacity-100'
              )}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          </>
        ) : shouldShowInitials ? (
          <div className={clsx(
            'flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 font-bold uppercase text-white shadow-sm ring-2 ring-white',
            currentSize.container,
            currentSize.text
          )}>
            {userInitials || '?'}
          </div>
        ) : (
          <div className={clsx(
            'flex items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-slate-500 text-white shadow-sm ring-2 ring-white',
            currentSize.container,
            currentSize.text
          )}>
            <svg 
              className="h-1/2 w-1/2" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      {showName && (
        <div className="min-w-0 flex-1">
          <p className={clsx('font-medium text-slate-900 truncate', currentSize.nameText)}>
            {userName}
          </p>
          {userEmail && size !== 'sm' && (
            <p className="text-xs text-slate-500 truncate">
              {userEmail}
            </p>
          )}
        </div>
      )}
    </div>
  )
}